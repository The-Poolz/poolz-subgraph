import { Bytes } from "@graphprotocol/graph-ts"
import { UniqueUsers } from "../../generated/schema"

/**
 * Tracks unique users by their wallet address.
 * Prevents duplication by checking if user already exists.
 * @param userAddress - User's wallet address
 */
export function trackUniqueUser(userAddress: Bytes): void {
    const userId = userAddress.toHexString()
    let uniqueUser = UniqueUsers.load(userId)
    
    if (!uniqueUser) {
        uniqueUser = new UniqueUsers(userId)
        uniqueUser.save()
    }
}
