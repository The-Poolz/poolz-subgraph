import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EIP712DomainChanged } from "../generated/schema"
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
})

describe("TotalUserInvested timestamp updates", () => {
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
    let id =
      "0x" +
      "1".padStart(64, "0") +
      "-0x0000000000000000000000000000000000000002"
    assert.entityCount("TotalUserInvested", 1)
    assert.fieldEquals("TotalUserInvested", id, "amount", "150")
    assert.fieldEquals("TotalUserInvested", id, "blockTimestamp", "2000")
  })
})
