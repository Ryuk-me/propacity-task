import {
	S3Client,
	CreateBucketCommand,
	PutObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand
} from "@aws-sdk/client-s3"
import { createReadStream } from "fs"
import dotenv from "dotenv"
dotenv.config()

const BUCKET_NAME = process.env.BUCKET_NAME

const client = new S3Client({
	region: "ap-south-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY
	}
})

export const createBucket = async () => {
	const command = new CreateBucketCommand({
		Bucket: BUCKET_NAME,
		CreateBucketConfiguration: {
			LocationConstraint: "ap-south-1"
		}
	})

	try {
		await client.send(command)
		return `Successfully created a bucket called "${BUCKET_NAME}"`
	} catch (err) {
		if (err["$metadata"].httpStatusCode === 409) {
			return `Bucket with this name "${BUCKET_NAME}" already exist`
		} else if (err["$metadata"].httpStatusCode === 403) {
			return err.Code
		}
	}
}

export const createFolder = async (location) => {
	console.log(location)
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: location
	})
	try {
		const response = await client.send(command)
		return true
	} catch (err) {
		console.error(err)
		return false
	}
}

export const uploadFile = async function (file, location, filename) {
	const fileStream = createReadStream(file.path)
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: `${location}${filename}`,
		Body: fileStream
	})
	try {
		const res = await client.send(command)
		return true
	} catch (error) {
		return false
	}
}

export const renameFile = async (file_location, newfilename, folder_location) => {
	const command = new CopyObjectCommand({
		Bucket: BUCKET_NAME,
		CopySource: `${BUCKET_NAME}/${file_location}`,
		Key: `${folder_location}${newfilename}`
	})
	try {
		const res = await client.send(command)
		await deleteFile(file_location)
		return true
	} catch (error) {
		return false
	}
}

export const moveFile = async (file_location, new_folder_location, file_name) => {
	const command = new CopyObjectCommand({
		Bucket: BUCKET_NAME,
		CopySource: `${BUCKET_NAME}/${file_location}`,
		Key: `${new_folder_location}${file_name}`
	})
	try {
		const res = await client.send(command)
		await deleteFile(file_location)
		return true
	} catch (error) {
		return false
	}
}

export const deleteFile = async (file_location) => {
	const command = new DeleteObjectCommand({
		Bucket: BUCKET_NAME,
		Key: `${file_location}`
	})
	try {
		const res = await client.send(command)
		return true
	} catch (error) {
		return false
	}
}
