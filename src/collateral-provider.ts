import { UpdateParams as UpdateParamsEvent } from "../generated/CollateralProvider/CollateralProvider"
import { UpdateParams } from "../generated/schema"
import { updatePoolParams } from "./extendedEntities/poolData"
import { saveTokenAndVaultId } from "./extendedEntities/collateralProvider"
import { SIMPLE_REFUND_BUILDER_ADDRESS } from "./config"

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
  updatePoolParams(event.params.poolId, event.params.params, event.address, "CollateralProvider")
  const contractAddress = event.transaction.to
  const eventReceipt = event.receipt
  if (!contractAddress || !eventReceipt) {
      return
  }
  if (contractAddress.toHex().toLowerCase() == SIMPLE_REFUND_BUILDER_ADDRESS) {
    saveTokenAndVaultId(eventReceipt, event.transaction.hash, event.params.poolId)
  }
}
