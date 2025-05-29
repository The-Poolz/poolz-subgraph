import {
  FirewallAdminUpdated as FirewallAdminUpdatedEvent,
  FirewallUpdated as FirewallUpdatedEvent,
  UpdateParams as UpdateParamsEvent,
} from "../generated/DealProvider/DealProvider"
import {
  OldDealProviderFirewallAdminUpdated,
  OldDealProviderFirewallUpdated,
  OldDealProviderUpdateParams,
} from "../generated/schema"
import { OLD_LOCK_DEAL_PROVIDER_ADDRESS, OLD_TIMED_DEAL_PROVIDER_ADDRESS } from "./config"
import { updatePoolParams } from "./extendedEntities/poolData"

export function handleFirewallAdminUpdated(
  event: FirewallAdminUpdatedEvent,
): void {
  let entity = new OldDealProviderFirewallAdminUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFirewallUpdated(event: FirewallUpdatedEvent): void {
  let entity = new OldDealProviderFirewallUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newFirewall = event.params.newFirewall

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateParams(event: UpdateParamsEvent): void {
  let entity = new OldDealProviderUpdateParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  if (event.params.params.length == 1) {
      updatePoolParams(event.params.poolId, event.params.params, event.address, "OldDealProvider")
  } else if (event.params.params.length == 2) {
      updatePoolParams(event.params.poolId, event.params.params, OLD_LOCK_DEAL_PROVIDER_ADDRESS, "OldLockDealProvider")
  } else if (event.params.params.length == 3) {
      updatePoolParams(event.params.poolId, event.params.params, OLD_TIMED_DEAL_PROVIDER_ADDRESS, "OldTimedDealProvider")
  }
}
