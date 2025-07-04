import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { UniqueUsers } from "../../generated/schema"

/**
 * Tracks unique users and their first interaction with pools
 * Prevents duplication by checking if user already exists
 * @param userAddress - User's wallet address
 * @param poolId - Pool ID they're interacting with
 * @param timestamp - Block timestamp of the interaction
 * @param transactionHash - Transaction hash of the interaction
 * @returns boolean indicating if this was a new user (true) or existing user (false)
 */
export function trackUniqueUser(
    userAddress: Bytes,
    poolId: BigInt,
    timestamp: BigInt,
    transactionHash: Bytes
): boolean {
    const userId = userAddress.toHexString().toLowerCase()

    // Always try to load first to check if user exists
    let uniqueUser = UniqueUsers.load(userId)

    if (uniqueUser !== null) {
        // User already exists, no need to do anything
        return false
    }

    // Create new user only if it doesn't exist
    uniqueUser = new UniqueUsers(userId)
    uniqueUser.user = userAddress
    uniqueUser.firstPoolId = poolId
    uniqueUser.firstInteractionTimestamp = timestamp
    uniqueUser.firstTransactionHash = transactionHash
    uniqueUser.save()
    return true // New user
}
