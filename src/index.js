import express from "express"
import dotenv from "dotenv"
import Helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import packageJson from "./utils/package.json.reader.js"
import { isConnected } from "./db.js"
import { UserRouter } from "./routers/api/v1/user.router.js"
import { errorHandler, notFound } from "./middlewares/error.middleware.js"
import { AuthRouter } from "./routers/api/v1/auth.router.js"
dotenv.config()

console.log(
	"🚀",
	"@" + packageJson.author.username + "/" + packageJson.name,
	"v" + packageJson.version + ` [${process.env.NODE_ENV}]`,
	(await isConnected()) ? "[🟢 Database]" : "[🔴 Database]"
)

// PORT
const port = process.env.PORT || 8009

const app = express()

app.use(
	express.urlencoded({
		extended: true
	})
)
app.use(express.json())

// safeguarding HTTP headers
app.use(Helmet())

// logger
app.use(morgan("dev"))

// CORS middleware
app.use(
	cors({
		credentials: true
	})
)

// Health Endpoint
app.use("/health", async (req, res) => {
	res.status(200).json({
		app: packageJson.name,
		request_ip: req.ip,
		uptime: process.uptime(),
		hrtime: process.hrtime(),
		database: (await isConnected()) ? "connected" : "disconnected",
		mode: process.env.NODE_ENV || undefined,
		node_runtime: process.env.NODE_ENV == "development" ? process.version : undefined
	})
})

// User Routes
app.use("/api/v1/user", UserRouter)
app.use("/api/v1/auth", AuthRouter)

app.use(notFound)
app.use(errorHandler)

// Server Listening
app.listen(port, () => {
	isConnected()
	console.log("⚡[server] Running Visit: http://localhost:" + port)
})
