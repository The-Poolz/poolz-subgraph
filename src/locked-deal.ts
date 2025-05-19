import { NewPoolCreated as NewPoolCreatedEvent } from "../generated/LockedDeal/LockedDeal"
import { NewPoolCreated } from "../generated/schema"

export function handleNewPoolCreated(event: NewPoolCreatedEvent): void {
    let entity = new NewPoolCreated(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.PoolId = event.params.PoolId
    entity.Token = event.params.Token
    entity.FinishTime = event.params.FinishTime
    entity.StartAmount = event.params.StartAmount
    entity.Owner = event.params.Owner

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}
