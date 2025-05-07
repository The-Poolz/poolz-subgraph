import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  FinishPool,
  NewInvestorEvent,
  NewPool,
  OwnershipTransferred,
  Paused,
  PoolUpdate,
  TransferIn,
  TransferInETH,
  TransferOut,
  TransferOutETH,
  Unpaused
} from "../generated/ThePoolz/ThePoolz"

export function createFinishPoolEvent(id: BigInt): FinishPool {
  let finishPoolEvent = changetype<FinishPool>(newMockEvent())

  finishPoolEvent.parameters = new Array()

  finishPoolEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return finishPoolEvent
}

export function createNewInvestorEventEvent(
  Investor_ID: BigInt,
  Investor_Address: Address,
  LockedDeal_ID: BigInt
): NewInvestorEvent {
  let newInvestorEventEvent = changetype<NewInvestorEvent>(newMockEvent())

  newInvestorEventEvent.parameters = new Array()

  newInvestorEventEvent.parameters.push(
    new ethereum.EventParam(
      "Investor_ID",
      ethereum.Value.fromUnsignedBigInt(Investor_ID)
    )
  )
  newInvestorEventEvent.parameters.push(
    new ethereum.EventParam(
      "Investor_Address",
      ethereum.Value.fromAddress(Investor_Address)
    )
  )
  newInvestorEventEvent.parameters.push(
    new ethereum.EventParam(
      "LockedDeal_ID",
      ethereum.Value.fromUnsignedBigInt(LockedDeal_ID)
    )
  )

  return newInvestorEventEvent
}

export function createNewPoolEvent(token: Address, id: BigInt): NewPool {
  let newPoolEvent = changetype<NewPool>(newMockEvent())

  newPoolEvent.parameters = new Array()

  newPoolEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  newPoolEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return newPoolEvent
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

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createPoolUpdateEvent(id: BigInt): PoolUpdate {
  let poolUpdateEvent = changetype<PoolUpdate>(newMockEvent())

  poolUpdateEvent.parameters = new Array()

  poolUpdateEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return poolUpdateEvent
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

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
