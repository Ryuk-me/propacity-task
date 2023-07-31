const HttpException = (res, errorCode, message) => {
	return res.status(errorCode).json({ message: message })
}

export default HttpException
