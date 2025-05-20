import {
    GovernorUpdated as GovernorUpdatedEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Paused as PausedEvent,
    RedeemedTokens as RedeemedTokensEvent,
    TokenRedemptionApproval as TokenRedemptionApprovalEvent,
    TokenStatusFilter as TokenStatusFilterEvent,
    TransferIn as TransferInEvent,
    TransferOut as TransferOutEvent,
    Unpaused as UnpausedEvent,
    UpdatedMaxDelay as UpdatedMaxDelayEvent,
    UpdatedMinDelays as UpdatedMinDelaysEvent,
    VaultValueChanged as VaultValueChangedEvent,
} from "../generated/DelayVault/DelayVault"
import {
    GovernorUpdated,
    DelayVaultOwnershipTransferred,
    DelayVaultPaused,
    RedeemedTokens,
    TokenRedemptionApproval,
    TokenStatusFilter,
    DelayVaultTransferIn,
    DelayVaultTransferOut,
    DelayVaultUnpaused,
    UpdatedMaxDelay,
    UpdatedMinDelays,
    VaultValueChanged,
} from "../generated/schema"
import { updatePoolxLockedBalance } from "./extendedEntities/lockedPoolxBalance"

export function handleGovernorUpdated(event: GovernorUpdatedEvent): void {
    let entity = new GovernorUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.oldGovernor = event.params.oldGovernor
    entity.newGovernor = event.params.newGovernor

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
    let entity = new DelayVaultOwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.previousOwner = event.params.previousOwner
    entity.newOwner = event.params.newOwner

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handlePaused(event: PausedEvent): void {
    let entity = new DelayVaultPaused(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.account = event.params.account

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleRedeemedTokens(event: RedeemedTokensEvent): void {
    let entity = new RedeemedTokens(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Token = event.params.Token
    entity.Amount = event.params.Amount
    entity.RemaningAmount = event.params.RemaningAmount

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTokenRedemptionApproval(event: TokenRedemptionApprovalEvent): void {
    let entity = new TokenRedemptionApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Token = event.params.Token
    entity.User = event.params.User
    entity.Status = event.params.Status

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTokenStatusFilter(event: TokenStatusFilterEvent): void {
    let entity = new TokenStatusFilter(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Token = event.params.Token
    entity.Status = event.params.Status

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTransferIn(event: TransferInEvent): void {
    let entity = new DelayVaultTransferIn(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Amount = event.params.Amount
    entity.From = event.params.From
    entity.Token = event.params.Token

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleTransferOut(event: TransferOutEvent): void {
    let entity = new DelayVaultTransferOut(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Amount = event.params.Amount
    entity.To = event.params.To
    entity.Token = event.params.Token

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
    let entity = new DelayVaultUnpaused(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.account = event.params.account

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleUpdatedMaxDelay(event: UpdatedMaxDelayEvent): void {
    let entity = new UpdatedMaxDelay(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.OldDelay = event.params.OldDelay
    entity.NewDelay = event.params.NewDelay

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleUpdatedMinDelays(event: UpdatedMinDelaysEvent): void {
    let entity = new UpdatedMinDelays(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Token = event.params.Token
    entity.Amounts = event.params.Amounts
    entity.StartDelays = event.params.StartDelays
    entity.CliffDelays = event.params.CliffDelays
    entity.FinishDelays = event.params.FinishDelays

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
}

export function handleVaultValueChanged(event: VaultValueChangedEvent): void {
    let entity = new VaultValueChanged(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.Token = event.params.Token
    entity.Owner = event.params.Owner
    entity.Amount = event.params.Amount
    entity.StartDelay = event.params.StartDelay
    entity.CliffDelay = event.params.CliffDelay
    entity.FinishDelay = event.params.FinishDelay

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
    updatePoolxLockedBalance(event.params.Owner, event.params.Amount, event.block.timestamp)
}
