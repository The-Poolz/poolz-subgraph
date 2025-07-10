import {
  EIP712DomainChanged as EIP712DomainChangedEvent,
  FirewallAdminUpdated as FirewallAdminUpdatedEvent,
  FirewallUpdated as FirewallUpdatedEvent,
  Invested as InvestedEvent,
  NewPoolCreated as NewPoolCreatedEvent,
  UpdateParams as UpdateParamsEvent,
} from "../generated/InvestProvider/InvestProvider"
import {
  EIP712DomainChanged,
  FirewallAdminUpdated,
  FirewallUpdated,
  Invested,
  InvestNewPoolCreated,
  UpdateParams,
} from "../generated/schema"
import { updateTotalInvested, createTotalInvested, updateUserIDOInvestment, updateInvestProviderPoolParams, updateUserTotalSpent } from "./extendedEntities/investProvider"
import { updatePoolParams } from "./extendedEntities/poolData"

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent,
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFirewallAdminUpdated(
  event: FirewallAdminUpdatedEvent,
): void {
  let entity = new FirewallAdminUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFirewallUpdated(event: FirewallUpdatedEvent): void {
  let entity = new FirewallUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newFirewall = event.params.newFirewall

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInvested(event: InvestedEvent): void {
  let entity = new Invested(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.newNonce = event.params.newNonce

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updateUserIDOInvestment(event.params.poolId, event.params.user, event.params.amount, event.block.timestamp)
  updateTotalInvested(event.params.poolId, event.params.amount)
  updateInvestProviderPoolParams(event.params.poolId, event.params.amount)
  updateUserTotalSpent(event.params.user, event.params.amount)
}

export function handleNewPoolCreated(event: NewPoolCreatedEvent): void {
  let entity = new InvestNewPoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.owner = event.params.owner
  entity.poolAmount = event.params.poolAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  createTotalInvested(event.params.poolId, event.params.poolAmount)
  updatePoolParams(event.params.poolId, [event.params.poolAmount], event.address, "InvestProvider")
}

export function handleUpdateParams(event: UpdateParamsEvent): void {
  let entity = new UpdateParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
