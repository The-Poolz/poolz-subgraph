import { BigInt, Bytes, log, ethereum } from "@graphprotocol/graph-ts"
import { Deposited, PoolData } from "../../generated/schema"

export function handleMassBuildCreation(hash: Bytes, poolId: BigInt, receipt: ethereum.TransactionReceipt): void {
    const depositedEvent = findDepositedEvent(hash, receipt)
    if (!depositedEvent) {
        log.warning("No Deposited event found in transaction: {}", [hash.toHex()])
        return
    }
    const poolData = PoolData.load(poolId.toHex())
    if (!poolData) {
        log.warning("PoolData not found for poolId: {}", [poolId.toHex()])
        return
    }
    // save token address and vaultId
    poolData.tokenAddress = depositedEvent.tokenAddress
    poolData.vaultId = depositedEvent.vaultId
    poolData.save()
}

function findDepositedEvent(hash: Bytes, receipt: ethereum.TransactionReceipt): Deposited | null {
    const indexes = [2, 3, 4]

    for (let i = 0; i < indexes.length; i++) {
        const index = indexes[i]
        const log = receipt.logs[index]

        // Match the Deposited event signature hash
        if (
            log.topics.length > 0 &&
            log.topics[0].toHex() == "0x1599c0fcf897af5babc2bfcf707f5dc050f841b044d97c3251ecec35b9abf80b"
        ) {
            // load the Deposited event
            return Deposited.loadInBlock(hash.concatI32(log.logIndex.toI32()))
        }
    }

    return null
}
