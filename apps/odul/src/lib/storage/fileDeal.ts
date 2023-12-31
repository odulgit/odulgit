import { lighthouseCAR } from "@hollowleaf/odul-storage"
import { getConfig } from "../service/config"

const apiKey: string | undefined = getConfig().filecoin?.lightHouse?.apiKey

export const deal = async (filePath: string) => {
  if (!apiKey) {
    throw new Error("Please set your api key in config file")
  }
  return await lighthouseCAR(filePath, apiKey)
}
