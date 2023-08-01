import express from "express"
import * as JWT from "../../../utils/jwt_token.js"
import * as FileController from "../../../controllers/file.controller.js"
import MulterUpload from "../../../utils/multer.js"
const router = express.Router()

router.post("/create", MulterUpload.single("file"), JWT.verifyAuthToken, FileController.createFile)
router.post("/rename", JWT.verifyAuthToken, FileController.renameFile)
router.delete("/delete", JWT.verifyAuthToken, FileController.deleteFile)
router.put("/move", JWT.verifyAuthToken, FileController.moveFile)

// router.get("/me", JWT.verifyAuthToken, UserController.whoAmI)
export { router as FileRouter }
