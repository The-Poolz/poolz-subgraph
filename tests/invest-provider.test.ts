import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EIP712DomainChanged, Invested, InvestNewPoolCreated, TotalInvested, TotalUserInvested } from "../generated/schema"
import {
  EIP712DomainChanged as EIP712DomainChangedEvent,
} from "../generated/InvestProvider/InvestProvider"
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
    assert.entityCount("TotalUserInvested", 1)

    assert.fieldEquals(
      "InvestNewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "1"
    )
    assert.fieldEquals(
      "InvestNewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InvestNewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolAmount",
      "1000"
    )

    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "1"
    )
    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000002"
    )
    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "100"
    )
    assert.fieldEquals(
      "Invested",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
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
    assert.fieldEquals("TotalUserInvested", userId, "poolId", "1")
    assert.fieldEquals(
      "TotalUserInvested",
      userId,
      "user",
      "0x0000000000000000000000000000000000000002",
    )
    assert.fieldEquals("TotalUserInvested", userId, "amount", "100")
  })
})
