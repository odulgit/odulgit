import { uploadData } from "@hollowleaf/odul-storage"
import { getConfig } from "../service/config"

const apiKey: string | undefined = getConfig().filecoin?.lightHouse?.apiKey

export const upload = async (filePath: string) => {
  if (!apiKey) {
    throw new Error("Please set your api key in config file")
  }
  return await uploadData(filePath, apiKey)
}
