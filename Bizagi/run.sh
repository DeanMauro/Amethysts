#!/bin/bash

case "$1" in
nodemon)
  nodemon --watch nodes --watch lib -e js,html --exec '/root/node_modules/.bin/node-red' ;;
*)
  node-red ;;
esac
