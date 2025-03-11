#!/usr/bin/env bash
branch=${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}}
if [ "$branch" = "main" ]
then
  branch=
fi
pnpm pkg set version="$(pnpm pkg get version | awk -F'"' '{print $2}')-${branch:+$branch-}$(git rev-parse --short HEAD)"
pnpm pkg get version
