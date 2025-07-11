export function flattenVrfKey(K: any) {
  return {
    id: K?.id,
    sk: K?.sk,
    pk: K?.pk,
    pkX: K?.pkX,
    pkY: K?.pkY,
    keyHash: K?.keyHash,
    chain: K?.chain?.name
  }
}
