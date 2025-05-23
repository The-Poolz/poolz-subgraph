import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Deposited,
  NewVaultCreated,
  OwnershipTransferred,
  VaultRoyaltySet,
  VaultStatusUpdate,
  Withdrawn
} from "../generated/VaultManager/VaultManager"

export function createDepositedEvent(
  vaultId: BigInt,
  tokenAddress: Address,
  amount: BigInt
): Deposited {
  let depositedEvent = changetype<Deposited>(newMockEvent())

  depositedEvent.parameters = new Array()

  depositedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return depositedEvent
}

export function createNewVaultCreatedEvent(
  vaultId: BigInt,
  tokenAddress: Address
): NewVaultCreated {
  let newVaultCreatedEvent = changetype<NewVaultCreated>(newMockEvent())

  newVaultCreatedEvent.parameters = new Array()

  newVaultCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  newVaultCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )

  return newVaultCreatedEvent
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

export function createVaultRoyaltySetEvent(
  vaultId: BigInt,
  tokenAddress: Address,
  receiver: Address,
  feeNumerator: BigInt
): VaultRoyaltySet {
  let vaultRoyaltySetEvent = changetype<VaultRoyaltySet>(newMockEvent())

  vaultRoyaltySetEvent.parameters = new Array()

  vaultRoyaltySetEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  vaultRoyaltySetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  vaultRoyaltySetEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  vaultRoyaltySetEvent.parameters.push(
    new ethereum.EventParam(
      "feeNumerator",
      ethereum.Value.fromUnsignedBigInt(feeNumerator)
    )
  )

  return vaultRoyaltySetEvent
}

export function createVaultStatusUpdateEvent(
  vaultId: BigInt,
  depositStatus: boolean,
  withdrawStatus: boolean
): VaultStatusUpdate {
  let vaultStatusUpdateEvent = changetype<VaultStatusUpdate>(newMockEvent())

  vaultStatusUpdateEvent.parameters = new Array()

  vaultStatusUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  vaultStatusUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "depositStatus",
      ethereum.Value.fromBoolean(depositStatus)
    )
  )
  vaultStatusUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawStatus",
      ethereum.Value.fromBoolean(withdrawStatus)
    )
  )

  return vaultStatusUpdateEvent
}

export function createWithdrawnEvent(
  vaultId: BigInt,
  tokenAddress: Address,
  to: Address,
  amount: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawnEvent
}
