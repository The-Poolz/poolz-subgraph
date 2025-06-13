import {
  EIP712DomainChanged as EIP712DomainChangedEvent,
  FirewallAdminUpdated as FirewallAdminUpdatedEvent,
  FirewallUpdated as FirewallUpdatedEvent,
  PoolCreated as PoolCreatedEvent,
  TokensDispensed as TokensDispensedEvent,
  UpdateParams as UpdateParamsEvent,
} from "../generated/DispenserProvider/DispenserProvider"
import {
  EIP712DomainChanged,
  DispenserProviderFirewallAdminUpdated,
  DispenserProviderFirewallUpdated,
  PoolCreated,
  TokensDispensed,
  DispenserProviderUpdateParams,
} from "../generated/schema"
import { updatePoolParams } from "./extendedEntities/poolData"
import {
    updateDispenserTokenReserve,
    saveTokenAndVaultId,
    addTokenAndVaultIdToSimpleProvider,
} from "./extendedEntities/dispenser"

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
  let entity = new DispenserProviderFirewallAdminUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFirewallUpdated(event: FirewallUpdatedEvent): void {
  let entity = new DispenserProviderFirewallUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newFirewall = event.params.newFirewall

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let entity = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.provider = event.params.provider

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  const receipt = event.receipt
  if (receipt) addTokenAndVaultIdToSimpleProvider(event.transaction.hash, event.params.poolId, receipt)
}

export function handleTokensDispensed(event: TokensDispensedEvent): void {
  let entity = new TokensDispensed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.user = event.params.user
  entity.amountTaken = event.params.amountTaken
  entity.leftAmount = event.params.leftAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updateDispenserTokenReserve(event.params.poolId, event.params.amountTaken, event.params.leftAmount)
}

export function handleUpdateParams(event: UpdateParamsEvent): void {
  let entity = new DispenserProviderUpdateParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updatePoolParams(event.params.poolId, event.params.params, event.address, "DispenserProvider")
  saveTokenAndVaultId(event.transaction.hash, event.params.poolId, event.logIndex.toI32())
}
