/*
 * SPDX-License-Identifier: LicenseRef-AllRightsReserved
 *
 * License-Url: https://github.com/0xkrauser/erc721m-indexer/LICENSES/LicenseRef-AllRightsReserved.txt
 *
 * SPDX-FileType: SOURCE
 *
 * SPDX-FileCopyrightText: 2024 Johannes Krauser III <krauser@co.xyz>
 *
 * SPDX-FileContributor: Johannes Krauser III <krauser@co.xyz>
 */

import type { eventLog, handlerContext, Wallet } from "generated"
import type { Address } from "viem"

import { INITIAL_WALLET } from "../../generatedEntities"
import { getContractId } from "./getContractId"

export async function getOrCreateWallet({
  address,
  context,
  event,
  isContract,
}: {
  address: Address
  context: handlerContext
  event: eventLog<unknown>
  isContract?: boolean
}): Promise<{ data: Wallet; newItem: boolean }> {
  const { block, chainId } = event

  const currentWallet = await context.Wallet.get(address)

  if (currentWallet) return { data: currentWallet, newItem: false }

  const { contract_id } = getContractId({ chainId, contract: address })
  const data: Wallet = {
    ...INITIAL_WALLET,
    id: address,
    contract_id: isContract ? contract_id : undefined,
    encounteredTimestamp: block.timestamp,
    updatedTimestamp: block.timestamp,
  }

  return { data, newItem: true }
}
