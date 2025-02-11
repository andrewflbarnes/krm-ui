#!/usr/bin/env bash

pnpm install -g corepack@latest
corepack enable
pnpm install
pnpm pkg set version="$(pnpm pkg get version | awk -F'"' '{print $2}')-$(git rev-parse --short HEAD)"
pnpm build
cp netlify/_redirects dist/_redirects
