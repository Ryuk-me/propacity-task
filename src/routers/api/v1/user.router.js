import express from "express"
import * as UserController from "../../../controllers/user.controller.js"
import * as JWT from "../../../utils/jwt_token.js"

const router = express.Router()

router.post("/", UserController.createUser)

router.get("/me", JWT.verifyAuthToken, UserController.whoAmI)
export { router as UserRouter }
