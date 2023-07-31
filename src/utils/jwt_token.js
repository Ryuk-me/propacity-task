import jwt from "jsonwebtoken"
import HttpException from "./httpException.js"
import * as UserController from "../controllers/user.controller.js"

export function generateAccessToken(email, username, role) {
	return jwt.sign({ email: email, username: username, role: role }, process.env.JWT_SECRET, { expiresIn: "2000s" })
}

function getTokenFromHeader(req) {
	if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
		return req.headers.authorization.split(" ")[1]
	}
	return null
}

export async function verifyAuthToken(req, res, next) {
	const token = getTokenFromHeader(req)
	if (token == null) return HttpException(res, 403, "Could not validate credentials")

	jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
		if (err) return HttpException(res, 403, "Could not validate credentials")

		let u = await UserController.getUser(null, user.username, null)
		if (u) req.user = u
		else return HttpException(res, 404, "User not found.")

		next()
	})
}
