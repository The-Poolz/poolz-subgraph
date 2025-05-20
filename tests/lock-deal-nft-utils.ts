import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BaseURIChanged,
  BatchMetadataUpdate,
  ContractApproved,
  MetadataUpdate,
  OwnershipTransferred,
  PoolSplit,
  TokenWithdrawn,
  Transfer
} from "../generated/LockDealNFT/LockDealNFT"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBaseURIChangedEvent(
  oldBaseURI: string,
  newBaseURI: string
): BaseURIChanged {
  let baseUriChangedEvent = changetype<BaseURIChanged>(newMockEvent())

  baseUriChangedEvent.parameters = new Array()

  baseUriChangedEvent.parameters.push(
    new ethereum.EventParam("oldBaseURI", ethereum.Value.fromString(oldBaseURI))
  )
  baseUriChangedEvent.parameters.push(
    new ethereum.EventParam("newBaseURI", ethereum.Value.fromString(newBaseURI))
  )

  return baseUriChangedEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createContractApprovedEvent(
  contractAddress: Address,
  status: boolean
): ContractApproved {
  let contractApprovedEvent = changetype<ContractApproved>(newMockEvent())

  contractApprovedEvent.parameters = new Array()

  contractApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  contractApprovedEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return contractApprovedEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
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

export function createPoolSplitEvent(
  poolId: BigInt,
  owner: Address,
  newPoolId: BigInt,
  newOwner: Address,
  splitLeftAmount: BigInt,
  newSplitLeftAmount: BigInt
): PoolSplit {
  let poolSplitEvent = changetype<PoolSplit>(newMockEvent())

  poolSplitEvent.parameters = new Array()

  poolSplitEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  poolSplitEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  poolSplitEvent.parameters.push(
    new ethereum.EventParam(
      "newPoolId",
      ethereum.Value.fromUnsignedBigInt(newPoolId)
    )
  )
  poolSplitEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )
  poolSplitEvent.parameters.push(
    new ethereum.EventParam(
      "splitLeftAmount",
      ethereum.Value.fromUnsignedBigInt(splitLeftAmount)
    )
  )
  poolSplitEvent.parameters.push(
    new ethereum.EventParam(
      "newSplitLeftAmount",
      ethereum.Value.fromUnsignedBigInt(newSplitLeftAmount)
    )
  )

  return poolSplitEvent
}

export function createTokenWithdrawnEvent(
  poolId: BigInt,
  owner: Address,
  withdrawnAmount: BigInt,
  leftAmount: BigInt
): TokenWithdrawn {
  let tokenWithdrawnEvent = changetype<TokenWithdrawn>(newMockEvent())

  tokenWithdrawnEvent.parameters = new Array()

  tokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  tokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawnAmount",
      ethereum.Value.fromUnsignedBigInt(withdrawnAmount)
    )
  )
  tokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "leftAmount",
      ethereum.Value.fromUnsignedBigInt(leftAmount)
    )
  )

  return tokenWithdrawnEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
