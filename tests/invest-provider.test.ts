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
  })
})
