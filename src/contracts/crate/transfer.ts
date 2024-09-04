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
  Crate_Transfer_eventArgs,
  eventLog,
  handlerContext,
  Token,
} from "generated"
import type { Address } from "viem"
import { zeroAddress } from "viem"

import { getOrCreateCollection } from "../../actions/getOrCreateCollection"
import { getOrCreateCollectionActivity } from "../../actions/getOrCreateCollectionActivity"
import { getOrCreateToken } from "../../actions/getOrCreateToken"
import { getOrCreateWallet } from "../../actions/getOrCreateWallet"

export async function transferHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_Transfer_eventArgs>
}): Promise<void> {
  const { block, params, srcAddress } = event
  const { from, id, to } = params

  const { data: collection } = await getOrCreateCollection({
    context,
    event,
    contract: srcAddress as Address,
  })

  const isMint = from === zeroAddress
  const updatedCollection: Collection = {
    ...collection,
    totalSupply: isMint ? collection.totalSupply + 1n : collection.totalSupply,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.Collection.set(updatedCollection)

  {
    const { data: fromWallet, newItem: newFromWallet } = await getOrCreateWallet({
      context,
      event,
      address: from as Address,
    })
    if (newFromWallet) context.Wallet.set(fromWallet)

    const { data: toWallet, newItem: newToWallet } = await getOrCreateWallet({
      context,
      event,
      address: to as Address,
    })
    if (newToWallet) context.Wallet.set(toWallet)
  }

  const { data: token } = await getOrCreateToken({
    context,
    event,
    contract: srcAddress as Address,
    tokenId: id,
    minter: isMint ? (to as Address) : undefined,
  })

  const updatedToken: Token = {
    ...token,
    owner_id: to,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.Token.set(updatedToken)

  if (isMint) {
    const { data: collectionActivity } = await getOrCreateCollectionActivity({
      context,
      contract: srcAddress as Address,
      event,
      wallet: to as Address,
    })

    const updatedCollectionActivity = {
      ...collectionActivity,
      minted: collectionActivity.mintCount + 1n,
      updatedBlockNumber: block.number,
      updatedTimestamp: block.timestamp,
    }

    context.CollectionActivity.set(updatedCollectionActivity)
  }
}
