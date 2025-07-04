# poolz-subgraph

**Subgraph for tracking key on-chain data related to the Poolz Protocol ecosystem.**  
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
    - [**UniqueUsers**](#uniqueusers)
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

Install dependencies:

```bash
yarn install
```

Run codegen and build:

```bash
yarn codegen && yarn build
```

Run tests:

```bash
yarn test
# or
npx graph test -d
```

Deploy the subgraph:

```bash
graph deploy --product hosted-service <PROJECT_NAME>
```

### GitHub Actions Deployment

For automated deployments, use the GitHub Actions workflow:

1. **Setup Secrets**: Add the following secrets to your repository:
   - `GRAPH_DEPLOY_KEY_MATIC`: Deploy key for Polygon/Matic subgraphs
   - `GRAPH_DEPLOY_KEY_BASE`: Deploy key for Base network subgraphs

2. **Manual Deployment**: 
   - Go to Actions tab → "Deploy Subgraph"
   - Select chain (`matic` or `base`)
   - Enter subgraph name and version
   - Click "Run workflow"

3. **Supported Networks**:
   - **matic**: Polygon network
   - **base**: Base network

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

### UniqueUsers

Tracks unique users who have interacted with pools for the first time, preventing duplications and providing user engagement insights.

```graphql
type UniqueUsers @entity(immutable: true) {
    id: ID! # user address as string
    user: Bytes! # address
    firstPoolId: BigInt! # first pool the user interacted with
    firstInteractionTimestamp: BigInt! # timestamp of first interaction
    firstTransactionHash: Bytes! # hash of first transaction
}
```

| Field                         | Type          | Description                                    |
| ----------------------------- | ------------- | ---------------------------------------------- |
| **`id`**                      | **`ID!`**     | Unique identifier (user address as string).   |
| **`user`**                    | **`Bytes!`**  | User's wallet address.                         |
| **`firstPoolId`**             | **`BigInt!`** | ID of the first pool the user interacted with.|
| **`firstInteractionTimestamp`** | **`BigInt!`** | Timestamp of the user's first interaction.    |
| **`firstTransactionHash`**    | **`Bytes!`**  | Transaction hash of the first interaction.    |

#### Usage

The UniqueUsers entity is designed to:
- **Prevent Duplications**: Each user address is stored only once
- **Track First Interactions**: Records when and where users first engaged with the protocol
- **Support Analytics**: Provides data for user acquisition and engagement analysis

**Integration Functions:**
- `trackUniqueUser()` - Records first interaction, ignores subsequent ones
- `isExistingUser()` - Checks if user has ever interacted with pools

**Example Integration:**
```typescript
import { trackUniqueUser } from "./extendedEntities/uniqueUsersUtils"

export function handleTransfer(event: TransferEvent): void {
    // Track unique user interaction
    if (event.params.to != Address.zero()) {
        const isNewUser = trackUniqueUser(
            event.params.to,
            event.params.tokenId,
            event.block.timestamp,
            event.transaction.hash
        )
        
        if (isNewUser) {
            log.info("New user detected: {}", [event.params.to.toHexString()])
        }
    }
}
```

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

Get all unique users

```graphql
{
    uniqueUsers {
        id
        user
        firstPoolId
        firstInteractionTimestamp
        firstTransactionHash
    }
}
```

Get users who first interacted with a specific pool

```graphql
{
    uniqueUsers(where: { firstPoolId: "123" }) {
        user
        firstInteractionTimestamp
    }
}
```

## License

This project is licensed under the [MIT License](LICENSE).
