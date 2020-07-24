export async function sleep(ms: number = 1000) {
  return new Promise(r => setTimeout(() => r(), ms))
}
