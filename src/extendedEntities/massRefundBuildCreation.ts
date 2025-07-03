import { BigInt, Bytes, log, ethereum } from "@graphprotocol/graph-ts"
import { PoolData } from "../../generated/schema"
import { findDepositedEventAtIndex } from "./depositedEventUtils"

export function handleMassRefundBuildCreation(hash: Bytes, poolId: BigInt, receipt: ethereum.TransactionReceipt): void {
    const depositedEvent = findDepositedEventAtIndex(hash, receipt, 3)
    if (!depositedEvent) {
        log.warning("No Deposited event found at index 3 in transaction: {}", [hash.toHex()])
        return
    }

    const poolData = PoolData.load(poolId.toHex())
    if (!poolData) {
        log.warning("PoolData not found for poolId: {}", [poolId.toHex()])
        return
    }

    poolData.tokenAddress = depositedEvent.tokenAddress
    poolData.vaultId = depositedEvent.vaultId
    poolData.save()
}
