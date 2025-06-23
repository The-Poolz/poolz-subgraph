import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { TotalInvested, TotalUserInvested } from "../../generated/schema"

export function updateTotalInvested(poolId: BigInt, amount: BigInt): void {
    let totalInvested = TotalInvested.load(poolId.toHex()) // id is string
    if (totalInvested == null) {
        log.critical("TotalInvested entity not found for poolId: {}", [poolId.toString()])
    } else {
        totalInvested.totalInvested = totalInvested.totalInvested.plus(amount)
        totalInvested.leftAmount = totalInvested.leftAmount.minus(amount)
        totalInvested.save()
    }
}

export function createTotalInvested(poolId: BigInt, poolAmount: BigInt): void {
    let totalInvested = new TotalInvested(poolId.toHex()) // id is string
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
        totalUserInvested.blockTimestamp = blockTimestamp
    } else {
        totalUserInvested.amount = totalUserInvested.amount.plus(amount)
    }

    totalUserInvested.save()
}
