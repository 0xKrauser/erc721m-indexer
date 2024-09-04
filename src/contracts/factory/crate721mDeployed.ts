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
  eventLog,
  handlerContext,
  Launchpad,
  Launchpad_0_0_2_CollectionCreated_eventArgs,
  Wallet,
} from "generated"
import type { Address } from "viem"

import { getContractId } from "../../actions/getContractId"
import { getOrCreateCollection } from "../../actions/getOrCreateCollection"
import { getOrCreateContract } from "../../actions/getOrCreateContract"
import { getOrCreateWallet } from "../../actions/getOrCreateWallet"

export async function collectionCreatedHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Launchpad_0_0_2_CollectionCreated_eventArgs>
}): Promise<void> {
  const { block, chainId, params, srcAddress, transaction } = event
  const { collection_: richCollection, creator_, policyId_ } = params

  const { data: wallet } = await getOrCreateWallet({ event, context, address: creator_ as Address })

  const updatedWallet: Wallet = {
    ...wallet,
    collectionsCreatedCount: wallet.collectionsCreatedCount + 1,
    updatedTimestamp: block.timestamp,
  }

  context.Wallet.set(updatedWallet)

  const { contract_id: launchpad_id } = getContractId({ chainId, contract: srcAddress })

  const launchpad = await context.Launchpad.get(launchpad_id)
  if (!launchpad) {
    context.log.error("Launchpad not registered")
    return
  }

  const updatedLaunchpad: Launchpad = {
    ...launchpad,
    collectionsCreatedCount: launchpad.collectionsCreatedCount + 1,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.Launchpad.set(updatedLaunchpad)

  {
    const { data: contract, newItem: isContractNew } = await getOrCreateContract({
      context,
      contract: richCollection as Address,
      creator: creator_ as Address,
      event,
    })
    if (isContractNew) context.Contract.set(contract)
  }

  const { data: collection } = await getOrCreateCollection({
    context,
    event,
    contract: richCollection as Address,
  })

  const nftPolicy_id = `${launchpad_id}_${policyId_}`
  const updatedCollection: Collection = {
    ...collection,
    launchpad_id,
    nftPolicy_id,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.Collection.set(updatedCollection)
}
