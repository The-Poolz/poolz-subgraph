import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { saveTokenAndVaultIdAtIndex } from "./depositedEventUtils"

export function saveTokenAndVaultId(receipt: ethereum.TransactionReceipt, hash: Bytes, poolId: BigInt): void {
    saveTokenAndVaultIdAtIndex(receipt, hash, poolId, 8)
}
