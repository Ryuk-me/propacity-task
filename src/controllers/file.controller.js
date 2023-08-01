import HttpException from "../utils/httpException.js"
import { db } from "../db.js"
import * as AWS from "../utils/aws_sdk.js"

export const createFile = async (req, res) => {
	let file_location = String(req.body.file_location?.trim())
	if (!file_location) return HttpException(res, 422, { file_location: ["can't be blank"] })

	if (String(file_location).endsWith("/")) return HttpException(res, 422, "Folder name cannot end with '/'.")
	file_location = req.user.username + "/" + file_location + "/"

	const file = req.file
	let file_name = file.originalname
	let mimetype = file.mimetype
	let size = file.size

	let folder = await getFolder(file_location)
	if (!folder) return HttpException(res, 404, "Given location not found")

	if (await AWS.uploadFile(file, file_location, file_name)) {
		const newFile = await db.file.create({
			data: {
				file_name: file_name,
				owner_id: req.user.id,
				folder_id: folder.id,
				size: size,
				file_location: file_location + file_name
			}
		})
		return res.status(201).json(newFile)
	} else return HttpException(res, 500, "Unable to upload this file")
}

export const renameFile = async (req, res) => {
	const newFilename = req.body.file_name?.trim()
	if (!newFilename) if (!file_location) return HttpException(res, 422, { file_name: ["can't be blank"] })
	let file_location = String(req.body.file_location?.trim())
	if (!file_location) return HttpException(res, 422, { file_location: ["can't be blank"] })

	let file = await getFile(file_location)
	if (!file) return HttpException(res, 404, "Provided file doesn't exist at this location.")

	if (file.owner_id !== req.user.id) return HttpException(res, 401, "Not Authorised")
	let folder = await getFolderById(file.folder_id)

	if (await AWS.renameFile(file_location, newFilename, folder.folder_location)) {
		const updatedFile = await db.file.update({
			where: {
				id: file.id
			},
			data: {
				file_location: folder.folder_location + newFilename,
				file_name: newFilename
			}
		})
		return res.status(200).json(updatedFile)
	} else return HttpException(res, 500, "Unable to rename this file")
}

const getFolder = async (folder_location) => {
	let folder = await db.folder.findUnique({
		where: {
			folder_location: folder_location
		}
	})
	return folder
}

export const deleteFile = async (req, res) => {
	const file_location = req.body.file_location?.trim()
	if (!file_location) return HttpException(res, 422, { file_location: ["can't be blank"] })

	let file = await getFile(file_location)

	if (!file) return HttpException(res, 404, "Provided file doesn't exist at this location.")

	if (file.owner_id !== req.user.id) return HttpException(res, 401, "Not Authorised")
	if (await AWS.deleteFile(file_location)) {
		await db.file.delete({
			where: {
				file_location: file_location
			}
		})
		return res.status(204).json({})
	} else return HttpException(res, 500, "Unable to delete this file")
}

const getFolderById = async (folder_id) => {
	let folder = await db.folder.findUnique({
		where: {
			id: folder_id
		}
	})
	return folder
}

const getFile = async (file_location) => {
	let file = await db.file.findUnique({
		where: {
			file_location: file_location
		}
	})
	return file
}
