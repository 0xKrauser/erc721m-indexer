export function getContractId({ chainId, contract }: { chainId: number; contract: string }): {
  contract_id: string
} {
  const contract_id = `${chainId}_${contract}`
  return { contract_id }
}
