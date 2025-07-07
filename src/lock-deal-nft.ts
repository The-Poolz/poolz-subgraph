import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BaseURIChanged as BaseURIChangedEvent,
  BatchMetadataUpdate as BatchMetadataUpdateEvent,
  ContractApproved as ContractApprovedEvent,
  MetadataUpdate as MetadataUpdateEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolSplit as PoolSplitEvent,
  TokenWithdrawn as TokenWithdrawnEvent,
  Transfer as TransferEvent,
} from "../generated/LockDealNFT/LockDealNFT"
import {
  Approval,
  ApprovalForAll,
  BaseURIChanged,
  BatchMetadataUpdate,
  ContractApproved,
  MetadataUpdate,
  LockDealNFTOwnershipTransferred,
  PoolSplit,
  TokenWithdrawn,
  Transfer,
  UniqueUsers,
} from "../generated/schema"
import { updateAllowedContract } from "./extendedEntities/allowedContracts"
import { updateLockedPool, updatePoolAmount, handleSplitLockedPool } from "./extendedEntities/poolData"
import { BigInt } from "@graphprotocol/graph-ts"
import { isPoolxUnlocksPoolId, removeUnlocksPoolx } from "./extendedEntities/lockedPoolxBalance"
import { trackUniqueUser } from "./extendedEntities/uniqueUsersUtils"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBaseURIChanged(event: BaseURIChangedEvent): void {
  let entity = new BaseURIChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldBaseURI = event.params.oldBaseURI
  entity.newBaseURI = event.params.newBaseURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBatchMetadataUpdate(
  event: BatchMetadataUpdateEvent,
): void {
  let entity = new BatchMetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity._fromTokenId = event.params._fromTokenId
  entity._toTokenId = event.params._toTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContractApproved(event: ContractApprovedEvent): void {
  let entity = new ContractApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.contractAddress = event.params.contractAddress
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  updateAllowedContract(event.params.contractAddress, event.params.status, event.block.timestamp)
}

export function handleMetadataUpdate(event: MetadataUpdateEvent): void {
  let entity = new MetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity._tokenId = event.params._tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new LockDealNFTOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolSplit(event: PoolSplitEvent): void {
  let entity = new PoolSplit(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.owner = event.params.owner
  entity.newPoolId = event.params.newPoolId
  entity.newOwner = event.params.newOwner
  entity.splitLeftAmount = event.params.splitLeftAmount
  entity.newSplitLeftAmount = event.params.newSplitLeftAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  handleSplitLockedPool(
    event.params.poolId,
    event.params.newPoolId,
    event.params.splitLeftAmount,
    event.params.newSplitLeftAmount,
  )
}

export function handleTokenWithdrawn(event: TokenWithdrawnEvent): void {
  let entity = new TokenWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.owner = event.params.owner
  entity.withdrawnAmount = event.params.withdrawnAmount
  entity.leftAmount = event.params.leftAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updatePoolAmount(event.params.poolId, event.params.leftAmount)
  if (isPoolxUnlocksPoolId(event.params.poolId) && event.params.leftAmount.equals(BigInt.fromI32(0))) {
      removeUnlocksPoolx(event.params.poolId)
  }
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updateLockedPool(event.params.tokenId, event.params.to, event.params.from)
  
  // Track unique user interaction only for mints (from zero address)
  if (event.params.from.toHex() == "0x0000000000000000000000000000000000000000") {
    // Track the user - the utility function will handle uniqueness
    trackUniqueUser(
      event.params.to, 
      event.params.tokenId,
      event.block.timestamp,
      event.transaction.hash,
      event.block.number
    )
  }
}