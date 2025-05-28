import { UpdateParams as UpdateParamsEvent } from "../generated/RefundProvider/RefundProvider"
import { UpdateParams } from "../generated/schema"
import { updatePoolParams, addProviderDataToPoolEntity } from "./extendedEntities/poolData"
import { Address } from "@graphprotocol/graph-ts"
import { addresses } from "./config"

export function handleUpdateParams(event: UpdateParamsEvent): void {
  let entity = new UpdateParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.poolId = event.params.poolId
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  updatePoolParams(event.params.poolId, event.params.params)
  const refundProvider = Address.fromString(addresses.bsc.RefundProvider.address)
  addProviderDataToPoolEntity(event.params.poolId, refundProvider, "RefundProvider")
}
