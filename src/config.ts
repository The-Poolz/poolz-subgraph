// .ts AssemblyScript file for the subgraph

import { Bytes } from "@graphprotocol/graph-ts"

// Define addresses as constants
export const LOCK_DEAL_PROVIDER_ADDRESS = Bytes.fromHexString("0x2942ee88A75B0c87fC9eEB8DDc9066De84937786")
export const TIMED_DEAL_PROVIDER_ADDRESS = Bytes.fromHexString("0x43b4CD03ED2504599Ed3Fb56780149A7E7960282")
export const OLD_LOCK_DEAL_PROVIDER_ADDRESS = Bytes.fromHexString("0xEB21d2745E52f39C57c129b44d62cFca37aA0A0a")
export const OLD_TIMED_DEAL_PROVIDER_ADDRESS = Bytes.fromHexString("0x48247A03D67fAee33c9b6d9c4348C4C677d0095E")
export const SIMPLE_BUILDER_ADDRESS = Bytes.fromHexString("0x4c6842E242B39F16328f2dEEd8cF23b407982aff").toHex().toLowerCase()
