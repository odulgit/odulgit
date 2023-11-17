import crypto from "node:crypto"

const sha1 = (payload: string) => {
  const shasum = crypto.createHash("sha1")
  shasum.update(payload)
  return shasum.digest("hex")
}

export { sha1 }
