import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { DispenserTokenReserve } from "../../generated/schema"

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