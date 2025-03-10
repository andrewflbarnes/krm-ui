#!/usr/bin/env bash

install() {
  local f=$1
  if ! [ -d "$f" ]
  then
    return 0
  fi

  if ! [ -f "$f/package.json" ]
  then
    echo "No package.json found in $f, skipping" >&2
  fi

  echo "Installing $f..."
  (cd "$f" && pnpm install)
}

install_all() {
  for f in $(shopt -s nullglob; echo netlify/functions/*); do
    if ! install "$f"
    then
      echo "Failed to install deps for $f" >&2
      return 1
    fi
  done
}

install_all "$@"
