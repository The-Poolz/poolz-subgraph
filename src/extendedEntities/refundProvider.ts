import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { PoolData } from "../../generated/schema"
import { findDepositedEventAtIndex } from "./depositedEventUtils"

export function saveTokenAndVaultId(receipt: ethereum.TransactionReceipt, hash: Bytes, poolId: BigInt): void {
    let poolData = PoolData.load(poolId.toHexString())
    const depositedIndex = 3 // Assuming the Deposited event is always at index 3 in the logs in this context.
    const depositedEvent = findDepositedEventAtIndex(hash, receipt, depositedIndex)
    if (poolData && depositedEvent) {
        poolData.tokenAddress = depositedEvent.tokenAddress
        poolData.vaultId = depositedEvent.vaultId
        poolData.save()
    }
}
