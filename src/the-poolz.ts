import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
    NewInvestorEvent as NewInvestorEventEvent,
    NewPool as NewPoolEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Paused as PausedEvent,
    TransferIn as TransferInEvent,
    TransferInETH as TransferInETHEvent,
    TransferOut as TransferOutEvent,
    TransferOutETH as TransferOutETHEvent,
    Unpaused as UnpausedEvent,
    PoolUpdate as PoolUpdateEvent,
    FinishPool as FinishPoolEvent,
} from "../generated/ThePoolz/ThePoolz"
import {
    FinishPool,
    NewInvestorEvent,
    NewPool,
    OwnershipTransferred,
    Paused,
    PoolUpdate,
    TransferIn,
    TransferInETH,
    TransferOut,
    TransferOutETH,
    Unpaused,
    Invested,
} from "../generated/schema"

export function handleNewInvestorEvent(event: NewInvestorEventEvent): void {
    let entity = new NewInvestorEvent(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Investor_ID = event.params.Investor_ID
    entity.Investor_Address = event.params.Investor_Address
    entity.LockedDeal_ID = event.params.LockedDeal_ID

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleNewPool(event: NewPoolEvent): void {
    let entity = new NewPool(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.token = event.params.token
    entity.internal_id = event.params.id

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
    let entity = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.previousOwner = event.params.previousOwner
    entity.newOwner = event.params.newOwner

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handlePaused(event: PausedEvent): void {
    let entity = new Paused(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.account = event.params.account

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTransferIn(event: TransferInEvent): void {
    let entity = new TransferIn(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Amount = event.params.Amount
    entity.From = event.params.From
    entity.Token = event.params.Token

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTransferInETH(event: TransferInETHEvent): void {
    let entity = new TransferInETH(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Amount = event.params.Amount
    entity.From = event.params.From

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTransferOut(event: TransferOutEvent): void {
    let entity = new TransferOut(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Amount = event.params.Amount
    entity.To = event.params.To
    entity.Token = event.params.Token

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTransferOutETH(event: TransferOutETHEvent): void {
    let entity = new TransferOutETH(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Amount = event.params.Amount
    entity.To = event.params.To

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
    let entity = new Unpaused(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.account = event.params.account

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handlePoolUpdate(event: PoolUpdateEvent): void {
    let entity = new PoolUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.internal_id = event.params.id

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()

    AddInvest(
        event.transaction.hash,
        event.logIndex.toI32(),
        event.params.id,
        event.transaction.from,
        event.block.timestamp
    )
}

export function handleFinishPool(event: FinishPoolEvent): void {
    let entity = new FinishPool(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.internal_id = event.params.id

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
    AddInvest(
        event.transaction.hash,
        event.logIndex.toI32(),
        event.params.id,
        event.transaction.from,
        event.block.timestamp
    )
}

function AddInvest(hash: Bytes, logIndex: i32, id: BigInt, from: Bytes, timestamp: BigInt): void {
    const transferInEth = loadTransferInETH(hash, logIndex)

    let amount: BigInt

    if (transferInEth) {
        // found an ETH event
        amount = transferInEth.Amount
    } else {
        // fall back to ERC-20 event
        const transferIn = loadTransferIn(hash, logIndex)
        if (transferIn == null) {
            return // or handle however you like
        }
        amount = transferIn.Amount
    }

    let InvestedEntity = new Invested(hash.concatI32(logIndex))
    InvestedEntity.investor = from
    InvestedEntity.internal_id = id
    InvestedEntity.IsErc20 = transferInEth == null
    InvestedEntity.timestamp = timestamp
    InvestedEntity.amountIn = amount
    InvestedEntity.save()
}

function loadTransferInETH(hash: Bytes, logIndex: i32): TransferInETH | null {
    const OFFSETS: i32[] = [-8, -7, -5]
    for (let i = 0; i < OFFSETS.length; i++) {
        const ent = TransferInETH.loadInBlock(hash.concatI32(logIndex - OFFSETS[i]))
        if (ent != null) return ent
    }
    return null
}

function loadTransferIn(hash: Bytes, logIndex: i32): TransferIn | null {
    const OFFSETS: i32[] = [-9, -6, -5]
    for (let i = 0; i < OFFSETS.length; i++) {
        const ent = TransferIn.loadInBlock(hash.concatI32(logIndex - OFFSETS[i]))
        if (ent != null) return ent
    }
    return null
}
