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

import type { eventLog, handlerContext, ListClaimed } from "generated"
import type { Address } from "viem"

import { INITIAL_LIST_CLAIMED } from "../../generatedEntities"
import { getContractId } from "./getContractId"
import { getListClaimedId } from "./getListClaimedId"
import { getListId } from "./getListId"

export async function getOrCreateListClaimed({
  context,
  contract,
  event,
  id,
  wallet,
}: {
  context: handlerContext
  contract: Address
  event: eventLog<unknown>
  id: bigint
  wallet: Address
}): Promise<{ data: ListClaimed; newItem: boolean }> {
  const { block, chainId } = event

  const { contract_id } = getContractId({ chainId, contract })
  const { list_id } = getListId({ contract_id, listId: id })
  const { listClaimed_id } = getListClaimedId({ list_id, wallet })

  const currentList = await context.ListClaimed.get(listClaimed_id)

  if (currentList) return { data: currentList, newItem: false }

  const newListClaimed: ListClaimed = {
    ...INITIAL_LIST_CLAIMED,
    id: listClaimed_id,
    list_id,
    wallet_id: wallet,
    createdBlockNumber: block.number,
    createdTimestamp: block.timestamp,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  return { data: newListClaimed, newItem: true }
}
