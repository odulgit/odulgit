#! /bin/sh

docker run -d \
  --name ipfs_host \
  -v $HOME/ipfs/staging:/export \
  -v $HOME/ipfs/data:/data/ipfs \
  -p 4001:4001 \
  -p 4001:4001/udp \
  -p 127.0.0.1:8080:8080 \
  -p 127.0.0.1:5001:5001 \
  ipfs/kubo:latest
