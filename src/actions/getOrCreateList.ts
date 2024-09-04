/*
 * SPDX-License-Identifier: LicenseRef-AllRightsReserved
 *
 * License-Url: https://github.com/0xkrauser/erc721m-indexer/LICENSES/LicenseRef-AllRightsReserved.txt
 *
 * SPDX-FileType: SOURCE
 *
 * SPDX-FileCopyrightText: 2024 Johannes KraToken III <krauser@co.xyz>
 *
 * SPDX-FileContributor: Johannes KraToken III <krauser@co.xyz>
 */

import type { eventLog, handlerContext, List } from "generated"
import type { Address } from "viem"

import { INITIAL_LIST } from "../../generatedEntities"

export async function getOrCreateList({
  context,
  contract,
  event,
  id,
}: {
  context: handlerContext
  contract: Address
  event: eventLog<unknown>
  id: bigint
}): Promise<{ data: List; newItem: boolean }> {
  const { block, chainId } = event

  const contract_id = `${chainId}_${contract}`

  const list_id = `${contract_id}_${id}`

  const currentList = await context.List.get(list_id)

  if (currentList) return { data: currentList, newItem: false }

  const newList: List = {
    ...INITIAL_LIST,
    id: list_id,
    listId: id,
    collection_id: contract_id,
    createdBlockNumber: block.number,
    createdTimestamp: block.timestamp,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  return { data: newList, newItem: true }
}
