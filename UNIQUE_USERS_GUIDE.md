# UniqueUsers Implementation Guide

## Overview

The `UniqueUsers` entity tracks unique users who interact with pools for the first time, preventing duplications and providing insights into user engagement.

## Schema Entity

```graphql
type UniqueUsers @entity(immutable: true) {
    id: ID! # user address as string
    user: Bytes! # address
    firstPoolId: BigInt! # first pool the user interacted with
    firstInteractionTimestamp: BigInt! # timestamp of first interaction
    firstTransactionHash: Bytes! # hash of first transaction
}
```

## Setup Instructions

### 1. Regenerate Schema Types

After adding the UniqueUsers entity to `schema.graphql`, run:

```bash
yarn codegen
```

### 2. Uncomment Import Statements

In `src/extendedEntities/poolData.ts`, uncomment:

```typescript
import { trackUniqueUser } from "./uniqueUsersUtils"
```

### 3. Uncomment Tracking Calls

In `src/extendedEntities/poolData.ts`, uncomment the tracking calls in:

- `updateLockedPool()`
- `updatePoolParamsWithUser()`

## Usage Examples

### Example 1: Tracking in Transfer Events

```typescript
// In lock-deal-nft.ts or similar transfer handler
export function handleTransfer(event: TransferEvent): void {
    // ... existing transfer logic ...

    // Track unique user interaction
    if (event.params.to != Address.zero()) {
        trackUniqueUser(
            event.params.to,
            event.params.tokenId, // assuming tokenId represents poolId
            event.block.timestamp,
            event.transaction.hash
        )
    }
}
```

### Example 3: Manual User Tracking

```typescript
// In any event handler where you want to track user interaction
import { trackUniqueUser, isExistingUser } from "./extendedEntities/uniqueUsersUtils"

export function handleUserInteraction(event: SomeEvent): void {
    const userAddress = event.params.user
    const poolId = event.params.poolId

    // Check if user is new or existing
    const isNewUser = trackUniqueUser(userAddress, poolId, event.block.timestamp, event.transaction.hash)

    if (isNewUser) {
        // This is the user's first interaction with any pool
        log.info("New user detected: {}", [userAddress.toHexString()])
    }
}
```

## Utility Functions

### trackUniqueUser()

- **Purpose**: Tracks a user's interaction with a pool
- **Returns**: `boolean` - `true` if new user, `false` if existing user
- **Side Effects**: Creates new UniqueUsers entity or updates existing one

## Integration Points

### Key Places to Add User Tracking:

1. **Transfer Events** (`lock-deal-nft.ts`)

    - When NFTs (representing pool ownership) are transferred
    - Track both `from` and `to` addresses

2. **Pool Creation Events**

    - When new pools are created, track the creator

3. **Investment/Deposit Events**

    - When users invest in or deposit to pools

4. **Withdrawal/Claim Events**

    - When users withdraw from or claim rewards from pools

5. **Pool Parameter Updates**
    - When pool owners modify pool settings

## Benefits

1. **No Duplications**: Each user address is only stored once in UniqueUsers
2. **First Interaction Tracking**: Know exactly when and how each user first engaged
3. **Engagement Metrics**: Track how many different pools each user has interacted with
4. **Analytics Ready**: Data structure optimized for user behavior analysis

## Example Queries

Once implemented, you can query:

```graphql
# Get all unique users
{
    uniqueUsers {
        id
        user
        firstPoolId
        firstInteractionTimestamp
    }
}

# Get users who first interacted with a specific pool
{
    uniqueUsers(where: { firstPoolId: "123" }) {
        user
        firstInteractionTimestamp
    }
}

# Get most active users (by pool interactions)
{
    uniqueUsers(orderBy: totalPoolsInteracted, orderDirection: desc, first: 10) {
        user
    }
}
```
