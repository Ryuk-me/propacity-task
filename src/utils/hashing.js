import bcrypt from "bcryptjs"

const matchPassword = async (entered_password, hashed_password) => {
	return await bcrypt.compare(entered_password, hashed_password)
}
const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10)
	password = await bcrypt.hash(password, salt)
	return password
}

export { matchPassword, hashPassword }
