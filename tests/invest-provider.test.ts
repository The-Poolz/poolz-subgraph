import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  handleEIP712DomainChanged,
  handleInvested,
  handleNewPoolCreated,
} from "../src/invest-provider"
import {
  createEIP712DomainChangedEvent,
  createInvestedEvent,
  createNewPoolCreatedEvent,
} from "./invest-provider-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newEIP712DomainChangedEvent = createEIP712DomainChangedEvent()
    handleEIP712DomainChanged(newEIP712DomainChangedEvent)

    let poolId = BigInt.fromI32(1)
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let poolAmount = BigInt.fromI32(1000)
    let newPoolCreatedEvent = createNewPoolCreatedEvent(poolId, owner, poolAmount)
    handleNewPoolCreated(newPoolCreatedEvent)

    let user = Address.fromString("0x0000000000000000000000000000000000000002")
    let amount = BigInt.fromI32(100)
    let newNonce = BigInt.fromI32(1)
    let investedEvent = createInvestedEvent(poolId, user, amount, newNonce)
    handleInvested(investedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("EIP712DomainChanged created and stored", () => {
    assert.entityCount("EIP712DomainChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })

  test("Invest events create entities", () => {
    assert.entityCount("InvestNewPoolCreated", 1)
    assert.entityCount("Invested", 1)
    assert.entityCount("TotalInvested", 1)
    assert.entityCount("UserIDOInvestment", 1)

    assert.fieldEquals(
      "InvestNewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "poolId",
      "1"
    )
    assert.fieldEquals(
      "InvestNewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InvestNewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "poolAmount",
      "1000"
    )

    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "poolId",
      "1"
    )
    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "user",
      "0x0000000000000000000000000000000000000002"
    )
    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "amount",
      "100"
    )
    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "newNonce",
      "1"
    )

    let poolIdHex = BigInt.fromI32(1).toHexString()
    let userHex = Address.fromString(
      "0x0000000000000000000000000000000000000002",
    ).toHexString()
    assert.fieldEquals(
      "TotalInvested",
      poolIdHex,
      "poolId",
      "1",
    )
    assert.fieldEquals("TotalInvested", poolIdHex, "poolAmount", "1000")
    assert.fieldEquals("TotalInvested", poolIdHex, "totalInvested", "100")
    assert.fieldEquals("TotalInvested", poolIdHex, "leftAmount", "900")

    let userId = poolIdHex + "-" + userHex
    assert.fieldEquals("UserIDOInvestment", userId, "poolId", "1")
    assert.fieldEquals(
      "UserIDOInvestment",
      userId,
      "user",
      "0x0000000000000000000000000000000000000002",
    )
    assert.fieldEquals("UserIDOInvestment", userId, "amount", "100")

    // Test UserTotalSpent entity
    assert.entityCount("UserTotalSpent", 1)
    assert.fieldEquals(
      "UserTotalSpent",
      userHex,
      "user",
      "0x0000000000000000000000000000000000000002"
    )
    assert.fieldEquals("UserTotalSpent", userHex, "totalSpent", "100")
  })
})

describe("UserIDOInvestment timestamp updates", () => {
  beforeAll(() => {
    // create pool first
    let poolId = BigInt.fromI32(1)
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let poolAmount = BigInt.fromI32(1000)
    let poolEvent = createNewPoolCreatedEvent(poolId, owner, poolAmount)
    handleNewPoolCreated(poolEvent)

    let user = Address.fromString("0x0000000000000000000000000000000000000002")

    let invest1 = createInvestedEvent(
      poolId,
      user,
      BigInt.fromI32(100),
      BigInt.fromI32(1),
    )
    invest1.block.timestamp = BigInt.fromI32(1000)
    handleInvested(invest1)

    let invest2 = createInvestedEvent(
      poolId,
      user,
      BigInt.fromI32(50),
      BigInt.fromI32(2),
    )
    invest2.block.timestamp = BigInt.fromI32(2000)
    handleInvested(invest2)
  })

  afterAll(() => {
    clearStore()
  })

  test("Timestamp overwritten on each invest", () => {
    // poolId.toHex() + "-" + user.toHex()
    let id =
      "0x1" +
      "-" +
      "0x0000000000000000000000000000000000000002"
    assert.entityCount("UserIDOInvestment", 1)
    assert.fieldEquals("UserIDOInvestment", id, "amount", "150")
    assert.fieldEquals("UserIDOInvestment", id, "blockTimestamp", "2000")

    // Test UserTotalSpent accumulation across multiple investments
    let userHex = "0x0000000000000000000000000000000000000002"
    assert.entityCount("UserTotalSpent", 1)
    assert.fieldEquals("UserTotalSpent", userHex, "totalSpent", "150") // 100 + 50 = 150
  })
})

describe("UserTotalSpent cross-IDO accumulation", () => {
  beforeAll(() => {
    // Create multiple pools and multiple users
    let poolId1 = BigInt.fromI32(10)
    let poolId2 = BigInt.fromI32(20)
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let poolAmount = BigInt.fromI32(1000)

    // Create first pool
    let newPoolCreatedEvent1 = createNewPoolCreatedEvent(poolId1, owner, poolAmount)
    handleNewPoolCreated(newPoolCreatedEvent1)

    // Create second pool
    let newPoolCreatedEvent2 = createNewPoolCreatedEvent(poolId2, owner, poolAmount)
    handleNewPoolCreated(newPoolCreatedEvent2)

    // User A invests in both pools
    let userA = Address.fromString("0x0000000000000000000000000000000000000003")
    let amountA1 = BigInt.fromI32(100) // invest 100 in pool 10
    let amountA2 = BigInt.fromI32(200) // invest 200 in pool 20
    
    let investedEventA1 = createInvestedEvent(poolId1, userA, amountA1, BigInt.fromI32(1))
    handleInvested(investedEventA1)
    
    let investedEventA2 = createInvestedEvent(poolId2, userA, amountA2, BigInt.fromI32(2))
    handleInvested(investedEventA2)

    // User B invests only in pool 10
    let userB = Address.fromString("0x0000000000000000000000000000000000000004")
    let amountB1 = BigInt.fromI32(50) // invest 50 in pool 10
    
    let investedEventB1 = createInvestedEvent(poolId1, userB, amountB1, BigInt.fromI32(3))
    handleInvested(investedEventB1)
  })

  afterAll(() => {
    clearStore()
  })

  test("UserTotalSpent accumulates correctly across multiple IDOs", () => {
    let userAHex = "0x0000000000000000000000000000000000000003"
    let userBHex = "0x0000000000000000000000000000000000000004"

    // Should have 2 UserTotalSpent entities (userA and userB)
    assert.entityCount("UserTotalSpent", 2)

    // User A should have total spent = 100 + 200 = 300
    assert.fieldEquals("UserTotalSpent", userAHex, "totalSpent", "300")
    assert.fieldEquals("UserTotalSpent", userAHex, "user", userAHex)

    // User B should have total spent = 50
    assert.fieldEquals("UserTotalSpent", userBHex, "totalSpent", "50")
    assert.fieldEquals("UserTotalSpent", userBHex, "user", userBHex)

    // Check that UserIDOInvestment entities are created correctly
    assert.entityCount("UserIDOInvestment", 3) // userA-pool10, userA-pool20, userB-pool10

    let userAPool10Id = "0xa" + "-" + userAHex
    let userAPool20Id = "0x14" + "-" + userAHex
    let userBPool10Id = "0xa" + "-" + userBHex

    assert.fieldEquals("UserIDOInvestment", userAPool10Id, "amount", "100")
    assert.fieldEquals("UserIDOInvestment", userAPool20Id, "amount", "200")
    assert.fieldEquals("UserIDOInvestment", userBPool10Id, "amount", "50")
  })
})
