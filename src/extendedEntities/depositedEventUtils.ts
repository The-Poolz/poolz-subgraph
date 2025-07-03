import { BigInt, Bytes, log, ethereum } from "@graphprotocol/graph-ts"
import { Deposited, PoolData } from "../../generated/schema"

/**
 * Finds a Deposited event at a specific index in the transaction receipt logs
 * @param hash - Transaction hash
 * @param receipt - Transaction receipt containing logs
 * @param index - Index of the log to check
 * @returns Deposited event if found, null otherwise
 */
export function findDepositedEventAtIndex(
    hash: Bytes,
    receipt: ethereum.TransactionReceipt,
    index: i32
): Deposited | null {
    if (index >= receipt.logs.length) {
        log.critical("Invalid log index: {} for transaction {}", [index.toString(), hash.toHex()])
        return null
    }

    const eventLog = receipt.logs[index]
    if (
        eventLog.topics.length > 0 &&
        eventLog.topics[0].toHex() == "0x1599c0fcf897af5babc2bfcf707f5dc050f841b044d97c3251ecec35b9abf80b"
    ) {
        return Deposited.loadInBlock(hash.concatI32(eventLog.logIndex.toI32()))
    }

    return null
}

/**
 * Saves token address and vault ID to pool data using deposited event at specified index
 * @param receipt - Transaction receipt containing logs
 * @param hash - Transaction hash
 * @param poolId - Pool ID to update
 * @param index - Index of the deposited event in the logs
 * @returns boolean indicating success
 */
export function saveTokenAndVaultIdAtIndex(
    receipt: ethereum.TransactionReceipt,
    hash: Bytes,
    poolId: BigInt,
    index: i32
): boolean {
    const poolData = PoolData.load(poolId.toHexString())
    if (!poolData) {
        log.warning("PoolData not found for poolId: {}", [poolId.toHexString()])
        return false
    }

    const depositedEvent = findDepositedEventAtIndex(hash, receipt, index)
    if (!depositedEvent) {
        log.warning("No Deposited event found at index {} in transaction: {}", [index.toString(), hash.toHex()])
        return false
    }

    poolData.tokenAddress = depositedEvent.tokenAddress
    poolData.vaultId = depositedEvent.vaultId
    poolData.save()

    return true
}
