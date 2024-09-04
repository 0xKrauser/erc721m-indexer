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

import type { Crate_PriceUpdate_eventArgs, eventLog, handlerContext, List } from "generated"
import type { Address } from "viem"

import { getOrCreateList } from "../../actions/getOrCreateList"

export async function priceUpdateHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_PriceUpdate_eventArgs>
}): Promise<void> {
  const { block, params, srcAddress } = event
  const { price_ } = params

  const { data: list } = await getOrCreateList({
    context,
    contract: srcAddress as Address,
    id: 0n,
    event,
  })

  const updatedList: List = {
    ...list,
    price: price_,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.List.set(updatedList)
}
