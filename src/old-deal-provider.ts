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
import { updatePoolParams, addProviderDataToPoolEntity } from "./extendedEntities/poolData"
import { Address } from "@graphprotocol/graph-ts"
import { addresses } from "./config"

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
  updatePoolParams(event.params.poolId, event.params.params)
  if (event.params.params.length == 1) {
      let dealProvider = Address.fromString(addresses.bsc.OldDealProvider.address)
      addProviderDataToPoolEntity(event.params.poolId, dealProvider, "OldDealProvider")
  } else if (event.params.params.length == 2) {
      let lockDealProvider = Address.fromString(addresses.bsc.OldLockDealProvider.address)
      addProviderDataToPoolEntity(event.params.poolId, lockDealProvider, "OldLockDealProvider")
  } else if (event.params.params.length == 3) {
      let timedDealProvider = Address.fromString(addresses.bsc.OldTimedDealProvider.address)
      addProviderDataToPoolEntity(event.params.poolId, timedDealProvider, "OldTimedDealProvider")
  }
}
