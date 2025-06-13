import { BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"
import { DispenserTokenReserve, Deposited, PoolData, TokensDispensed } from "../../generated/schema"

export function updateDispenserTokenReserve(poolId: BigInt, amount: BigInt, leftAmount: BigInt): void {
    let reserve = DispenserTokenReserve.load(poolId.toHexString())
    if (reserve == null) {
        reserve = new DispenserTokenReserve(poolId.toHexString())
        reserve.poolId = poolId
        reserve.totalAmountTaken = BigInt.zero()
    }
    reserve.totalAmountTaken = reserve.totalAmountTaken.plus(amount)
    reserve.leftAmount = leftAmount
    reserve.save()
}

// Save the token address and vault ID for Dispenser
export function saveTokenAndVaultId(hash: Bytes, poolId: BigInt, logIndex: i32): void {
    let poolData = PoolData.load(poolId.toHexString())
    const depositedEvent = getDepositedEvent(hash, logIndex)
    if (poolData && depositedEvent) {
        poolData.tokenAddress = depositedEvent.tokenAddress
        poolData.vaultId = depositedEvent.vaultId
        poolData.save()
    }
}

export function addTokenAndVaultIdToSimpleProvider(
    hash: Bytes,
    poolId: BigInt,
    receipt: ethereum.TransactionReceipt
): void {
    let dispenserPoolId = findDispenserPoolId(hash, receipt)
    if (dispenserPoolId) {
        let dispenserPoolData = PoolData.load(dispenserPoolId.toHexString())
        let poolData = PoolData.load(poolId.toHexString())
        if (poolData && dispenserPoolData) {
            poolData.tokenAddress = dispenserPoolData.tokenAddress
            poolData.vaultId = dispenserPoolData.vaultId
            poolData.save()
        }
    }
}

function findDispenserPoolId(hash: Bytes, receipt: ethereum.TransactionReceipt): BigInt | null {
    const log = receipt.logs[receipt.logs.length - 1]
    if (
        log.topics.length > 0 &&
        log.topics[0].toHexString() == "0xf7a761394901c82f8bf72714602e89a8f2e84aa9a906eb93b4979879e392be2d"
    ) {
        // retrieve the poolId from the TokensDispensed event
        let dispensed = TokensDispensed.loadInBlock(hash.concatI32(log.logIndex.toI32()))
        if (dispensed) {
            return dispensed.poolId
        }
    }
    return null
}

function getDepositedEvent(hash: Bytes, logIndex: i32): Deposited | null {
    const OFFSET = 1
    return Deposited.loadInBlock(hash.concatI32(logIndex - OFFSET))
}
