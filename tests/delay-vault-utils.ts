import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GovernorUpdated,
  OwnershipTransferred,
  Paused,
  RedeemedTokens,
  TokenRedemptionApproval,
  TokenStatusFilter,
  TransferIn,
  TransferOut,
  Unpaused,
  UpdatedMaxDelay,
  UpdatedMinDelays,
  VaultValueChanged
} from "../generated/DelayVault/DelayVault"

export function createGovernorUpdatedEvent(
  oldGovernor: Address,
  newGovernor: Address
): GovernorUpdated {
  let governorUpdatedEvent = changetype<GovernorUpdated>(newMockEvent())

  governorUpdatedEvent.parameters = new Array()

  governorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldGovernor",
      ethereum.Value.fromAddress(oldGovernor)
    )
  )
  governorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newGovernor",
      ethereum.Value.fromAddress(newGovernor)
    )
  )

  return governorUpdatedEvent
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

export function createRedeemedTokensEvent(
  Token: Address,
  Amount: BigInt,
  RemaningAmount: BigInt
): RedeemedTokens {
  let redeemedTokensEvent = changetype<RedeemedTokens>(newMockEvent())

  redeemedTokensEvent.parameters = new Array()

  redeemedTokensEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )
  redeemedTokensEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )
  redeemedTokensEvent.parameters.push(
    new ethereum.EventParam(
      "RemaningAmount",
      ethereum.Value.fromUnsignedBigInt(RemaningAmount)
    )
  )

  return redeemedTokensEvent
}

export function createTokenRedemptionApprovalEvent(
  Token: Address,
  User: Address,
  Status: boolean
): TokenRedemptionApproval {
  let tokenRedemptionApprovalEvent =
    changetype<TokenRedemptionApproval>(newMockEvent())

  tokenRedemptionApprovalEvent.parameters = new Array()

  tokenRedemptionApprovalEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )
  tokenRedemptionApprovalEvent.parameters.push(
    new ethereum.EventParam("User", ethereum.Value.fromAddress(User))
  )
  tokenRedemptionApprovalEvent.parameters.push(
    new ethereum.EventParam("Status", ethereum.Value.fromBoolean(Status))
  )

  return tokenRedemptionApprovalEvent
}

export function createTokenStatusFilterEvent(
  Token: Address,
  Status: boolean
): TokenStatusFilter {
  let tokenStatusFilterEvent = changetype<TokenStatusFilter>(newMockEvent())

  tokenStatusFilterEvent.parameters = new Array()

  tokenStatusFilterEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )
  tokenStatusFilterEvent.parameters.push(
    new ethereum.EventParam("Status", ethereum.Value.fromBoolean(Status))
  )

  return tokenStatusFilterEvent
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

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUpdatedMaxDelayEvent(
  OldDelay: BigInt,
  NewDelay: BigInt
): UpdatedMaxDelay {
  let updatedMaxDelayEvent = changetype<UpdatedMaxDelay>(newMockEvent())

  updatedMaxDelayEvent.parameters = new Array()

  updatedMaxDelayEvent.parameters.push(
    new ethereum.EventParam(
      "OldDelay",
      ethereum.Value.fromUnsignedBigInt(OldDelay)
    )
  )
  updatedMaxDelayEvent.parameters.push(
    new ethereum.EventParam(
      "NewDelay",
      ethereum.Value.fromUnsignedBigInt(NewDelay)
    )
  )

  return updatedMaxDelayEvent
}

export function createUpdatedMinDelaysEvent(
  Token: Address,
  Amounts: Array<BigInt>,
  StartDelays: Array<BigInt>,
  CliffDelays: Array<BigInt>,
  FinishDelays: Array<BigInt>
): UpdatedMinDelays {
  let updatedMinDelaysEvent = changetype<UpdatedMinDelays>(newMockEvent())

  updatedMinDelaysEvent.parameters = new Array()

  updatedMinDelaysEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )
  updatedMinDelaysEvent.parameters.push(
    new ethereum.EventParam(
      "Amounts",
      ethereum.Value.fromUnsignedBigIntArray(Amounts)
    )
  )
  updatedMinDelaysEvent.parameters.push(
    new ethereum.EventParam(
      "StartDelays",
      ethereum.Value.fromUnsignedBigIntArray(StartDelays)
    )
  )
  updatedMinDelaysEvent.parameters.push(
    new ethereum.EventParam(
      "CliffDelays",
      ethereum.Value.fromUnsignedBigIntArray(CliffDelays)
    )
  )
  updatedMinDelaysEvent.parameters.push(
    new ethereum.EventParam(
      "FinishDelays",
      ethereum.Value.fromUnsignedBigIntArray(FinishDelays)
    )
  )

  return updatedMinDelaysEvent
}

export function createVaultValueChangedEvent(
  Token: Address,
  Owner: Address,
  Amount: BigInt,
  StartDelay: BigInt,
  CliffDelay: BigInt,
  FinishDelay: BigInt
): VaultValueChanged {
  let vaultValueChangedEvent = changetype<VaultValueChanged>(newMockEvent())

  vaultValueChangedEvent.parameters = new Array()

  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam("Token", ethereum.Value.fromAddress(Token))
  )
  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam("Owner", ethereum.Value.fromAddress(Owner))
  )
  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )
  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam(
      "StartDelay",
      ethereum.Value.fromUnsignedBigInt(StartDelay)
    )
  )
  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam(
      "CliffDelay",
      ethereum.Value.fromUnsignedBigInt(CliffDelay)
    )
  )
  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam(
      "FinishDelay",
      ethereum.Value.fromUnsignedBigInt(FinishDelay)
    )
  )

  return vaultValueChangedEvent
}
