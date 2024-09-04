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

import type { Contract, eventLog, handlerContext } from "generated"
import type { Address } from "viem"

import { INITIAL_CONTRACT } from "../../generatedEntities"
import { getContractId } from "./getContractId"

export async function getOrCreateContract({
  context,
  contract,
  creator,
  event,
}: {
  context: handlerContext
  contract: Address
  creator?: Address
  event: eventLog<unknown>
}): Promise<{ data: Contract; newItem: boolean }> {
  const { block, chainId } = event

  const { contract_id } = getContractId({ chainId, contract })

  const currentContract = await context.Contract.get(contract_id)

  if (currentContract) return { data: currentContract, newItem: false }

  const timestamps: {
    createdBlockNumber: number
    createdTimestamp: number
    encounteredBlockNumber: number
    encounteredTimestamp: number
  } = {
    createdBlockNumber: 0,
    createdTimestamp: 0,
    encounteredBlockNumber: 0,
    encounteredTimestamp: 0,
  }

  if (creator) {
    timestamps.createdBlockNumber = block.number
    timestamps.createdTimestamp = block.timestamp
  } else {
    timestamps.encounteredBlockNumber = block.number
    timestamps.encounteredTimestamp = block.timestamp
  }

  const newContract: Contract = {
    ...INITIAL_CONTRACT,
    id: contract_id,
    chainId,
    address: contract,
    wallet_id: contract,
    creator_id: creator ?? "",
    ...timestamps,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  return { data: newContract, newItem: true }
}
