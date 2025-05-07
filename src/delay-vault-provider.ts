import {
    UpdateParams as UpdateParamsEvent,
    VaultValueChanged as VaultValueChangedEvent,
} from "../generated/DelayVaultProvider/DelayVaultProvider"
import { UpdateParams, VaultValueChanged } from "../generated/schema"

export function handleUpdateParams(event: UpdateParamsEvent): void {
    let entity = new UpdateParams(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.poolId = event.params.poolId
    entity.params = event.params.params

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleVaultValueChanged(event: VaultValueChangedEvent): void {
    let entity = new VaultValueChanged(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Token = event.params.token
    entity.Owner = event.params.owner
    entity.Amount = event.params.amount

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}
