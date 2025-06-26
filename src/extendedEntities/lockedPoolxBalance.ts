import { BigInt, Bytes, store, log } from "@graphprotocol/graph-ts"
import { PoolxLockedBalance, PoolxUnlocks, PoolData, TotalUnlocksAmount } from "../../generated/schema"

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

export function addUnlocksPoolx(poolId: BigInt, amount: BigInt, blockTimestamp: BigInt, unlockTimestamp: BigInt): void {
    // create new PoolxUnlocks
    let entity = new PoolxUnlocks(poolId.toHexString())
    entity.poolId = poolId
    let poolData = PoolData.load(poolId.toHexString())
    if (poolData == null) {
        log.critical("DelayVaultProvider PoolData not found for poolId: {}", [poolId.toHexString()])
    } else {
        entity.owner = poolData.owner
    }
    entity.amount = amount
    entity.createdAt = blockTimestamp // start timestamp of the unlock
    entity.unlocksAt = unlockTimestamp // after this timestamp the amount can be unlocked
    increaseTotalUnlocksAmount(amount, blockTimestamp)
    entity.save()
}

export function removeUnlocksPoolx(poolId: BigInt): void {
    // remove PoolxUnlocks
    let entity = PoolxUnlocks.load(poolId.toHexString())
    if (entity != null) {
        decreaseTotalUnlocksAmount(entity.amount, entity.unlocksAt)
        store.remove("PoolxUnlocks", poolId.toHex())
    }
}

function increaseTotalUnlocksAmount(amount: BigInt, blockTimestamp: BigInt): void {
    const id = "total"
    let entity = TotalUnlocksAmount.load(id)
    if (entity == null) {
        entity = new TotalUnlocksAmount(id)
        entity.totalUnlocksAmount = amount
        entity.blockTimestamp = blockTimestamp
    } else {
        entity.totalUnlocksAmount = entity.totalUnlocksAmount.plus(amount)
        entity.blockTimestamp = blockTimestamp
    }
    entity.save()
}

function decreaseTotalUnlocksAmount(amount: BigInt, blockTimestamp: BigInt): void {
    let entity = TotalUnlocksAmount.load("total")
    if (entity != null) {
        entity.totalUnlocksAmount = entity.totalUnlocksAmount.minus(amount)
        entity.blockTimestamp = blockTimestamp
        entity.save()
    }
}

export function isPoolxUnlocksPoolId(poolId: BigInt): boolean {
    let entity = PoolxUnlocks.load(poolId.toHexString())
    return entity != null
}
