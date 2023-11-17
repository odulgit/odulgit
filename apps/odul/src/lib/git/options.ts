import { runCommand } from "../util/async-run-command"

export interface GitOption {
  dir?: string
  workTree?: string
}

export const getEnv = (option?: GitOption): Parameters<typeof runCommand>[2] => {
  const env: (typeof process.env) = {}

  if (option?.workTree) {
    env.GIT_WORK_TREE = option.workTree
    env.GIT_DIR = `${option.workTree}/.git`
  }

  if (option?.dir) {
    env.GIT_DIR = option.dir
  }

  return env
}
