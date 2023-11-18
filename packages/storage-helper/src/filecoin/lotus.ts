import { runCommand } from "../utils/async-run-command"

export const lotus = async (qID: string) => {
  // check docker compose exist
  const { stdout: dockerComposeVersion } = await runCommand("docker-compose", ["--version"])
  if (!dockerComposeVersion) {
    throw Error("docker-compose not found")
  }
  const { stdout } = await runCommand("docker-compose", [
    "exec",
    "lotus",
    "lotus",
    "client",
    "deal",
    qID,
    "t01000",
    "1",
    "1000000",
  ])
  console.log(stdout)
}

const example = async () => {
  const qID = "1"
  await lotus(qID)
}

// example().catch((error) => {
//   console.error(error)
//   process.exit(1)
// })
