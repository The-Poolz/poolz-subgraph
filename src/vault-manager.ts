import {
    Deposited as DepositedEvent,
    NewVaultCreated as NewVaultCreatedEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    VaultRoyaltySet as VaultRoyaltySetEvent,
    VaultStatusUpdate as VaultStatusUpdateEvent,
    Withdrawn as WithdrawnEvent,
} from "../generated/VaultManager/VaultManager"
import {
    Deposited,
    NewVaultCreated,
    OwnershipTransferred,
    VaultRoyaltySet,
    VaultStatusUpdate,
    Withdrawn,
} from "../generated/schema"
import {
    addNewVault,
    decreaseVaultAmount,
    increaseVaultAmount,
    updateVaultStatus,
    setVaultRoyalty,
} from "./extendedEntities/vault"

export function handleDeposited(event: DepositedEvent): void {
  let entity = new Deposited(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.vaultId = event.params.vaultId
  entity.tokenAddress = event.params.tokenAddress
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  increaseVaultAmount(event.params.vaultId, event.params.amount)
}

export function handleNewVaultCreated(event: NewVaultCreatedEvent): void {
  let entity = new NewVaultCreated(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.vaultId = event.params.vaultId
  entity.tokenAddress = event.params.tokenAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  addNewVault(event.transaction.hash, event.params.vaultId, event.params.tokenAddress)
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVaultRoyaltySet(event: VaultRoyaltySetEvent): void {
  let entity = new VaultRoyaltySet(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.vaultId = event.params.vaultId
  entity.tokenAddress = event.params.tokenAddress
  entity.receiver = event.params.receiver
  entity.feeNumerator = event.params.feeNumerator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  setVaultRoyalty(event.params.vaultId, event.params.receiver, event.params.feeNumerator)
}

export function handleVaultStatusUpdate(event: VaultStatusUpdateEvent): void {
  let entity = new VaultStatusUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.vaultId = event.params.vaultId
  entity.depositStatus = event.params.depositStatus
  entity.withdrawStatus = event.params.withdrawStatus

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updateVaultStatus(event.params.vaultId, event.params.depositStatus, event.params.withdrawStatus)
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.vaultId = event.params.vaultId
  entity.tokenAddress = event.params.tokenAddress
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  decreaseVaultAmount(event.params.vaultId, event.params.amount)
}
