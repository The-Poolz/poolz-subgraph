# poolz-subgraph

**A subgraph indexing essential on-chain data from the Poolz Protocol ecosystem.**  
Built with [**The Graph**](https://thegraph.com) to enable efficient and structured querying of smart contract events and state, supporting integration with analytics, dashboards, and frontend applications.

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

- Token locking and pool creation
- Vault tracking and value flow
- Whitelisted contract interactions
- Token reserves
- Locked balances and delayed unlocks

The data is made accessible via a GraphQL API that enables seamless integration with frontends, dashboards, and analytics platforms.

---

## ⚙ Development

Run codegen and build:

```bash
graph codegen && graph build
```

Deploy the subgraph:

```bash
graph deploy --product hosted-service <PROJECT_NAME>
```

## 🧩 Entities

### AllowedContract

Tracks which contracts are allowed to interact with the system.

```graphql
type AllowedContract @entity(immutable: false) {
    id: Bytes!
    contractAddress: Bytes!
    status: Boolean!
    blockTimestamp: BigInt!
}
```

| Field                 | Type           | Description                                      |
| --------------------- | -------------- | ------------------------------------------------ |
| **`id`**              | **`Bytes!`**   | Unique identifier of the AllowedContract entity. |
| **`contractAddress`** | **`Bytes!`**   | Address of the allowed contract.                 |
| **`status`**          | **`Boolean!`** | Indicates if the contract is currently allowed.  |
| **`blockTimestamp`**  | **`BigInt!`**  | Timestamp of the change.                         |

### Vault

Represents a secured storage tied to specific pool mechanisms.

```graphql
type Vault @entity(immutable: false) {
    id: ID!
    vaultId: BigInt!
    token: Bytes!
    balance: BigInt!
    depositStatus: Boolean!
    withdrawStatus: Boolean!
    royaltyReceiver: Bytes!
    royaltyFeeNumerator: BigInt!
}
```

| Field                     | Type           | Description                            |
| ------------------------- | -------------- | -------------------------------------- |
| **`id`**                  | **`ID!`**      | Unique identifier of the Vault entity. |
| **`vaultId`**             | **`BigInt!`**  | Vault identifier.                      |
| **`token`**               | **`Bytes!`**   | Token held in the vault.               |
| **`balance`**             | **`BigInt!`**  | Current token balance.                 |
| **`depositStatus`**       | **`Boolean!`** | If deposits are currently enabled.     |
| **`withdrawStatus`**      | **`Boolean!`** | If withdrawals are currently enabled.  |
| **`royaltyReceiver`**     | **`Bytes!`**   | Address receiving royalties.           |
| **`royaltyFeeNumerator`** | **`BigInt!`**  | Royalty fee numerator.                 |

### DispenserTokenReserve

Tracks tokens reserved for delayed or scheduled release.

```graphql
type DispenserTokenReserve @entity(immutable: false) {
    id: ID!
    poolId: BigInt!
    totalAmountTaken: BigInt!
    leftAmount: BigInt!
}
```

| Field                  | Type          | Description                         |
| ---------------------- | ------------- | ----------------------------------- |
| **`id`**               | **`ID!`**     | Unique identifier of the entity.    |
| **`poolId`**           | **`BigInt!`** | Identifier of the associated pool.  |
| **`totalAmountTaken`** | **`BigInt!`** | Cumulative amount withdrawn.        |
| **`leftAmount`**       | **`BigInt!`** | Remaining tokens available for use. |

### PoolData

Core entity for locked pools. Saves data per poolId.

```graphql
type PoolData @entity(immutable: false) {
    id: ID!
    poolId: BigInt!
    owner: Bytes!
    provider: Bytes! #
    providerName: String!
    vaultId: BigInt!
    tokenAddress: Bytes!
    params: [BigInt!]!
}
```

| Field              | Type             | Description                                   |
| ------------------ | ---------------- | --------------------------------------------- |
| **`id`**           | **`ID!`**        | Unique identifier of the PoolData entity.     |
| **`poolId`**       | **`BigInt!`**    | Identifier of the pool.                       |
| **`owner`**        | **`Bytes!`**     | Owner address of the pool.                    |
| **`provider`**     | **`Bytes!`**     | Associated logic provider address.            |
| **`providerName`** | **`String!`**    | Human-readable provider name.                 |
| **`vaultId`**      | **`BigInt!`**    | Identifier of the linked vault.               |
| **`tokenAddress`** | **`Bytes!`**     | Token address associated with the pool.       |
| **`params`**       | **`[BigInt!]!`** | Dynamic parameters such as amount, time, etc. |

### PoolxLockedBalance

Tracks the balance of tokens locked in a Poolx pool.

```
type PoolxLockedBalance @entity(immutable: false) {
  id: Bytes!
  owner: Bytes!
  delayVaultAmount: BigInt!
  delayVaultProviderAmount: BigInt!
  totalAmount: BigInt!
  blockTimestamp: BigInt!
}

```

| Field                          | Type          | Description                                         |
| ------------------------------ | ------------- | --------------------------------------------------- |
| **`id`**                       | **`Bytes!`**  | Unique identifier of the PoolxLockedBalance entity. |
| **`owner`**                    | **`Bytes!`**  | Address of the owner of the locked balance.         |
| **`delayVaultAmount`**         | **`BigInt!`** | Amount of tokens locked in the delay vault.         |
| **`delayVaultProviderAmount`** | **`BigInt!`** | Amount allocated to the delay vault provider.       |
| **`totalAmount`**              | **`BigInt!`** | Total amount of tokens locked.                      |
| **`blockTimestamp`**           | **`BigInt!`** | Timestamp when the balance was recorded or updated. |

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

Get vault details by balance

```graphql
{
    vaults(where: { balance_gt: "0" }) {
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
    poolDatas(where: { poolId: "109" }) {
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
    dispenserTokenReserves(where: { poolId: "109" }) {
        totalAmountTaken
        leftAmount
    }
}
```

Get locked balance for a specific owner address

```graphql
{
    poolxLockedBalances(where: { owner: "0x" }) {
        delayVaultAmount
        delayVaultProviderAmount
        totalAmount
        blockTimestamp
    }
}
```

## License

This project is licensed under the **MIT License**.
