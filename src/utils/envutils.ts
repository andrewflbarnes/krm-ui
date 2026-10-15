const domains = {
  prod: ["krm.andrewflbarnes.com"],
  dev: ["localhost", "127.0.0.1", "[::1]"],
}
export function getEnv() {
  const hostname = window.location.hostname

  for (const [env, domainList] of Object.entries(domains)) {
    if (domainList.includes(hostname)) {
      return env
    }
  }

  return hostname
}
