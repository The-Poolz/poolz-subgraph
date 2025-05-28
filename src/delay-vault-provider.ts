import {
    UpdateParams as UpdateParamsEvent,
    VaultValueChanged as VaultValueChangedEvent,
} from "../generated/DelayVaultProvider/DelayVaultProvider"
import { UpdateParams, DelayVaultProviderVaultValueChanged } from "../generated/schema"
import { updatePoolxLockedBalance } from "./extendedEntities/lockedPoolxBalance"
import {
    updatePoolParams,
    handleDelayVaultProviderParams,
    addProviderDataToPoolEntity,
} from "./extendedEntities/poolData"
import { Address } from "@graphprotocol/graph-ts"
import { addresses } from "./config"

export function handleUpdateParams(event: UpdateParamsEvent): void {
    let entity = new UpdateParams(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.poolId = event.params.poolId
    entity.params = event.params.params

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
    updatePoolParams(event.params.poolId, event.params.params)
}

export function handleVaultValueChanged(event: VaultValueChangedEvent): void {
    let entity = new DelayVaultProviderVaultValueChanged(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.token = event.params.token
    entity.owner = event.params.owner
    entity.amount = event.params.amount

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
    updatePoolxLockedBalance(event.params.owner, event.params.amount, event.block.timestamp, false)
    const poolId = handleDelayVaultProviderParams(event)
    const delayVaultProvider = Address.fromString(addresses.bsc.DelayVaultProvider.address)
    addProviderDataToPoolEntity(poolId, delayVaultProvider, "DelayVaultProvider")
}
