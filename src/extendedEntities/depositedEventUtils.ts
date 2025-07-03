import { Bytes, log, ethereum } from "@graphprotocol/graph-ts"
import { Deposited } from "../../generated/schema"

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