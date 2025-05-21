import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Vault } from "../../generated/schema"

export function addNewVault(hash: Bytes, vaultId: BigInt, token: Bytes): void {
    let id = vaultId.toHexString()
    let vault = new Vault(id)

    vault.vaultId = vaultId
    vault.token = token
    vault.balance = BigInt.zero()
    vault.transactionHash = hash
    vault.depositStatus = true
    vault.withdrawStatus = true
    vault.royaltyReceiver = Bytes.empty() // or set to a meaningful default
    vault.royaltyFeeNumerator = BigInt.zero()

    vault.save()
}

export function increaseVaultAmount(vaultId: BigInt, amount: BigInt): void {
    let id = vaultId.toHexString()
    let vault = Vault.load(id)
    if (vault) {
        vault.balance = vault.balance.plus(amount)
        vault.save()
    }
}

export function decreaseVaultAmount(vaultId: BigInt, amount: BigInt): void {
    let id = vaultId.toHexString()
    let vault = Vault.load(id)
    if (vault && vault.balance.ge(amount)) {
        vault.balance = vault.balance.minus(amount)
        vault.save()
    }
}

export function updateVaultStatus(vaultId: BigInt, depositStatus: boolean, withdrawStatus: boolean): void {
    let id = vaultId.toHexString()
    let vault = Vault.load(id)
    if (vault) {
        vault.depositStatus = depositStatus
        vault.withdrawStatus = withdrawStatus
        vault.save()
    }
}

export function setVaultRoyalty(vaultId: BigInt, receiver: Bytes, feeNumerator: BigInt): void {
    let id = vaultId.toHexString()
    let vault = Vault.load(id)
    if (vault) {
        vault.royaltyReceiver = receiver
        vault.royaltyFeeNumerator = feeNumerator
        vault.save()
    }
}
