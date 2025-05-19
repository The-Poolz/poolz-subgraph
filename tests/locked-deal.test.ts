import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { handleNewPoolCreated } from "../src/locked-deal"
import { createNewPoolCreatedEvent } from "./locked-deal-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let PoolId = BigInt.fromI32(234)
    let Token = Address.fromString("0x0000000000000000000000000000000000000001")
    let FinishTime = BigInt.fromI32(234)
    let StartAmount = BigInt.fromI32(234)
    let Owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let newNewPoolCreatedEvent = createNewPoolCreatedEvent(
      PoolId,
      Token,
      FinishTime,
      StartAmount,
      Owner
    )
    handleNewPoolCreated(newNewPoolCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewPoolCreated created and stored", () => {
    assert.entityCount("NewPoolCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "PoolId",
      "234"
    )
    assert.fieldEquals(
      "NewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "Token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "FinishTime",
      "234"
    )
    assert.fieldEquals(
      "NewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "StartAmount",
      "234"
    )
    assert.fieldEquals(
      "NewPoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "Owner",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
