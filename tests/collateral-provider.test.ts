import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { UpdateParams } from "../generated/schema"
import { UpdateParams as UpdateParamsEvent } from "../generated/CollateralProvider/CollateralProvider"
import { handleUpdateParams } from "../src/collateral-provider"
import { createUpdateParamsEvent } from "./collateral-provider-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let poolId = BigInt.fromI32(234)
    let params = [BigInt.fromI32(234)]
    let newUpdateParamsEvent = createUpdateParamsEvent(poolId, params)
    handleUpdateParams(newUpdateParamsEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("UpdateParams created and stored", () => {
    assert.entityCount("UpdateParams", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "UpdateParams",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "234"
    )
    assert.fieldEquals(
      "UpdateParams",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "params",
      "[234]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
