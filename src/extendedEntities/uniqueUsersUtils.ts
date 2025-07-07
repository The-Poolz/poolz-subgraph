import { BigInt, Bytes, log, store } from "@graphprotocol/graph-ts"
import { UniqueUsers } from "../../generated/schema"

/**
 * Tracks unique users and their first interaction with pools
 * Uses defensive programming to handle race conditions and ensure absolute uniqueness
 * @param userAddress - User's wallet address
 * @param poolId - Pool ID they're interacting with
 * @param timestamp - Block timestamp of the interaction
 * @param transactionHash - Transaction hash of the interaction
 * @param blockNumber - Block number of the interaction
 */
export function trackUniqueUser(
    userAddress: Bytes,
    poolId: BigInt,
    timestamp: BigInt,
    transactionHash: Bytes,
    blockNumber: BigInt
): void {
    // Use user address as the unique ID (ensuring one record per user)
    const userId = userAddress.toHexString().toLowerCase()

    log.info("Attempting to track unique user: {} for pool: {}", [userId, poolId.toString()])

    // Check if user already exists using both methods for maximum safety
    let existingUser = UniqueUsers.load(userId)
    if (existingUser != null) {
        log.info("User already tracked (entity exists): {}", [userId])
        return
    }

    // Double-check with store.get() for absolute certainty
    let storeCheck = store.get("UniqueUsers", userId)
    if (storeCheck != null) {
        log.info("User already tracked (store check): {}", [userId])
        return
    }

    // At this point, we're confident the user doesn't exist
    // Create new user entity
    log.info("Creating new unique user: {} at block: {}", [userId, blockNumber.toString()])

    let uniqueUser = new UniqueUsers(userId)
    uniqueUser.user = userAddress
    uniqueUser.firstPoolId = poolId
    uniqueUser.firstInteractionTimestamp = timestamp
    uniqueUser.firstTransactionHash = transactionHash
    uniqueUser.blockNumber = blockNumber

    // Save the entity - database constraint will prevent duplicates
    uniqueUser.save()

    log.info("Successfully saved unique user: {} at block: {}", [userId, blockNumber.toString()])
}
