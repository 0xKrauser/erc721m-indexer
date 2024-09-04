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

import { Crate } from "generated"

import { alignmentUpdateHandler } from "./alignmentUpdate"
import { contractCreatedHandler } from "./contractCreated"
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

Crate.ContractCreated.handler(({ context, event }) => contractCreatedHandler({ context, event }))

Crate.SupplyUpdate.handler(({ context, event }) => supplyUpdateHandler({ context, event }))

Crate.PriceUpdate.handler(({ context, event }) => priceUpdateHandler({ context, event }))

Crate.RoyaltiesUpdate.handler(({ context, event }) => royaltiesUpdateHandler({ context, event }))

Crate.OwnershipTransferred.handler(({ context, event }) =>
  ownershipTransferredHandler({ context, event }),
)

Crate.Transfer.handler(({ context, event }) => transferHandler({ context, event }))

Crate.Paused.handler(({ context, event }) => pausedHandler({ context, event }))

Crate.Unpaused.handler(({ context, event }) => unpausedHandler({ context, event }))

Crate.MintListUpdate.handler(({ context, event }) => mintListUpdateHandler({ context, event }))

Crate.MintListDeleted.handler(({ context, event }) => mintListDeletedHandler({ context, event }))

Crate.ListMinted.handler(({ context, event }) => listMintedHandler({ context, event }))

Crate.ReferralFeeUpdate.handler(({ context, event }) =>
  referralFeesUpdateHandler({ context, event }),
)

Crate.AlignmentUpdate.handler(({ context, event }) => alignmentUpdateHandler({ context, event }))

Crate.Referral.handler(({ context, event }) => referralHandler({ context, event }))
