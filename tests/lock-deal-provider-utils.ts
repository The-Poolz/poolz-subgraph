import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  FirewallAdminUpdated,
  FirewallUpdated,
  UpdateParams
} from "../generated/LockDealProvider/LockDealProvider"

export function createFirewallAdminUpdatedEvent(
  newAdmin: Address
): FirewallAdminUpdated {
  let firewallAdminUpdatedEvent =
    changetype<FirewallAdminUpdated>(newMockEvent())

  firewallAdminUpdatedEvent.parameters = new Array()

  firewallAdminUpdatedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return firewallAdminUpdatedEvent
}

export function createFirewallUpdatedEvent(
  newFirewall: Address
): FirewallUpdated {
  let firewallUpdatedEvent = changetype<FirewallUpdated>(newMockEvent())

  firewallUpdatedEvent.parameters = new Array()

  firewallUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFirewall",
      ethereum.Value.fromAddress(newFirewall)
    )
  )

  return firewallUpdatedEvent
}

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
