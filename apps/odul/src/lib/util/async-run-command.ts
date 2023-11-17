import { spawn } from "node:child_process"

export const runCommand = async (
  command: string,
  args?: readonly string[] | undefined,
) => {
  const result = await new Promise<{ stdout?: string; stderr?: string }>(
    (resolve, reject) => {
      let stdout: string | undefined
      let stderr: string | undefined

      const childProcess = spawn(command, args)

      childProcess.stdout.on("data", (data: Buffer) => {
        stdout = data.toString()
      })
      childProcess.stderr.on("data", (data: Buffer) => {
        stderr = data.toString()
      })

      childProcess.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          console.error(stderr)
          reject(Error(`child process exited with code ${code}`))
        }
      })
    },
  )
  return result
}
