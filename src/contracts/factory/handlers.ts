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

import { Factory } from "generated"

import { collectionCreatedHandler } from "./crate721mDeployed"


Factory.Crate721MDeployed.contractRegister(({ context, event }) => {
  const { collection_ } = params

  context.addCrate(collection_)
})

