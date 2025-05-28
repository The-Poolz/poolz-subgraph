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
import { updatePoolParams, addProviderDataToPoolEntity } from "./extendedEntities/poolData"
import { addresses } from "./config"
import { Address } from "@graphprotocol/graph-ts"

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
  updatePoolParams(event.params.poolId, event.params.params)
  if (event.params.params.length == 1) {
    let dealProvider = Address.fromString(addresses.bsc.DealProvider.address)
    addProviderDataToPoolEntity(event.params.poolId, dealProvider, "DealProvider")
  } else if (event.params.params.length == 2) {
    let lockDealProvider = Address.fromString(addresses.bsc.LockDealProvider.address)
    addProviderDataToPoolEntity(event.params.poolId, lockDealProvider, "LockDealProvider")
  } else if (event.params.params.length == 3) {
    let timedDealProvider = Address.fromString(addresses.bsc.TimedDealProvider.address)
    addProviderDataToPoolEntity(event.params.poolId, timedDealProvider, "TimedDealProvider")
  }
}
