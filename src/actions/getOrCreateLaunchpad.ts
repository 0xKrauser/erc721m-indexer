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

import type { eventLog, handlerContext, Launchpad } from "generated"
import type { Address } from "viem"

import { INITIAL_LAUNCHPAD } from "../../generatedEntities"
import { getContractId } from "./getContractId"

export async function getOrCreateLaunchpad({
  context,
  contract,
  event,
}: {
  context: handlerContext
  contract: Address
  event: eventLog<unknown>
}): Promise<{ data: Launchpad; newItem: boolean }> {
  const { block, chainId } = event

  const { contract_id } = getContractId({ chainId, contract })

  const currentLaunchpad = await context.Launchpad.get(contract_id)

  if (currentLaunchpad) return { data: currentLaunchpad, newItem: false }

  const newLaunchpad: Launchpad = {
    ...INITIAL_LAUNCHPAD,
    id: contract_id,
    contract_id,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  return { data: newLaunchpad, newItem: true }
}
