import { Bytes, Entity } from "@graphprotocol/graph-ts"
import { TransferIn, TransferInETH, TransferOut } from "../../generated/schema"

export function loadTransferIn(hash: Bytes, logIndex: i32): TransferIn | null {
    const OFFSET = 5
    return TransferIn.loadInBlock(hash.concatI32(logIndex - OFFSET))
}

export function loadTransferOut(hash: Bytes, logIndex: i32): TransferOut | null {
    const OFFSET = 2
    return TransferOut.loadInBlock(hash.concatI32(logIndex - OFFSET))
}

export function loadTransferInETH(hash: Bytes, logIndex: i32): TransferInETH | null {
    const OFFSETS: i32[] = [-8, -6]
    for (let i = 0; i < OFFSETS.length; i++) {
        const ent = TransferInETH.loadInBlock(hash.concatI32(logIndex - OFFSETS[i]))
        if (ent != null) return ent
    }
    return null
}

export function loadTransferOutETH(hash: Bytes, logIndex: i32): Entity | null {
    const OFFSET = 4

    if (logIndex == 6) {
        return TransferOut.loadInBlock(hash.concatI32(logIndex - OFFSET))
    } else if (logIndex == 9) {
        return TransferIn.loadInBlock(hash.concatI32(logIndex - OFFSET))
    }

    return null
}
