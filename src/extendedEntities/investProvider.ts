import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { PoolData, TotalInvested, TotalUserInvested } from "../../generated/schema"

export function updateTotalInvested(poolId: BigInt, amount: BigInt): void {
    let totalInvested = TotalInvested.load(poolId.toHexString()) // id is string
    if (totalInvested == null) {
        log.critical("TotalInvested entity not found for poolId: {}", [poolId.toString()])
    } else {
        totalInvested.totalInvested = totalInvested.totalInvested.plus(amount)
        totalInvested.leftAmount = totalInvested.leftAmount.minus(amount)
        totalInvested.save()
    }
}

export function createTotalInvested(poolId: BigInt, poolAmount: BigInt): void {
    let totalInvested = new TotalInvested(poolId.toHexString()) // id is string
    totalInvested.poolId = poolId
    totalInvested.poolAmount = poolAmount
    totalInvested.leftAmount = poolAmount // Initially, left amount is equal to pool amount
    totalInvested.totalInvested = BigInt.fromI32(0) // Initialize to 0
    totalInvested.save()
}

export function updateTotalUserInvested(poolId: BigInt, user: Bytes, amount: BigInt, blockTimestamp: BigInt): void {
    let id = poolId.toHex() + "-" + user.toHex() // id is string
    let totalUserInvested = TotalUserInvested.load(id)

    if (totalUserInvested == null) {
        totalUserInvested = new TotalUserInvested(id)
        totalUserInvested.poolId = poolId
        totalUserInvested.user = user // make sure `user` field is of type `Bytes`
        totalUserInvested.amount = amount
    } else {
        totalUserInvested.amount = totalUserInvested.amount.plus(amount)
    }
    // Always update the timestamp with the latest invest block
    totalUserInvested.blockTimestamp = blockTimestamp

    totalUserInvested.save()
}

export function updateInvestProviderPoolParams(poolId: BigInt, amount: BigInt): void {
    let poolData = PoolData.load(poolId.toHexString())
    if (poolData && poolData.params.length > 1) {
        poolData.params[1] = poolData.params[1].minus(amount)
        poolData.save()
    }
}
