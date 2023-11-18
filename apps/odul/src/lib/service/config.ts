import fs from "node:fs"
import ini from "ini"

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

type ConfigType = DeepPartial<{
  ethereum: {
    privateKey: string
    networkUrl: string
    contract: string
  }
  ipfs: {
    bootstrap: {
      peerId: string
      host: string
      port: string
    }
    kubo: {
      host: string
    }
  }
  walletConnect: {
    projectId: string
  }
}>

const configPath = `${process.env.HOME}/.odulconfig`

export const getConfig = (): ConfigType => {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, "")
  }
  return ini.parse(fs.readFileSync(configPath, "utf-8")) as ConfigType
}

export const getConfigByName = (name: string): string | undefined => {
  const config = getConfig()
  let result: any = config
  const keys = name.split(".")
  for (let i = 0; i < keys.length; i += 1) {
    if (!Object.keys(result).includes(keys[i])) {
      result = undefined
      break
    }
    result = result[keys[i]]
  }
  return (typeof result === "string") ? result : JSON.stringify(result, null, 2)
}

export const setConfigByName = (name: string, value: string) => {
  const config = getConfig() as any
  let target = config
  const keys = name.split(".")
  for (let i = 0; i < keys.length; i += 1) {
    if (i === keys.length - 1) {
      target[keys[i]] = value
      break
    }

    if (!Object.keys(target).includes(keys[i])) {
      target[keys[i]] = {}
    }
    target = target[keys[i]]
  }

  fs.writeFileSync(configPath, ini.stringify(config))
}
