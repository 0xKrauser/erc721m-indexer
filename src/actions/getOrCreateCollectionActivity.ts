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

import type { CollectionActivity, eventLog, handlerContext } from "generated"
import { type Address } from "viem"

import { INITIAL_COLLECTION_ACTIVITY } from "../../generatedEntities"
import { getContractId } from "./getContractId"

export async function getOrCreateCollectionActivity({
  context,
  contract,
  event,
  wallet,
}: {
  context: handlerContext
  contract: Address
  event: eventLog<unknown>
  wallet: Address
}): Promise<{ data: CollectionActivity; newItem: boolean }> {
  const { block, chainId } = event

  const { contract_id } = getContractId({ chainId, contract })
  const collectionActivity_id = `${contract_id}_${wallet}`

  const currentCollection = await context.CollectionActivity.get(collectionActivity_id)

  if (currentCollection) return { data: currentCollection, newItem: false }

  const newCollection: CollectionActivity = {
    ...INITIAL_COLLECTION_ACTIVITY,
    id: collectionActivity_id,
    collection_id: contract_id,
    wallet_id: wallet,
    createdBlockNumber: block.number,
    createdTimestamp: block.timestamp,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  return { data: newCollection, newItem: true }
}
