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

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPoolApprovalEvent(
  PoolId: BigInt,
  Spender: Address,
  Amount: BigInt
): PoolApproval {
  let poolApprovalEvent = changetype<PoolApproval>(newMockEvent())

  poolApprovalEvent.parameters = new Array()

  poolApprovalEvent.parameters.push(
    new ethereum.EventParam("PoolId", ethereum.Value.fromUnsignedBigInt(PoolId))
  )
  poolApprovalEvent.parameters.push(
    new ethereum.EventParam("Spender", ethereum.Value.fromAddress(Spender))
  )
  poolApprovalEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )

  return poolApprovalEvent
}

export function createPoolOwnershipTransferedEvent(
  PoolId: BigInt,
  NewOwner: Address,
  OldOwner: Address
): PoolOwnershipTransfered {
  let poolOwnershipTransferedEvent =
    changetype<PoolOwnershipTransfered>(newMockEvent())

  poolOwnershipTransferedEvent.parameters = new Array()

  poolOwnershipTransferedEvent.parameters.push(
    new ethereum.EventParam("PoolId", ethereum.Value.fromUnsignedBigInt(PoolId))
  )
  poolOwnershipTransferedEvent.parameters.push(
    new ethereum.EventParam("NewOwner", ethereum.Value.fromAddress(NewOwner))
  )
  poolOwnershipTransferedEvent.parameters.push(
    new ethereum.EventParam("OldOwner", ethereum.Value.fromAddress(OldOwner))
  )

  return poolOwnershipTransferedEvent
}

export function createTransferInEvent(
  Amount: BigInt,
  From: Address,
  Token: Address
): TransferIn {
  let transferInEvent = changetype<TransferIn>(newMockEvent())

  transferInEvent.parameters = new Array()

  transferInEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )
  transferInEvent.parameters.push(
    new ethereum.EventParam("From", ethereum.Value.fromAddress(From))
  )
  transferInEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )

  return transferInEvent
}

export function createTransferInETHEvent(
  Amount: BigInt,
  From: Address
): TransferInETH {
  let transferInEthEvent = changetype<TransferInETH>(newMockEvent())

  transferInEthEvent.parameters = new Array()

  transferInEthEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )
  transferInEthEvent.parameters.push(
    new ethereum.EventParam("From", ethereum.Value.fromAddress(From))
  )

  return transferInEthEvent
}

export function createTransferOutEvent(
  Amount: BigInt,
  To: Address,
  Token: Address
): TransferOut {
  let transferOutEvent = changetype<TransferOut>(newMockEvent())

  transferOutEvent.parameters = new Array()

  transferOutEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )
  transferOutEvent.parameters.push(
    new ethereum.EventParam("To", ethereum.Value.fromAddress(To))
  )
  transferOutEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )

  return transferOutEvent
}

export function createTransferOutETHEvent(
  Amount: BigInt,
  To: Address
): TransferOutETH {
  let transferOutEthEvent = changetype<TransferOutETH>(newMockEvent())

  transferOutEthEvent.parameters = new Array()

  transferOutEthEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )
  transferOutEthEvent.parameters.push(
    new ethereum.EventParam("To", ethereum.Value.fromAddress(To))
  )

  return transferOutEthEvent
}
