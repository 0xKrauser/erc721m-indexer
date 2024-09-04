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
  Contract,
  Crate_OwnershipTransferred_eventArgs,
  eventLog,
  handlerContext,
} from "generated"
import type { Address } from "viem"

import { getOrCreateContract } from "../../actions/getOrCreateContract"
import { getOrCreateWallet } from "../../actions/getOrCreateWallet"

export async function ownershipTransferredHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_OwnershipTransferred_eventArgs>
}): Promise<void> {
  const { block, params, srcAddress } = event
  const { newOwner, oldOwner } = params

  const { data: contract } = await getOrCreateContract({
    context,
    event,
    contract: srcAddress as Address,
  })

  const updatedContract: Contract = {
    ...contract,
    owner_id: newOwner,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  const { data: newOwnerWallet, newItem: newOwnerWalletIsNew } = await getOrCreateWallet({
    address: newOwner as Address,
    context,
    event,
  })

  if (newOwnerWalletIsNew) context.Wallet.set(newOwnerWallet)

  const { data: oldOwnerWallet, newItem: oldOwnerWalletIsNew } = await getOrCreateWallet({
    address: oldOwner as Address,
    context,
    event,
  })

  if (oldOwnerWalletIsNew) context.Wallet.set(oldOwnerWallet)

  context.Contract.set(updatedContract)
}
