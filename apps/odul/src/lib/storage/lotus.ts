// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lotus } from "storage-helper"
import { getConfig } from "../service/config"

const apiKey: string | undefined = getConfig().filecoin?.lightHouse?.apiKey

export const lotusUpload = async (cid: string) => {
  if (!apiKey) {
    throw new Error("Please set your api key in config file")
  }
  return await lotus(cid)
}
