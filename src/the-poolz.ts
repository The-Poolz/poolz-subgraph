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
    InvestedTotals,
} from "../generated/schema"
import {
    loadTransferIn,
    loadTransferIn2,
    loadTransferInETH,
    loadTransferOut,
    loadTransferOutETH,
    loadTransferOutETH2,
} from "./utils/loadInBlock"

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

    addInvest(
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
    addInvest(
        event.transaction.hash,
        event.logIndex.toI32(),
        event.params.id,
        event.transaction.from,
        event.block.timestamp
    )
}

function addInvest(hash: Bytes, logIndex: i32, id: BigInt, from: Bytes, timestamp: BigInt): void {
    const transferInEth = loadTransferInETH(hash, logIndex)
    let amountIn: BigInt = BigInt.fromI32(0)
    let amountOut: BigInt = BigInt.fromI32(0)

    if (transferInEth != null) {
        amountIn = transferInEth.Amount
        const transferOutEth = loadTransferOutETH(hash, logIndex)
        if (transferOutEth != null) {
            amountOut = transferOutEth.Amount
        } else {
            const transferOutEth2 = loadTransferOutETH2(hash, logIndex)
            if (transferOutEth2 != null) {
                amountOut = transferOutEth2.StartAmount
            }
        }
    } else {
        const transferIn = loadTransferIn(hash, logIndex)
        if (transferIn != null) {
            amountIn = transferIn.Amount
        }
        let transferOut = loadTransferOut(hash, logIndex)
        if (transferOut != null) {
            amountOut = transferOut.Amount
        } else {
            const transferIn2 = loadTransferIn2(hash, logIndex)
            if (transferIn2 != null) {
                amountOut = transferIn2.Amount
            }
        }
    }

    let invested = new Invested(hash.concatI32(logIndex))
    invested.investor = from
    invested.internal_id = id
    invested.IsErc20 = transferInEth == null
    invested.timestamp = timestamp
    invested.amountIn = amountIn
    invested.amountOut = amountOut
    invested.save()
    addTotalInvestedAmount(id, from, amountIn, amountOut)
}

function addTotalInvestedAmount(id: BigInt, from: Bytes, amountIn: BigInt, amountOut: BigInt): void {
    let uniqueId = id.toString().concat("-").concat(from.toHex()) // composite ID: poolId-investor
    let uniqueIdBytes = Bytes.fromUTF8(uniqueId)
    let investedTotals = InvestedTotals.load(uniqueIdBytes)

    if (investedTotals === null) {
        investedTotals = new InvestedTotals(uniqueIdBytes)
        investedTotals.investor = from
        investedTotals.internal_id = id
        investedTotals.totalAmountIn = BigInt.fromI32(0)
        investedTotals.totalAmountOut = BigInt.fromI32(0)
    }

    investedTotals.totalAmountIn = investedTotals.totalAmountIn.plus(amountIn)
    investedTotals.totalAmountOut = investedTotals.totalAmountOut.plus(amountOut)

    investedTotals.save()
}
