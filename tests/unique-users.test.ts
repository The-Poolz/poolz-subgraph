import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { UniqueUsers } from "../generated/schema"
import { trackUniqueUser } from "../src/extendedEntities/uniqueUsersUtils"

// Mock data for testing
const USER_ADDRESS = Address.fromString("0x1234567890123456789012345678901234567890")
const POOL_ID = BigInt.fromI32(1)
const TIMESTAMP = BigInt.fromI32(1672531200) // 2023-01-01 00:00:00 UTC
const TRANSACTION_HASH = Bytes.fromHexString("0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890")
const BLOCK_NUMBER = BigInt.fromI32(12345)
const LOG_INDEX = BigInt.fromI32(0)

describe("UniqueUsers entity", () => {
  beforeEach(() => {
    clearStore()
  })

  test("Should create a new unique user on first interaction", () => {
    // Track a user for the first time
    trackUniqueUser(
      USER_ADDRESS,
      POOL_ID,
      TIMESTAMP,
      TRANSACTION_HASH,
      BLOCK_NUMBER
    )

    // Verify the user was created
    const userId = USER_ADDRESS.toHexString().toLowerCase()
    const uniqueUser = UniqueUsers.load(userId)
    
    assert.assertNotNull(uniqueUser)
    assert.bytesEquals(uniqueUser!.user, USER_ADDRESS)
    assert.bigIntEquals(uniqueUser!.firstPoolId, POOL_ID)
    assert.bigIntEquals(uniqueUser!.firstInteractionTimestamp, TIMESTAMP)
    assert.bytesEquals(uniqueUser!.firstTransactionHash, TRANSACTION_HASH)
    assert.bigIntEquals(uniqueUser!.blockNumber, BLOCK_NUMBER)
  })

  test("Should not create duplicate users on subsequent interactions", () => {
    // Track a user for the first time
    trackUniqueUser(
      USER_ADDRESS,
      POOL_ID,
      TIMESTAMP,
      TRANSACTION_HASH,
      BLOCK_NUMBER
    )

    // Get the initial user data
    const userId = USER_ADDRESS.toHexString().toLowerCase()
    const initialUser = UniqueUsers.load(userId)
    assert.assertNotNull(initialUser)

    // Track the same user again with different data
    const NEW_POOL_ID = BigInt.fromI32(2)
    const NEW_TIMESTAMP = BigInt.fromI32(1672617600) // 2023-01-02 00:00:00 UTC
    const NEW_TRANSACTION_HASH = Bytes.fromHexString("0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321")
    const NEW_BLOCK_NUMBER = BigInt.fromI32(12346)

    trackUniqueUser(
      USER_ADDRESS,
      NEW_POOL_ID,
      NEW_TIMESTAMP,
      NEW_TRANSACTION_HASH,
      NEW_BLOCK_NUMBER,
    )

    // Verify the user data hasn't changed (first interaction should be preserved)
    const uniqueUser = UniqueUsers.load(userId)
    assert.assertNotNull(uniqueUser)
    assert.bytesEquals(uniqueUser!.user, USER_ADDRESS)
    assert.bigIntEquals(uniqueUser!.firstPoolId, POOL_ID) // Should still be the original pool
    assert.bigIntEquals(uniqueUser!.firstInteractionTimestamp, TIMESTAMP) // Should still be the original timestamp
    assert.bytesEquals(uniqueUser!.firstTransactionHash, TRANSACTION_HASH) // Should still be the original transaction
    assert.bigIntEquals(uniqueUser!.blockNumber, BLOCK_NUMBER) // Should still be the original block
  })

  test("Should create different users for different addresses", () => {
    const USER_ADDRESS_2 = Address.fromString("0x9876543210987654321098765432109876543210")
    
    // Track first user
    trackUniqueUser(
      USER_ADDRESS,
      POOL_ID,
      TIMESTAMP,
      TRANSACTION_HASH,
      BLOCK_NUMBER
    )

    // Track second user
    trackUniqueUser(
      USER_ADDRESS_2,
      BigInt.fromI32(2),
      BigInt.fromI32(1672617600),
      Bytes.fromHexString("0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321"),
      BigInt.fromI32(12346),
    )

    // Verify both users exist
    const userId1 = USER_ADDRESS.toHexString().toLowerCase()
    const userId2 = USER_ADDRESS_2.toHexString().toLowerCase()
    
    const user1 = UniqueUsers.load(userId1)
    const user2 = UniqueUsers.load(userId2)
    
    assert.assertNotNull(user1)
    assert.assertNotNull(user2)
    assert.bytesEquals(user1!.user, USER_ADDRESS)
    assert.bytesEquals(user2!.user, USER_ADDRESS_2)
    assert.bigIntEquals(user1!.firstPoolId, POOL_ID)
    assert.bigIntEquals(user2!.firstPoolId, BigInt.fromI32(2))
  })

  test("Should handle edge case of zero address correctly", () => {
    const ZERO_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000")
    
    trackUniqueUser(
      ZERO_ADDRESS,
      POOL_ID,
      TIMESTAMP,
      TRANSACTION_HASH,
      BLOCK_NUMBER
    )

    const userId = ZERO_ADDRESS.toHexString().toLowerCase()
    const uniqueUser = UniqueUsers.load(userId)
    
    assert.assertNotNull(uniqueUser)
    assert.bytesEquals(uniqueUser!.user, ZERO_ADDRESS)
    assert.bigIntEquals(uniqueUser!.firstPoolId, POOL_ID)
  })

  test("Should use lowercase hex string as ID", () => {
    const MIXED_CASE_ADDRESS = Address.fromString("0xAbCdEf1234567890AbCdEf1234567890AbCdEf12")
    
    trackUniqueUser(
      MIXED_CASE_ADDRESS,
      POOL_ID,
      TIMESTAMP,
      TRANSACTION_HASH,
      BLOCK_NUMBER
    )

    // Should use lowercase for ID
    const expectedId = MIXED_CASE_ADDRESS.toHexString().toLowerCase()
    const uniqueUser = UniqueUsers.load(expectedId)
    
    assert.assertNotNull(uniqueUser)
    assert.bytesEquals(uniqueUser!.user, MIXED_CASE_ADDRESS)
    
    // Verify that mixed case ID doesn't work
    const mixedCaseId = "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12"
    const mixedCaseUser = UniqueUsers.load(mixedCaseId)
    assert.assertNull(mixedCaseUser)
  })
})
