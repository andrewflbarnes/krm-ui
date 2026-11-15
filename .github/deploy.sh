#!/usr/bin/env bash

pnpm exec netlify deploy \
  --dir dist \
  --message "$(git log -1 --oneline --no-decorate)" \
  --prod \
  --functions netlify/functions
