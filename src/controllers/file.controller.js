import HttpException from "../utils/httpException.js"
import { db } from "../db.js"
import * as AWS from "../utils/aws_sdk.js"
import * as FolderController from "./folder.controller.js"

export const createFile = async (req, res) => {
	let file_location = String(req.body.file_location?.trim())
	if (!file_location) return HttpException(res, 422, { file_location: ["can't be blank"] })
	console.log(req.file)

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

export const getFolder = async (folder_location) => {
	let folder = await db.folder.findUnique({
		where: {
			folder_location: folder_location
		}
	})
	return folder
}
