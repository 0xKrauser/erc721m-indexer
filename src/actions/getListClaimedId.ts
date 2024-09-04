import type { Address } from "viem"

export function getListClaimedId({ list_id, wallet }: { list_id: string; wallet: Address }): {
  listClaimed_id: string
} {
  const listClaimed_id = `${list_id}_${wallet}`
  return { listClaimed_id }
}
