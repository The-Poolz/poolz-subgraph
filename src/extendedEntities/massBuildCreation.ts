import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { UpdateParams, PoolData } from "../../generated/schema"

export function handleMassBuildCreation(
    hash: Bytes,
    logIndex: i32,
    vaultId: BigInt,
    tokenAddress: Bytes,
    totalAmount: BigInt
): void {
    let nextIndex = logIndex + 1
    let amount = BigInt.zero()
    do {
        let entity = UpdateParams.loadInBlock(hash.concatI32(nextIndex))
        if (entity) {
            let poolData = PoolData.load(entity.poolId.toHexString())
            if (poolData) {
                poolData.vaultId = vaultId
                poolData.tokenAddress = tokenAddress
                poolData.save()
            }
            nextIndex += 2
            amount = entity.params[0] // its can't be zero length
        }
    } while (totalAmount.minus(amount).gt(BigInt.zero()))
}
