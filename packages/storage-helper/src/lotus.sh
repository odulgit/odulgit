#!/usr/bin/env bash
QID=$1
echo "QID: $QID"
docker-compose exec lotus lotus client deal $QID t01000 1 1000000