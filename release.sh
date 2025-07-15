#!/usr/bin/env bash

do_release() {
  if ! git cliff --bumped-version &>/dev/null
  then
    echo "git-cliff is not installed. Please install it to proceed." >&2
    return 1
  fi

  local branch; branch="$(git rev-parse --abbrev-ref HEAD)" || return $?
  if [[ "$branch" != "main" ]]
  then
    echo "You must be on the main branch to release." >&2
    return 1
  fi

  git cliff --output CHANGELOG.md --bump || return $?

  local next; next="$(git cliff --bumped-version)" || return $?
  pnpm pkg set version="$next" || return $?

  git add CHANGELOG.md package.json || return $?
  git commit -m "chore(release): prepare for $next [skip ci]" || return $?
  git tag "$next" || return $?

  git push origin main
  git push origin tag "$next"
}

do_release "$@"
