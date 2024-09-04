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

import type { eventLog, handlerContext, Token } from "generated"
import type { Address } from "viem"

import { INITIAL_TOKEN } from "../../generatedEntities"
import { getContractId } from "./getContractId"
import { getTokenId } from "./getTokenId"

export async function getOrCreateToken({
  context,
  contract,
  event,
  minter,
  tokenId,
}: {
  context: handlerContext
  contract: Address
  event: eventLog<unknown>
  minter?: Address
  tokenId: bigint
}): Promise<{ data: Token; newItem: boolean }> {
  const { block, chainId } = event

  const { contract_id } = getContractId({ chainId, contract })
  const collection_id = contract_id

  const { token_id } = getTokenId({ contract_id, tokenId })

  const currentToken = await context.Token.get(token_id)

  if (currentToken) return { data: currentToken, newItem: false }

  const newToken: Token = {
    ...INITIAL_TOKEN,
    id: token_id,
    collection_id,
    tokenId,
    minterAddress: minter ?? "",
    minter_id: minter ?? "",
    erc2981_id: token_id,
    createdBlockNumber: block.number,
    createdTimestamp: block.timestamp,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  return { data: newToken, newItem: true }
}
