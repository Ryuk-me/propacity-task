import { db } from "../db.js"
import { Prisma } from "@prisma/client"
import { hashPassword } from "../utils/hashing.js"
import HttpException from "../utils/httpException.js"

// https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
export const exclude = (user, ...keys) => {
	for (let key of keys) {
		delete user[key]
	}
	return user
}

export const validateFields = (req, res, isEmailTobeValidated = false) => {
	const password = req.body.password?.trim()
	const email = req.body.email?.trim()
	const username = req.body.username?.trim()
	if (!password) throw HttpException(res, 422, { password: ["can't be blank"] })
	if (!username) throw HttpException(res, 422, { username: ["can't be blank"] })
	if (isEmailTobeValidated) {
		if (!email) throw HttpException(res, 422, { email: ["can't be blank"] })
	}
}

export const createUser = async (req, res) => {
	try {
		validateFields(req, res, true)
	} catch (error) {
		return error
	}
	try {
		req.body.password = await hashPassword(req.body.password)
		const newUser = await db.user.create({ data: req.body })
		return res.status(201).json(exclude(newUser, "password"))
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === "P2002") {
				return HttpException(res, 422, "A user already exist with this " + e.meta?.target?.join("") + ".")
			} else if (e.code === "P2000") {
				return HttpException(res, 422, "Provided value is too long for the column.")
			}
		} else if (e instanceof Prisma.PrismaClientValidationError) {
			return HttpException(res, 422, "Validation error occurred.")
		} else {
			return HttpException(res, 500, "Internal server error.")
		}
	}
}

export const whoAmI = async (req, res) => {
	return res.status(200).json(exclude(req.user, "password"))
}

export const getUser = async (id = null, username = null, email = null) => {
	let user = null
	if (id) {
		user = await db.user.findUnique({
			where: {
				id: id
			}
		})
	} else if (username) {
		user = await db.user.findUnique({
			where: {
				username: username
			}
		})
	} else if (username) {
		user = await db.user.findUnique({
			where: {
				email: email
			}
		})
	}
	return user
}
