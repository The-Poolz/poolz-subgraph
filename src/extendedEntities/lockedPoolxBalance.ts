import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { PoolxLockedBalance } from "../../generated/schema"

export function updatePoolxLockedBalance(owner: Bytes, poolxAmount: BigInt, timestamp: BigInt): void {
    let entity = PoolxLockedBalance.load(owner)
    if (entity == null) {
        entity = new PoolxLockedBalance(owner)
        entity.owner = owner
    }
    entity.amount = poolxAmount
    entity.blockTimestamp = timestamp
    entity.save()
}
