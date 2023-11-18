import { spawn } from "node:child_process"

export const runCommand = async (
  command: string,
  args?: readonly string[] | undefined,
  env?: typeof process.env,
) => {
  const result = await new Promise<{ stdout: string; stderr: string }>(
    (resolve, reject) => {
      let stdout = ""
      let stderr = ""

      const childProcess = spawn(command, args, { env: { ...process.env, ...env } })

      childProcess.stdout.on("data", (data: Buffer) => {
        stdout += data.toString()
      })
      childProcess.stderr.on("data", (data: Buffer) => {
        stderr += data.toString()
      })

      childProcess.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          console.error(stderr)
          reject(Error(`child process \`${command}${args ? ` ${args.join(" ")}` : ""}\` exited with code ${code}\n${stderr}`))
        }
      })
    },
  )
  return result
}
