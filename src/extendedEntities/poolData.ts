import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { PoolData } from "../../generated/schema"

export function updateLockedPool(poolId: BigInt, owner: Bytes): void {
    // try to load the existing PoolData entity
    let poolData = PoolData.load(poolId.toHexString())
    // if it doesn't exist, create a new one
    if (poolData == null) {
        poolData = new PoolData(poolId.toHexString())
        poolData.poolId = poolId
        poolData.params = []
    }
    poolData.owner = owner
    poolData.save()
}

export function updatePoolParams(poolId: BigInt, params: BigInt[]): void {
    let poolData = PoolData.load(poolId.toHexString())
    if (poolData) {
        poolData.params = params
        poolData.save()
    }
}

export function updatePoolAmount(poolId: BigInt, leftAmount: BigInt): void {
    let poolData = PoolData.load(poolId.toHexString())
    if (poolData && poolData.params.length > 0) {
        poolData.params[0] = leftAmount
        poolData.save()
    }
}

export function handleSplitLockedPool(
    poolId: BigInt,
    newPoolId: BigInt,
    splitLeftAmount: BigInt,
    newSplitLeftAmount: BigInt
): void {
    // load the original pool data
    let originalPoolData = PoolData.load(poolId.toHexString())
    if (originalPoolData) {
        // try to load the new pool data
        let newPoolData = PoolData.load(newPoolId.toHexString())
        // if it doesn't exist, create a new one
        if (newPoolData == null) {
            newPoolData = new PoolData(newPoolId.toHexString())
            newPoolData.poolId = newPoolId
        }
        newPoolData.params = originalPoolData.params
        // update the left amount for the new pool
        newPoolData.params[0] = newSplitLeftAmount
        // update the left amount for the original pool
        originalPoolData.params[0] = splitLeftAmount
        // owner data will be updated in transfer event handler
        newPoolData.save()
        originalPoolData.save()
    }
}
