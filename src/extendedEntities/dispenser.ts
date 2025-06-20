import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { DispenserTokenReserve, Deposited, PoolData } from "../../generated/schema"

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

export function addTokenAndVaultIdToSimpleProvider(poolId: BigInt, receipt: ethereum.TransactionReceipt): void {
    let dispenserPoolId = findDispenserPoolId(receipt)
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

function findDispenserPoolId(receipt: ethereum.TransactionReceipt): BigInt | null {
    const TOKENS_DISPENSED_TOPIC = "0xf7a761394901c82f8bf72714602e89a8f2e84aa9a906eb93b4979879e392be2d"

    for (let i = 0; i < receipt.logs.length; i++) {
        let logItem = receipt.logs[i]
        if (logItem.topics.length >= 3 && logItem.topics[0].toHexString() == TOKENS_DISPENSED_TOPIC) {
            // topics[1] is bytes32, big-endian, representing the poolId padded on left
            let reversedBytes = Bytes.fromUint8Array(logItem.topics[1].reverse()) // Convert reversed Uint8Array to Bytes
            let poolIdBigInt = BigInt.fromUnsignedBytes(reversedBytes)
            return poolIdBigInt
        }
    }
    return null
}

function getDepositedEvent(hash: Bytes, logIndex: i32): Deposited | null {
    const OFFSET = 1
    return Deposited.loadInBlock(hash.concatI32(logIndex - OFFSET))
}
