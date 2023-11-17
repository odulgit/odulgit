import fs from "node:fs"
const getHelia = async () => {
  const { createHelia } = await import("helia")
  const { unixfs } = await import("@helia/unixfs")
  const { createLibp2p } = await import("libp2p")
  const { bootstrap } = await import("@libp2p/bootstrap")
  const { tcp } = await import("@libp2p/tcp")
  const { MemoryDatastore } = await import("datastore-core")
  const { MemoryBlockstore } = await import("blockstore-core")
  const { noise } = await import("@chainsafe/libp2p-noise")
  const { yamux } = await import("@chainsafe/libp2p-yamux")
  const { identifyService } = await import("libp2p/identify")

  // the blockstore is where we store the blocks that make up files
  const blockstore = new MemoryBlockstore()

  // application-specific data lives in the datastore
  const datastore = new MemoryDatastore()

  // libp2p is the networking layer that underpins Helia
  const libp2p = await createLibp2p({
    datastore,
    addresses: {
      listen: [
        "/ip4/127.0.0.1/tcp/0",
      ],
    },
    transports: [
      tcp(),
    ],
    connectionEncryption: [
      noise(),
    ],
    streamMuxers: [
      yamux(),
    ],
    peerDiscovery: [
      bootstrap({
        list: [
          "/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWEiengBkTjRwdCY9xjeU4WZVx7A5EihemNHuWHWuMP1yo",
        ],
      }),
    ],
    services: {
      identify: identifyService(),
    },
  })

  const helia = await createHelia({
    datastore,
    blockstore,
    libp2p,
  })

  const unixFs = unixfs(helia)
  return { helia, unixFs }
}

export const uploadFile = async (data: Buffer): Promise<string> => {
  const kuboClient = await import("kubo-rpc-client")

  const kubo = kuboClient.create({ host: "127.0.0.1" })
  const cid = (await kubo.add(data)).cid
  await kubo.pin.add(cid)

  return cid.toString()
}

export const downloadFile = async (cid: string): Promise<Buffer> => {
  const { helia, unixFs } = await getHelia()

  let data: Buffer = Buffer.from([])
  const { CID } = await import("multiformats/cid")
  for await (const chunk of unixFs.cat(CID.parse(cid))) {
    data = Buffer.concat([data, chunk])
  }

  await helia.stop()

  return data
}

export const uploadDir = async (dir: string, hidden: boolean = false): Promise<string> => {
  const kuboClient = await import("kubo-rpc-client")

  dir = dir.replace(/\/$/, "")
  const parentDir = dir.substring(0, dir.lastIndexOf("/"))
  const thisDir = dir.substring(dir.lastIndexOf("/") + 1)

  const kubo = kuboClient.create({ host: "127.0.0.1" })

  let cid = ""
  for await (const file of kubo.addAll(kuboClient.globSource(parentDir, `${thisDir}/**/*`, { hidden }))) {
    await kubo.pin.add(file.cid)
    if (file.path === thisDir) {
      cid = file.cid.toString()
    }
  }
  return cid
}

export const downloadDir = async (cid: string, dir: string): Promise<Buffer> => {
  const { helia, unixFs } = await getHelia()

  const data: Buffer = Buffer.from([])
  const { CID } = await import("multiformats/cid")
  for await (const entry of unixFs.ls(CID.parse(cid))) {
    if (entry.type === "file") {
      fs.writeFileSync(`${dir}/${entry.name}`, Buffer.from(entry.unixfs.data || []))
    } else if (entry.type === "directory") {
      fs.mkdirSync(`${dir}/${entry.name}`)
      await downloadDir(entry.cid.toString(), `${dir}/${entry.name}`)
    }
  }

  await helia.stop()

  return data
}
