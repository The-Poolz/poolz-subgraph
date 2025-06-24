import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  EIP712DomainChanged,
  FirewallAdminUpdated,
  FirewallUpdated,
  Invested,
  NewPoolCreated,
  UpdateParams
} from "../generated/InvestProvider/InvestProvider"

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

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

export function createInvestedEvent(
  poolId: BigInt,
  user: Address,
  amount: BigInt,
  newNonce: BigInt
): Invested {
  let investedEvent = changetype<Invested>(newMockEvent())

  investedEvent.parameters = new Array()

  investedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  investedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  investedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  investedEvent.parameters.push(
    new ethereum.EventParam(
      "newNonce",
      ethereum.Value.fromUnsignedBigInt(newNonce)
    )
  )

  return investedEvent
}

export function createNewPoolCreatedEvent(
  poolId: BigInt,
  owner: Address,
  poolAmount: BigInt
): NewPoolCreated {
  let newPoolCreatedEvent = changetype<NewPoolCreated>(newMockEvent())

  newPoolCreatedEvent.parameters = new Array()

  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  newPoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "poolAmount",
      ethereum.Value.fromUnsignedBigInt(poolAmount)
    )
  )

  return newPoolCreatedEvent
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
