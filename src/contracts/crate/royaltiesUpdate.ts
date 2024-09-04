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
  Crate_RoyaltiesUpdate_eventArgs,
  ERC2981Info,
  eventLog,
  handlerContext,
} from "generated"
import { type Address } from "viem"

import { INITIAL_ERC2981INFO } from "../../../generatedEntities"
import { getContractId } from "../../actions/getContractId"
import { getTokenId } from "../../actions/getTokenId"

export async function royaltiesUpdateHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_RoyaltiesUpdate_eventArgs>
}): Promise<void> {
  const { block, chainId, params, srcAddress } = event
  const { bps_, receiver_, tokenId_ } = params

  const { contract_id } = getContractId({ chainId, contract: srcAddress })
  const { token_id } = getTokenId({ contract_id, tokenId: tokenId_ })

  const dbErc2981Info = await context.ERC2981Info.get(srcAddress as Address)

  const erc2981Info: ERC2981Info = dbErc2981Info ?? {
    ...INITIAL_ERC2981INFO,
    id: token_id,
    createdBlockNumber: block.number,
    createdTimestamp: block.timestamp,
  }

  const updatedErc2981Info: ERC2981Info = {
    ...erc2981Info,
    royaltyPc: bps_,
    royaltyReceiver_id: receiver_,
    updatedBlockNumber: block.number,
    updatedTimestamp: block.timestamp,
  }

  context.ERC2981Info.set(updatedErc2981Info)
}
