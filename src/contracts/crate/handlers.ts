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

import { Crate721M } from "generated"

import { contractCreatedHandler } from "./contractCreated"
import { alignmentUpdateHandler } from "./alignmentUpdate"
import { listMintedHandler } from "./listMinted"
import { mintListDeletedHandler } from "./mintListDeleted"
import { mintListUpdateHandler } from "./mintListUpdate"
import { ownershipTransferredHandler } from "./ownershipTransferred"
import { pausedHandler } from "./paused"
import { priceUpdateHandler } from "./priceUpdate"
import { referralHandler } from "./referral"
import { referralFeesUpdateHandler } from "./referralFeeUpdate"
import { royaltiesUpdateHandler } from "./royaltiesUpdate"
import { supplyUpdateHandler } from "./supplyUpdate"
import { transferHandler } from "./transfer"
import { unpausedHandler } from "./unpaused"

Crate721M.ContractCreated.handler(({ context, event }) => contractCreatedHandler({ context, event }))

Crate721M.SupplyUpdate.handler(({ context, event }) => supplyUpdateHandler({ context, event }))

Crate721M.PriceUpdate.handler(({ context, event }) => priceUpdateHandler({ context, event }))

Crate721M.RoyaltiesUpdate.handler(({ context, event }) => royaltiesUpdateHandler({ context, event }))

Crate721M.OwnershipTransferred.handler(({ context, event }) =>
  ownershipTransferredHandler({ context, event }),
)

Crate721M.Transfer.handler(({ context, event }) => transferHandler({ context, event }))

Crate721M.Paused.handler(({ context, event }) => pausedHandler({ context, event }))

Crate721M.Unpaused.handler(({ context, event }) => unpausedHandler({ context, event }))

Crate721M.MintListUpdate.handler(({ context, event }) => mintListUpdateHandler({ context, event }))

Crate721M.MintListDeleted.handler(({ context, event }) => mintListDeletedHandler({ context, event }))

Crate721M.ListMinted.handler(({ context, event }) => listMintedHandler({ context, event }))

Crate721M.ReferralFeeUpdate.handler(({ context, event }) =>
  referralFeesUpdateHandler({ context, event }),
)

Crate721M.AlignmentUpdate.handler(({ context, event }) => alignmentUpdateHandler({ context, event }))

Crate721M.Referral.handler(({ context, event }) => referralHandler({ context, event }))
