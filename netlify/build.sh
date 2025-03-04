#!/usr/bin/env bash

pnpm install -g corepack@latest
corepack enable
pnpm install
# shellcheck disable=SC2153
branch=$BRANCH
if [ "$branch" = "main" ]
then
  branch=
fi
pnpm pkg set version="$(pnpm pkg get version | awk -F'"' '{print $2}')-${branch:+$branch-}$(git rev-parse --short HEAD)"
pnpm pkg get version
pnpm build
