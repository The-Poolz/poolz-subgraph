import {
  FirewallAdminUpdated as FirewallAdminUpdatedEvent,
  FirewallUpdated as FirewallUpdatedEvent,
  UpdateParams as UpdateParamsEvent,
} from "../generated/TimedDealProvider/TimedDealProvider"
import {
  TimedDealProviderFirewallAdminUpdated,
  TimedDealProviderFirewallUpdated,
  TimedDealProviderUpdateParams,
} from "../generated/schema"
import { TIMED_DEAL_PROVIDER_ADDRESS, SIMPLE_BUILDER_ADDRESS } from "./config"
import { updatePoolParams } from "./extendedEntities/poolData"
import { handleMassBuildCreation } from "./extendedEntities/massBuildCreation"

export function handleFirewallAdminUpdated(
  event: FirewallAdminUpdatedEvent,
): void {
  let entity = new TimedDealProviderFirewallAdminUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFirewallUpdated(event: FirewallUpdatedEvent): void {
  let entity = new TimedDealProviderFirewallUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newFirewall = event.params.newFirewall

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateParams(event: UpdateParamsEvent): void {
  let entity = new TimedDealProviderUpdateParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updatePoolParams(event.params.poolId, event.params.params, TIMED_DEAL_PROVIDER_ADDRESS, "TimedDealProvider")
  const contractAddress = event.transaction.to
  const eventReceipt = event.receipt
  if (!contractAddress || !eventReceipt) { // for AssemblyScript compiler 
      return
  }
  else if (contractAddress.toHex().toLowerCase() == SIMPLE_BUILDER_ADDRESS) {
      handleMassBuildCreation(event.transaction.hash, event.params.poolId, eventReceipt)
  }
}
