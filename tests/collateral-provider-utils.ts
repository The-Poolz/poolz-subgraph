import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { UpdateParams } from "../generated/CollateralProvider/CollateralProvider"

export function createUpdateParamsEvent(
  poolId: BigInt,
  params: Array<BigInt>
): UpdateParams {
  let updateParamsEvent = changetype<UpdateParams>(newMockEvent())

  updateParamsEvent.parameters = new Array()

  updateParamsEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  updateParamsEvent.parameters.push(
    new ethereum.EventParam(
      "params",
      ethereum.Value.fromUnsignedBigIntArray(params)
    )
  )

  return updateParamsEvent
}
