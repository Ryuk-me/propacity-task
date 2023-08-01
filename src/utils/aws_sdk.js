import { S3Client, CreateBucketCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
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

export const uploadFile = async function (location, filename, body) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${location}/${filename}`,
    Body: body
  })
  try {
    const res = await client.send(command)
    return true
  } catch (error) {
    return false
  }
}

export const listObjects = async function () {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    MaxKeys: 1
  })

  try {
    let isTruncated = true

    console.log("Your bucket contains the following objects:\n")
    let contents = ""

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(command)
      const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n")
      contents += contentsList + "\n"
      isTruncated = IsTruncated
      command.input.ContinuationToken = NextContinuationToken
    }
    console.log(contents)
  } catch (err) {
    console.error(err)
  }
}

// export const checkFolderAlreadyExist = async (username, folder_name) => {

//   const output = await client.send(
//     new ListObjectsV2Command({
//       Bucket: BUCKET_NAME,
//       Prefix: username + "/" + folder_name,
//       MaxKeys: 1,
//     })
//   );
//   return true ? output.Contents?.length > 0 : false
// }
