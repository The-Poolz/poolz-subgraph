import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  UpdateParams,
  VaultValueChanged
} from "../generated/DelayVaultProvider/DelayVaultProvider"

export function createUpdateParamsEvent(
  poolId: BigInt,
  params: Array<BigInt>
): UpdateParams {
  let updateParamsEvent = changetype<UpdateParams>(newMockEvent())

  updateParamsEvent.parameters = new Array()

  updateParamsEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  updateParamsEvent.parameters.push(
    new ethereum.EventParam(
      "params",
      ethereum.Value.fromUnsignedBigIntArray(params)
    )
  )

  return updateParamsEvent
}

export function createVaultValueChangedEvent(
  token: Address,
  owner: Address,
  amount: BigInt
): VaultValueChanged {
  let vaultValueChangedEvent = changetype<VaultValueChanged>(newMockEvent())

  vaultValueChangedEvent.parameters = new Array()

  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  vaultValueChangedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return vaultValueChangedEvent
}
