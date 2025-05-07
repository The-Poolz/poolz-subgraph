import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { FinishPool } from "../generated/schema"
import { FinishPool as FinishPoolEvent } from "../generated/ThePoolz/ThePoolz"
import { handleFinishPool } from "../src/the-poolz"
import { createFinishPoolEvent } from "./the-poolz-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let newFinishPoolEvent = createFinishPoolEvent(id)
    handleFinishPool(newFinishPoolEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FinishPool created and stored", () => {
    assert.entityCount("FinishPool", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
