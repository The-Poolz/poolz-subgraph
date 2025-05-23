import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Vault } from "../../generated/schema"

export function addNewVault(vaultId: BigInt, token: Bytes): void {
    let vault = new Vault(vaultId.toHexString())

    vault.vaultId = vaultId
    vault.token = token
    vault.balance = BigInt.zero()
    vault.depositStatus = true
    vault.withdrawStatus = true
    vault.royaltyReceiver = Bytes.empty() // or set to a meaningful default
    vault.royaltyFeeNumerator = BigInt.zero()

    vault.save()
}

export function increaseVaultAmount(vaultId: BigInt, amount: BigInt): void {
    let vault = Vault.load(vaultId.toHexString())
    if (vault) {
        vault.balance = vault.balance.plus(amount)
        vault.save()
    }
}

export function decreaseVaultAmount(vaultId: BigInt, amount: BigInt): void {
    let vault = Vault.load(vaultId.toHexString())
    if (vault && vault.balance.ge(amount)) {
        vault.balance = vault.balance.minus(amount)
        vault.save()
    }
}

export function updateVaultStatus(vaultId: BigInt, depositStatus: boolean, withdrawStatus: boolean): void {
    let vault = Vault.load(vaultId.toHexString())
    if (vault) {
        vault.depositStatus = depositStatus
        vault.withdrawStatus = withdrawStatus
        vault.save()
    }
}

export function setVaultRoyalty(vaultId: BigInt, receiver: Bytes, feeNumerator: BigInt): void {
    let vault = Vault.load(vaultId.toHexString())
    if (vault) {
        vault.royaltyReceiver = receiver
        vault.royaltyFeeNumerator = feeNumerator
        vault.save()
    }
}
