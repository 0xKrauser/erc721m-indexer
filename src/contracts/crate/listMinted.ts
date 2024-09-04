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

import type {
  Collection,
  Crate_ListMinted_eventArgs,
  eventLog,
  handlerContext,
  List,
} from "generated"
import type { Address } from "viem"

import { getOrCreateCollection } from "../../actions/getOrCreateCollection"
import { getOrCreateList } from "../../actions/getOrCreateList"
import { getOrCreateListClaimed } from "../../actions/getOrCreateListClaimed"

export async function listMintedHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_ListMinted_eventArgs>
}): Promise<void> {
  const { block, params, srcAddress } = event
  const { amount_, listId_, minter_ } = params

  const { data: list } = await getOrCreateList({
    context,
    event,
    contract: srcAddress as Address,
    id: listId_,
  })

  const updatedList: List = {
    ...list,
    totalSupply: list.totalSupply + amount_,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.List.set(updatedList)

  if (list.reserved) {
    const { data: collection } = await getOrCreateCollection({
      context,
      event,
      contract: srcAddress as Address,
    })
    const updatedCollection: Collection = {
      ...collection,
      reservedSupply: collection.reservedSupply - amount_,
      updatedBlockNumber: block.number,
      updatedTimestamp: block.timestamp,
    }

    context.Collection.set(updatedCollection)
  }

  const { data: claimed } = await getOrCreateListClaimed({
    context,
    event,
    contract: srcAddress as Address,
    id: listId_,
    wallet: minter_ as Address,
  })

  const updatedClaimed = {
    ...claimed,
    amount: claimed.amount + amount_,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.ListClaimed.set(updatedClaimed)
}
