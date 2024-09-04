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

import type { Crate_Referral_eventArgs, eventLog, handlerContext, ReferralLog } from "generated"
import type { Address } from "viem"

import { INITIAL_REFERRAL_LOG } from "../../../generatedEntities"
import { getContractId } from "../../actions/getContractId"
import { getOrCreateCollectionActivity } from "../../actions/getOrCreateCollectionActivity"
import { getOrCreateWallet } from "../../actions/getOrCreateWallet"

export async function referralHandler({
  context,
  event,
}: {
  context: handlerContext
  event: eventLog<Crate_Referral_eventArgs>
}): Promise<void> {
  const { block, chainId, logIndex, params, srcAddress, transaction } = event
  const { hash: transactionHash } = transaction
  const { referral_, referred_, value_ } = params

  const { data: referred, newItem: newReferred } = await getOrCreateWallet({
    context,
    event,
    address: referred_ as Address,
  })

  if (newReferred) context.Wallet.set(referred)

  const { data: referral, newItem: newReferral } = await getOrCreateWallet({
    context,
    event,
    address: referral_ as Address,
  })

  if (newReferral) context.Wallet.set(referral)

  const referralLog_id = `${chainId}_${transactionHash}_${logIndex}`

  const { contract_id } = getContractId({ chainId, contract: srcAddress as Address })

  const referral_id = `${contract_id}_${referral_}`

  const referred_id = `${contract_id}_${referred_}`

  const referralEntity: ReferralLog = {
    ...INITIAL_REFERRAL_LOG,
    id: referralLog_id,
    transactionHash,
    logIndex,
    referral_id,
    referred_id,
    amount: value_,
    createdBlockNumber: block.number,
    createdTimestamp: block.timestamp,
  }

  context.ReferralLog.set(referralEntity)

  {
    const { data: referralActivity } = await getOrCreateCollectionActivity({
      context,
      contract: srcAddress as Address,
      event,
      wallet: referral_,
    })

    const updatedReferralActivity = {
      ...referralActivity,
      referralFeesEarned: referralActivity.referralFeesEarned + value_,
      referralCount: referralActivity.referralCount + 1n,
      updatedBlockNumber: block.number,
      updatedTimestamp: block.timestamp,
    }

    context.CollectionActivity.set(updatedReferralActivity)
  }

  {
    const { data: referredActivity } = await getOrCreateCollectionActivity({
      context,
      contract: srcAddress as Address,
      event,
      wallet: referral_,
    })

    const updatedReferredActivity = {
      ...referredActivity,
      referredCount: referredActivity.referredCount + 1n,
      updatedBlockNumber: block.number,
      updatedTimestamp: block.timestamp,
    }

    context.CollectionActivity.set(updatedReferredActivity)
  }
}
