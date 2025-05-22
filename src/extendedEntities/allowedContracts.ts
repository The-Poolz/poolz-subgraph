import { BigInt, Bytes, store } from "@graphprotocol/graph-ts"
import { AllowedContract } from "../../generated/schema"

export function updateAllowedContract(contractAddress: Bytes, status: boolean, blockTimestamp: BigInt): void {
    if (status) {
        let allowedContract = new AllowedContract(contractAddress)
        allowedContract.contractAddress = contractAddress
        allowedContract.status = status
        allowedContract.blockTimestamp = blockTimestamp
        allowedContract.save()
    } else {
        // If status is false, remove the entity from the store
        store.remove("AllowedContract", contractAddress.toHex())
    }
}
