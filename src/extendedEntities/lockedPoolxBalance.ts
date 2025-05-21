import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { PoolxLockedBalance } from "../../generated/schema"

export function updatePoolxLockedBalance(
    owner: Bytes,
    poolxAmount: BigInt,
    timestamp: BigInt,
    isDelayVaultV1: boolean
): void {
    let entity = PoolxLockedBalance.load(owner)
    if (entity == null) {
        entity = new PoolxLockedBalance(owner)
        entity.owner = owner
        entity.delayVaultAmount = BigInt.fromI32(0)
        entity.delayVaultProviderAmount = BigInt.fromI32(0)
    }
    if (isDelayVaultV1) {
        entity.delayVaultAmount = poolxAmount
    } else {
        entity.delayVaultProviderAmount = poolxAmount
    }
    entity.totalAmount = entity.delayVaultAmount.plus(entity.delayVaultProviderAmount)
    entity.blockTimestamp = timestamp
    entity.save()
}

export function redeemDelayVaultPoolXLockedBalance(owner: Bytes, poolxAmount: BigInt, timestamp: BigInt): void {
    let entity = PoolxLockedBalance.load(owner)
    if (entity == null) {
        return
    }
    entity.delayVaultAmount = poolxAmount
    entity.totalAmount = entity.delayVaultAmount.plus(entity.delayVaultProviderAmount)
    entity.blockTimestamp = timestamp
    entity.save()
}
