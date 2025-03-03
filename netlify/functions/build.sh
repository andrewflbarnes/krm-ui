#!/usr/bin/env bash

build_func() {
  local f=$1
  if ! [ -d "$f" ]
  then
    return 0
  fi

  if ! [ -f "$f/package.json" ]
  then
    echo "No package.json found in $f, skipping" >&2
  fi

  echo "Building $f..."
  pnpm install
}

build_all() {
  for f in $(shopt -s nullglob; echo netlify/functions/*); do
    build_func "$f"
  done
}

build_all "$@"
