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
import { loadTransferIn, loadTransferInETH, loadTransferOut, loadTransferOutETH } from "./utils/loadInBlock"

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
    // Try ETH transfer
    const ethTransfer = loadTransferInETH(hash, logIndex)
    if (ethTransfer) {
        const ethOut = loadTransferOutETH(hash, logIndex)
        const amountOut =
            ethOut !== null && ethOut.get("Amount") !== null ? ethOut.get("Amount")!.toBigInt() : BigInt.fromI32(0)

        createInvestedEntity(hash, logIndex, id, from, timestamp, false, ethTransfer.Amount, amountOut)
        return
    }

    // Try ERC20 transfer
    const erc20Transfer = loadTransferIn(hash, logIndex)
    if (erc20Transfer) {
        const erc20Out = loadTransferOut(hash, logIndex)
        const amountOut = erc20Out ? erc20Out.Amount : BigInt.fromI32(0)

        createInvestedEntity(hash, logIndex, id, from, timestamp, true, erc20Transfer.Amount, amountOut)
    }
}

function createInvestedEntity(
    hash: Bytes,
    logIndex: i32,
    id: BigInt,
    from: Bytes,
    timestamp: BigInt,
    isErc20: boolean,
    amountIn: BigInt,
    amountOut: BigInt
): void {
    const entity = new Invested(hash.concatI32(logIndex))
    entity.investor = from
    entity.internal_id = id
    entity.IsErc20 = isErc20
    entity.timestamp = timestamp
    entity.amountIn = amountIn
    entity.amountOut = amountOut
    entity.save()
}
