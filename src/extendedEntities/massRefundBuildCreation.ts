import { BigInt, Bytes, log, ethereum } from "@graphprotocol/graph-ts"
import { saveTokenAndVaultIdAtIndex } from "./depositedEventUtils"

export function handleMassRefundBuildCreation(hash: Bytes, poolId: BigInt, receipt: ethereum.TransactionReceipt): void {
    const success = saveTokenAndVaultIdAtIndex(receipt, hash, poolId, 3)
    if (!success) {
        log.warning("Failed to save token and vault ID for poolId: {} in transaction: {}", [poolId.toHex(), hash.toHex()])
    }
}
