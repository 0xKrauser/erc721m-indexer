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

import type { Collection, eventLog, handlerContext } from "generated"
import { type Address } from "viem"

import { INITIAL_COLLECTION } from "../../generatedEntities"
import { getContractId } from "./getContractId"
import { getTokenId } from "./getTokenId"

export async function getOrCreateCollection({
  context,
  contract,
  event,
}: {
  context: handlerContext
  contract: Address
  event: eventLog<unknown>
}): Promise<{ data: Collection; newItem: boolean }> {
  const { block, chainId } = event

  const { contract_id } = getContractId({ chainId, contract })

  const currentCollection = await context.Collection.get(contract_id)

  if (currentCollection) return { data: currentCollection, newItem: false }

  const { token_id } = getTokenId({ contract_id, tokenId: 0n })

  const newCollection: Collection = {
    ...INITIAL_COLLECTION,
    id: contract_id,
    contract_id,
    erc2981_id: token_id,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  return { data: newCollection, newItem: true }
}
