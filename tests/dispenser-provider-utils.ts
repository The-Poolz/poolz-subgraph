import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  EIP712DomainChanged,
  FirewallAdminUpdated,
  FirewallUpdated,
  PoolCreated,
  TokensDispensed,
  UpdateParams
} from "../generated/DispenserProvider/DispenserProvider"

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

export function createPoolCreatedEvent(
  poolId: BigInt,
  provider: Address
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("provider", ethereum.Value.fromAddress(provider))
  )

  return poolCreatedEvent
}

export function createTokensDispensedEvent(
  poolId: BigInt,
  user: Address,
  amountTaken: BigInt,
  leftAmount: BigInt
): TokensDispensed {
  let tokensDispensedEvent = changetype<TokensDispensed>(newMockEvent())

  tokensDispensedEvent.parameters = new Array()

  tokensDispensedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  tokensDispensedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tokensDispensedEvent.parameters.push(
    new ethereum.EventParam(
      "amountTaken",
      ethereum.Value.fromUnsignedBigInt(amountTaken)
    )
  )
  tokensDispensedEvent.parameters.push(
    new ethereum.EventParam(
      "leftAmount",
      ethereum.Value.fromUnsignedBigInt(leftAmount)
    )
  )

  return tokensDispensedEvent
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
