export function getListId({ contract_id, listId }: { contract_id: string; listId: bigint }): {
  list_id: string
} {
  const list_id = `${contract_id}_${listId}`
  return { list_id }
}
