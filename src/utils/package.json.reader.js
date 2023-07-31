import { readFileSync } from "node:fs"

const readPakcageData = readFileSync("./package.json", "utf-8")
const packageJson = JSON.parse(readPakcageData)

export default packageJson
