import {
  FirewallAdminUpdated as FirewallAdminUpdatedEvent,
  FirewallUpdated as FirewallUpdatedEvent,
  UpdateParams as UpdateParamsEvent,
} from "../generated/DealProvider/DealProvider"
import {
  FirewallAdminUpdated,
  FirewallUpdated,
  DealProviderUpdateParams,
} from "../generated/schema"
import { updatePoolParams } from "./extendedEntities/poolData"
import { LOCK_DEAL_PROVIDER_ADDRESS, TIMED_DEAL_PROVIDER_ADDRESS } from "./config"

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

export function handleUpdateParams(event: UpdateParamsEvent): void {
  let entity = new DealProviderUpdateParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  if (event.params.params.length == 1) {
    updatePoolParams(event.params.poolId, event.params.params, event.address, "DealProvider")
  } else if (event.params.params.length == 2) {
    updatePoolParams(event.params.poolId, event.params.params, LOCK_DEAL_PROVIDER_ADDRESS, "LockDealProvider")
  } else if (event.params.params.length == 3) {
    updatePoolParams(event.params.poolId, event.params.params, TIMED_DEAL_PROVIDER_ADDRESS, "TimedDealProvider")
  }
}
