import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { UniqueUsers } from "../generated/schema"
import { trackUniqueUser } from "../src/extendedEntities/uniqueUsersUtils"

/**
 * Helper function to create a test UniqueUsers entity
 * @param userAddress - User's wallet address
 * @param poolId - Pool ID they're interacting with
 * @param timestamp - Block timestamp of the interaction
 * @param transactionHash - Transaction hash of the interaction
 * @param blockNumber - Block number of the interaction
 * @param logIndex - Log index of the interaction
 * @returns UniqueUsers entity
 */
export function createTestUniqueUser(
  userAddress: Address,
  poolId: BigInt,
  timestamp: BigInt,
  transactionHash: Bytes,
  blockNumber: BigInt,
): UniqueUsers {
  const userId = userAddress.toHexString().toLowerCase()
  const uniqueUser = new UniqueUsers(userId)
  
  uniqueUser.user = userAddress
  uniqueUser.firstPoolId = poolId
  uniqueUser.firstInteractionTimestamp = timestamp
  uniqueUser.firstTransactionHash = transactionHash
  uniqueUser.blockNumber = blockNumber
  
  return uniqueUser
}

/**
 * Helper function to track a unique user using the actual utility function
 * @param userAddress - User's wallet address
 * @param poolId - Pool ID they're interacting with
 * @param timestamp - Block timestamp of the interaction
 * @param transactionHash - Transaction hash of the interaction
 * @param blockNumber - Block number of the interaction
 */
export function trackTestUniqueUser(
  userAddress: Address,
  poolId: BigInt,
  timestamp: BigInt,
  transactionHash: Bytes,
  blockNumber: BigInt,
): void {
  trackUniqueUser(
    userAddress,
    poolId,
    timestamp,
    transactionHash,
    blockNumber
  )
}

/**
 * Helper function to verify that a unique user exists with expected values
 * @param userAddress - User's wallet address
 * @param expectedPoolId - Expected pool ID
 * @param expectedTimestamp - Expected timestamp
 * @param expectedTransactionHash - Expected transaction hash
 * @param expectedBlockNumber - Expected block number
 * @returns UniqueUsers entity or null if not found
 */
export function verifyUniqueUser(
  userAddress: Address,
  expectedPoolId: BigInt,
  expectedTimestamp: BigInt,
  expectedTransactionHash: Bytes,
  expectedBlockNumber: BigInt
): UniqueUsers | null {
  const userId = userAddress.toHexString().toLowerCase()
  const uniqueUser = UniqueUsers.load(userId)
  
  if (uniqueUser === null) {
    return null
  }
  
  // Verify all expected values match
  if (
    uniqueUser.user.equals(userAddress) &&
    uniqueUser.firstPoolId.equals(expectedPoolId) &&
    uniqueUser.firstInteractionTimestamp.equals(expectedTimestamp) &&
    uniqueUser.firstTransactionHash.equals(expectedTransactionHash) &&
    uniqueUser.blockNumber.equals(expectedBlockNumber)
  ) {
    return uniqueUser
  }
  
  return null
}

/**
 * Helper function to get mock data for testing
 */
export class MockData {
  static readonly USER_ADDRESS = Address.fromString("0x1234567890123456789012345678901234567890")
  static readonly USER_ADDRESS_2 = Address.fromString("0x9876543210987654321098765432109876543210")
  static readonly ZERO_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000")
  static readonly POOL_ID = BigInt.fromI32(1)
  static readonly POOL_ID_2 = BigInt.fromI32(2)
  static readonly TIMESTAMP = BigInt.fromI32(1672531200) // 2023-01-01 00:00:00 UTC
  static readonly TIMESTAMP_2 = BigInt.fromI32(1672617600) // 2023-01-02 00:00:00 UTC
  static readonly TRANSACTION_HASH = Bytes.fromHexString("0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890")
  static readonly TRANSACTION_HASH_2 = Bytes.fromHexString("0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321")
  static readonly BLOCK_NUMBER = BigInt.fromI32(12345)
  static readonly BLOCK_NUMBER_2 = BigInt.fromI32(12346)
}
