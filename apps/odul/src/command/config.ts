import type { Arguments, Argv } from "yargs"

export const command = "config"

export const desc = "odul setting"

export const builder = (yargs: Argv) => {
  return yargs
    .commandDir("config", { extensions: ["js", "ts"], exclude: /\.d\.ts$/ })
    .demandCommand()
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const handler = (argv: Arguments) => {
}
