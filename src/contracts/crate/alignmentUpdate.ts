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

import type { Collection, Crate_FeeUpdate_eventArgs, eventLog, handlerContext } from "generated"
import type { Address } from "viem"

import { getOrCreateCollection } from "../../actions/getOrCreateCollection"

export async function alignmentUpdateHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_FeeUpdate_eventArgs>
}): Promise<void> {
  const { block, params, srcAddress } = event
  const { feeRecipients_, fees_ } = params

  const { data: collection } = await getOrCreateCollection({
    event,
    context,
    contract: srcAddress as Address,
  })

  const updatedCollection: Collection = {
    ...collection,
    feeRecipients: feeRecipients_,
    fees: fees_,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.Collection.set(updatedCollection)
}
