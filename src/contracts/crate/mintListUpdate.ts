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
  Crate_MintListUpdate_eventArgs,
  eventLog,
  handlerContext,
  List,
} from "generated"
import type { Address } from "viem"

import { getOrCreateCollection } from "../../actions/getOrCreateCollection"
import { getOrCreateList } from "../../actions/getOrCreateList"
import { parseList } from "./utils"

export async function mintListUpdateHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_MintListUpdate_eventArgs>
}): Promise<void> {
  const { block, params, srcAddress } = event
  const { list_, listId_ } = params

  const parsedList = parseList(list_)

  const { data: list } = await getOrCreateList({
    context,
    event,
    contract: srcAddress as Address,
    id: listId_,
  })

  const updatedList: List = {
    ...list,
    ...parsedList,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.List.set(updatedList)

  if (!list.reserved && !parsedList.reserved) return
  const bothReserved = list.reserved && parsedList.reserved

  if (bothReserved && list.maxSupply === parsedList.maxSupply) return

  const { data: collection } = await getOrCreateCollection({
    context,
    event,
    contract: srcAddress as Address,
  })

  let { reservedSupply } = collection
  if (bothReserved) {
    reservedSupply += parsedList.maxSupply - list.maxSupply
  } else if (list.reserved) {
    reservedSupply -= list.maxSupply - list.totalSupply
  } else {
    reservedSupply += parsedList.maxSupply - list.totalSupply
  }

  const updatedCollection: Collection = {
    ...collection,
    reservedSupply,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.Collection.set(updatedCollection)
}
