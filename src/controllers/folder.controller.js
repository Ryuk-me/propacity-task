import HttpException from "../utils/httpException.js"
import { db } from "../db.js"
import * as AWS from "../utils/aws_sdk.js"

export const createFolder = async (req, res) => {
  const folder_name = String(req.body.folder_name?.trim())

  if (!folder_name) return HttpException(res, 422, { folder_name: ["can't be blank"] })

  if (String(folder_name).endsWith("/")) return HttpException(res, 422, "Folder name cannot ends with '/'.")

  const owner_id = req.user.id
  const folder_location = req.user.username + "/" + folder_name + "/"
  if (await isFolderAlreadyExist(folder_location)) {
    return HttpException(res, 409, "Folder with this name already exist at this location, rename to continue.")
  }
  try {
    if (!(await AWS.createFolder(folder_location)))
      return HttpException(res, 500, "Not able to create folder on AWS.")
    const newFolder = await db.folder.create({
      data: {
        folder_name: folder_name.split("/").slice(-1)[0],
        owner_id: owner_id,
        folder_location: folder_location
      }
    })
    return res.status(201).json(newFolder)
  } catch (error) {
    return HttpException(res, 500, "Internal server error.")
  }
}

export const isFolderAlreadyExist = async (folder_location) => {
  let exist = await db.folder.findUnique({
    where: {
      folder_location: folder_location
    }
  })
  return true ? exist : false
}

// export const isAllowedToCreateSubfolders = async (owner_id) => {

//   let exist = await db.folder.findUnique({
//     where: {
//       AND: [{
//         is_allowed_to_create_sub_folder: true,

//       }, {
//         owner_id: owner_id
//       }]
//     }
//   })
//   return
// }