import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { FirewallAdminUpdated } from "../generated/schema"
import { FirewallAdminUpdated as FirewallAdminUpdatedEvent } from "../generated/TimedDealProvider/TimedDealProvider"
import { handleFirewallAdminUpdated } from "../src/timed-deal-provider"
import { createFirewallAdminUpdatedEvent } from "./timed-deal-provider-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newAdmin = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newFirewallAdminUpdatedEvent = createFirewallAdminUpdatedEvent(newAdmin)
    handleFirewallAdminUpdated(newFirewallAdminUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FirewallAdminUpdated created and stored", () => {
    assert.entityCount("TimedDealProviderFirewallAdminUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TimedDealProviderFirewallAdminUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "newAdmin",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
