export function composeURL(base: string, parameters: {[name: string]: string}): string {
  return base + '?' + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
}

export function parseParameters(parameters: string): {[name: string]: string} {
  const res = {}
  const p = parameters.split('&').map(kv => kv.split('='))
  for (const kv of p) {
    res[kv[0]] = kv[1]
  }
  return res
}
