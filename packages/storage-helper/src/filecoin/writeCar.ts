// export const writeCar = async (carParts: [any]) => {
//   const { createFileEncoderStream, CAREncoderStream } = await import("ipfs-car")
//   const file = new Blob(carParts, { type: "application/car" })
//   const carStream = createFileEncoderStream(file).pipeThrough(new CAREncoderStream())
//   console.log(carStream)
// }

// writeCar(["Hello ipfs-car!"]).then(() => console.log("done")).catch(console.error)
