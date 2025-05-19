import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NewPoolCreated,
  OwnershipTransferred,
  PoolApproval,
  PoolOwnershipTransfered,
  TransferIn,
  TransferInETH,
  TransferOut,
  TransferOutETH
} from "../generated/LockedDeal/LockedDeal"

export function createNewPoolCreatedEvent(
  PoolId: BigInt,
  Token: Address,
  FinishTime: BigInt,
  StartAmount: BigInt,
  Owner: Address
): NewPoolCreated {
  let newPoolCreatedEvent = changetype<NewPoolCreated>(newMockEvent())

  newPoolCreatedEvent.parameters = new Array()

  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam("PoolId", ethereum.Value.fromUnsignedBigInt(PoolId))
  )
  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )
  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "FinishTime",
      ethereum.Value.fromUnsignedBigInt(FinishTime)
    )
  )
  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "StartAmount",
      ethereum.Value.fromUnsignedBigInt(StartAmount)
    )
  )
  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam("Owner", ethereum.Value.fromAddress(Owner))
  )

  return newPoolCreatedEvent
}
