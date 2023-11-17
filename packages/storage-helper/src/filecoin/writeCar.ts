import { createFileEncoderStream, CAREncoderStream } from "ipfs-car"

export const writeCar = (carParts: []) => {
  const file = new Blob(carParts, { type: "application/car" })
  const carStream = createFileEncoderStream(file).pipeThrough(new CAREncoderStream())
}
