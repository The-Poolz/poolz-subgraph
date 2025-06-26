import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GovernorUpdated } from "../generated/schema"
import { GovernorUpdated as GovernorUpdatedEvent } from "../generated/DelayVault/DelayVault"
import { handleGovernorUpdated } from "../src/delay-vault"
import { createGovernorUpdatedEvent } from "./delay-vault-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let oldGovernor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newGovernor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newGovernorUpdatedEvent = createGovernorUpdatedEvent(
      oldGovernor,
      newGovernor
    )
    handleGovernorUpdated(newGovernorUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GovernorUpdated created and stored", () => {
    assert.entityCount("GovernorUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GovernorUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "oldGovernor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GovernorUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "newGovernor",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
