import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { PoolData, Transfer } from "../../generated/schema"
import { VaultValueChanged as VaultValueChangedEvent } from "../../generated/DelayVaultProvider/DelayVaultProvider"

export function updateLockedPool(poolId: BigInt, owner: Bytes): void {
    // try to load the existing PoolData entity
    let poolData = PoolData.load(poolId.toHexString())
    // if it doesn't exist, create a new one
    if (poolData == null) {
        poolData = new PoolData(poolId.toHexString())
        poolData.poolId = poolId
        poolData.params = []
        poolData.provider = Bytes.fromHexString("0x")
        poolData.providerName = ""
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

export function handleDelayVaultProviderParams(event: VaultValueChangedEvent): void {
    const amount = event.params.amount
    // find the poolId from the event parameters
    const poolId = getPoolIdFromDelayVaultProviderEvent(event.transaction.hash, event.logIndex.toI32())
    // update pool params with the new amount
    updatePoolParams(poolId, [amount])
}

function getPoolIdFromDelayVaultProviderEvent(hash: Bytes, logIndex: i32): BigInt {
    const OFFSET = 5
    const transferEvent = Transfer.loadInBlock(hash.concatI32(logIndex - OFFSET))
    return transferEvent ? transferEvent.tokenId : BigInt.fromI32(0)
}

export function addProviderDataToPoolEntity(poolId: BigInt, provider: Bytes, providerName: string): void {
    let poolData = PoolData.load(poolId.toHexString())
    if (poolData) {
        poolData.provider = provider
        poolData.providerName = providerName
        poolData.save()
    }
}
