export function getTokenId({ contract_id, tokenId }: { contract_id: string; tokenId: bigint }): {
  token_id: string
} {
  const token_id = `${contract_id}_${tokenId}`
  return { token_id }
}
