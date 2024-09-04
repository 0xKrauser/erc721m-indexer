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

import type { Contract, Crate_Paused_eventArgs, eventLog, handlerContext } from "generated"
import type { Address } from "viem"

import { getOrCreateContract } from "../../actions/getOrCreateContract"

export async function pausedHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_Paused_eventArgs>
}): Promise<void> {
  const { block, srcAddress } = event

  const { data: contract } = await getOrCreateContract({
    context,
    contract: srcAddress as Address,
    event,
  })

  const updatedContract: Contract = {
    ...contract,
    paused: true,
    updatedBlockNumber: contract.paused ? contract.updatedBlockNumber : block.number,
    updatedTimestamp: contract.paused ? contract.updatedTimestamp : block.timestamp,
  }

  context.Contract.set(updatedContract)
}
