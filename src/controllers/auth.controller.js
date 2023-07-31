import * as UserController from "../controllers/user.controller.js"
import { matchPassword } from "../utils/hashing.js"
import HttpException from "../utils/httpException.js"
import * as JWT from "../utils/jwt_token.js"

export const loginUser = async (req, res) => {
	try {
		UserController.validateFields(req, res, false)
	} catch (error) {
		return error
	}
	const password = req.body.password?.trim()
	const username = req.body.username?.trim()
	let user = await UserController.getUser(null, username, null)
	if (user && (await matchPassword(password, user.password))) {
		return res.status(200).json({
			token_type: "Bearer",
			access_token: JWT.generateAccessToken(user.email, user.username, user.role)
		})
	} else {
		return HttpException(res, 401, "Not Authorised")
	}
}
