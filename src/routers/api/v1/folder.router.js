import express from "express"
import * as JWT from "../../../utils/jwt_token.js"
import * as FolderController from "../../../controllers/folder.controller.js"
const router = express.Router()

router.post("/create", JWT.verifyAuthToken, FolderController.createFolder)

export { router as FolderRouter }
