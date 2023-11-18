// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { uploadData } from "storage-helper"
import { getConfig } from "../service/config"

const apiKey: string | undefined = getConfig().filecoin?.lightHouse?.apiKey

export const upload = async (filePath: string) => {
  if (!apiKey) {
    throw new Error("Please set your api key in config file")
  }
  return await uploadData(filePath, apiKey)
}
