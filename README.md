# poolz-subgraph

**Subgraph for tracking key on-chain data related to Poolz Protocol's locked pools, vaults, and token dispensers.**  
Built with [**The Graph**](https://thegraph.com) to index and query data from smart contracts in a performant, structured way.

---

## 📚 Table of Contents

- [**Overview**](#-overview)
- [**Development**](#-development)
- [**Entities**](#-entities)
    - [**AllowedContract**](#allowedcontract)
    - [**Vault**](#vault)
    - [**DispenserTokenReserve**](#dispensertokenreserve)
    - [**PoolData**](#pooldata)
    - [**PoolxLockedBalance**](#poolxlockedbalance)
- [**Example Queries**](#-example-queries)
- [**License**](#license)

---

## 🌐 Overview

This subgraph indexes events and contract calls from the Poolz ecosystem, specifically focused on:

- Token locking pools
- Vaults and value tracking
- Whitelisted contract access
- Dispenser reserves for token releases

The data is made accessible via a GraphQL API that enables seamless integration with frontends, dashboards, and analytics platforms.

---

## ⚙ Development

Run codegen and build:

```bash
graph codegen && graph build
```

Deploy the subgraph:

```bash
graph deploy --product hosted-service <GITHUB_USERNAME>/<SUBGRAPH_NAME>
```

## 🧩 Entities

### AllowedContract

Tracks which contracts are allowed to interact with the system.

- `contractAddress: Bytes` — Address of the allowed contract.
- `status: Boolean` — Indicates if the contract is currently allowed.
- `blockTimestamp: BigInt` — Timestamp of the change.

### Vault

Represents a secured storage tied to specific pool mechanisms.

- `vaultId: BigInt`
- `token: Bytes` — Token held in the vault.
- `balance: BigInt` — Current token balance.
- `depositStatus: Boolean` — If deposits are currently enabled.
- `withdrawStatus: Boolean` — If withdrawals are currently enabled.
- `royaltyReceiver: Bytes` — Address receiving royalties.
- `royaltyFeeNumerator: BigInt` — Royalty fee numerator.

### DispenserTokenReserve

Tracks tokens reserved for delayed or scheduled release.

- `poolId: BigInt`
- `totalAmountTaken: BigInt` — Cumulative withdrawn amount.
- `leftAmount: BigInt` — Remaining tokens available for dispensing.

### PoolData

Core entity for locked pools.

- `poolId: BigInt`
- `owner: Bytes`
- `params: BigInt[]` — Dynamic parameters such as amount, time, etc.
- `provider: Bytes` — Associated logic provider address.
- `providerName: String` — Human-readable provider name.
- `vaultId: BigInt`
- `tokenAddress: Bytes`

### PoolxLockedBalance

Tracks the balance of tokens locked in a Poolx pool.

- `id: string`
- `poolId: BigInt`
- `amount: BigInt`

---

## 📊 Example Queries

Fetch all allowed contracts

```graphql
{
    allowedContracts {
        contractAddress
        status
        blockTimestamp
    }
}
```

Get vault details by vault ID

```graphql
{
    vault(id: "0x1234abcd...") {
        vaultId
        token
        balance
        depositStatus
        withdrawStatus
        royaltyReceiver
        royaltyFeeNumerator
    }
}
```

Fetch PoolData by pool ID

```graphql
{
    poolData(id: "0x5678efgh...") {
        poolId
        owner
        params
        provider
        providerName
        vaultId
        tokenAddress
    }
}
```

Get dispenser token reserve for a pool

```graphql
{
    dispenserTokenReserve(id: "0x9abc1234...") {
        poolId
        totalAmountTaken
        leftAmount
    }
}
```

Get locked balance for a specific Poolx pool

```graphql
{
    poolxLockedBalance(id: "some-id") {
        poolId
        amount
    }
}
```

## License

This project is licensed under the MIT License.
