import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { AllowedContract } from "../../generated/schema"

export function updateAllowedContract(contractAddress: Bytes, status: boolean, blockTimestamp: BigInt): void {
    let allowedContract = AllowedContract.load(contractAddress)

    if (allowedContract == null) {
        allowedContract = new AllowedContract(contractAddress)
        allowedContract.contractAddress = contractAddress
    }
    allowedContract.status = status
    allowedContract.blockTimestamp = blockTimestamp
    allowedContract.save()
}
