import {
  FirewallAdminUpdated as FirewallAdminUpdatedEvent,
  FirewallUpdated as FirewallUpdatedEvent,
  UpdateParams as UpdateParamsEvent,
} from "../generated/LockDealProvider/LockDealProvider"
import {
  LockDealProviderFirewallAdminUpdated,
  LockDealProviderFirewallUpdated,
  LockDealProviderUpdateParams,
} from "../generated/schema"
import { OLD_LOCK_DEAL_PROVIDER_ADDRESS, SIMPLE_BUILDER_ADDRESS } from "./config"
import { updatePoolParams } from "./extendedEntities/poolData"
import { handleMassBuildCreation } from "./extendedEntities/massBuildCreation"

export function handleFirewallAdminUpdated(
  event: FirewallAdminUpdatedEvent,
): void {
  let entity = new LockDealProviderFirewallAdminUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFirewallUpdated(event: FirewallUpdatedEvent): void {
  let entity = new LockDealProviderFirewallUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newFirewall = event.params.newFirewall

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateParams(event: UpdateParamsEvent): void {
  let entity = new LockDealProviderUpdateParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updatePoolParams(event.params.poolId, event.params.params, OLD_LOCK_DEAL_PROVIDER_ADDRESS, "OldLockDealProvider")
  const contractAddress = event.transaction.to
  const eventReceipt = event.receipt  
  if (!contractAddress || !eventReceipt) { // for AssemblyScript compiler 
      return
  }
  else if (contractAddress.toHex().toLowerCase() == SIMPLE_BUILDER_ADDRESS) {
      handleMassBuildCreation(event.transaction.hash, event.params.poolId, eventReceipt)
  }
}
