# streembit-bc-events

A type-safe, centralized event bus for Streembit Blockchain applications. Built with TypeScript and implementing the singleton pattern, this module provides a unified event management system for blockchain components to communicate efficiently without tight coupling.

## Features

- **Type Safety**: Full TypeScript support with strict type checking for all events
- **Singleton Pattern**: Single instance across your entire application
- **Event Constants**: Predefined event names prevent typos and enable IDE autocomplete
- **Comprehensive Events**: 40+ blockchain-specific events covering consensus, networking, state management, and smart contracts
- **Standard API**: Built on Node.js EventEmitter with familiar `.on()`, `.emit()`, `.once()`, and `.off()` methods
- **Zero Configuration**: Works out of the box with no setup required

## Installation

```bash
npm install streembit-bc-events
```

## Usage

### Importing the Event Bus

The event bus is a singleton instance that is automatically initialized on first import. You can import it anywhere in your application and always receive the same instance.

```typescript
import eventBus, { EVENTS } from 'streembit-bc-events';
```

### Basic Event Emitting and Listening

#### Emitting Events

Use the `emit()` method to publish events. TypeScript will enforce the correct parameter types for each event.

```typescript
import eventBus, { EVENTS } from 'streembit-bc-events';

// Emit a block finalized event
const block = { height: 100, transactions: [...] };
const hash = '0xabc123...';
const txIds = ['tx1', 'tx2', 'tx3'];

eventBus.emit(EVENTS.BLOCK_FINALIZED, block, 100, hash, txIds);
```

#### Listening to Events

Use the `on()` method to subscribe to events. The listener callback will be invoked every time the event is emitted.

```typescript
import eventBus, { EVENTS } from 'streembit-bc-events';

// Listen for block finalization
eventBus.on(EVENTS.BLOCK_FINALIZED, (block, height, hash, txIds) => {
  console.log(`Block finalized at height ${height}`);
  console.log(`Block hash: ${hash}`);
  console.log(`Transactions: ${txIds.join(', ')}`);
});
```

TypeScript automatically infers the correct types for all parameters based on the event constant.

### Advanced Usage

#### One-Time Listeners

Use `once()` to listen for an event only once. The listener is automatically removed after the first invocation.

```typescript
eventBus.once(EVENTS.SYSTEM_READY, () => {
  console.log('System is ready - this will only fire once');
});
```

#### Removing Listeners

Use `off()` to remove a specific listener.

```typescript
const handleTransaction = (tx: object) => {
  console.log('Transaction received:', tx);
};

// Add listener
eventBus.on(EVENTS.MEMPOOL_TRANSACTION, handleTransaction);

// Later, remove the listener
eventBus.off(EVENTS.MEMPOOL_TRANSACTION, handleTransaction);
```

#### Multiple Listeners

You can register multiple listeners for the same event. They will all be invoked in the order they were registered.

```typescript
eventBus.on(EVENTS.BLOCK_FINALIZED, (block, height) => {
  console.log('Listener 1: Block finalized');
});

eventBus.on(EVENTS.BLOCK_FINALIZED, (block, height) => {
  console.log('Listener 2: Block finalized');
});
```

### Event Categories

The event bus supports the following categories of events:

#### CLI Events
```typescript
// Submit transaction for validation
eventBus.emit(EVENTS.CLI_SUBMIT_VALIDATION_REQUEST, txJson);

// Receive validation response
eventBus.on(EVENTS.CLI_VALIDATION_RESPONSE, (result) => {
  if (result.success) {
    console.log('Transaction validated:', result.txJson);
  } else {
    console.error('Validation errors:', result.errors);
  }
});
```

#### Consensus Events
```typescript
// Listen for role changes
eventBus.on(EVENTS.CONSENSUS_ROLE_CHANGED, (oldRole, newRole) => {
  console.log(`Role changed from ${oldRole} to ${newRole}`);
});

// Listen for slot progression in epoch mode
eventBus.on(EVENTS.CONSENSUS_SLOT_TICK, (slot, slotOwner) => {
  console.log(`Slot ${slot} owned by ${slotOwner}`);
});
```

#### Network Events
```typescript
// Listen for peer connections
eventBus.on(EVENTS.NETWORK_PEER_CONNECTED, (peerId, address) => {
  console.log(`Peer ${peerId} connected from ${address}`);
});

// Broadcast a transaction
eventBus.emit(EVENTS.NETWORK_BROADCAST_TX, transaction);
```

#### State Management Events
```typescript
// Listen for balance updates
eventBus.on(EVENTS.STATE_BALANCE_UPDATED, (address, asset, oldBalance, newBalance, txId) => {
  console.log(`${address} balance updated: ${oldBalance} → ${newBalance} ${asset}`);
});

// Listen for state root updates
eventBus.on(EVENTS.STATE_ROOT_UPDATED, (oldRoot, newRoot, blockHeight) => {
  console.log(`State root updated at block ${blockHeight}`);
});
```

#### Smart Contract Events
```typescript
import { randomUUID } from 'crypto';

// Request storage value
const storageRequestId = randomUUID();

eventBus.on(EVENTS.CONTRACT_STORAGE_RESPONSE, (response) => {
  if (response.requestId === storageRequestId) {
    console.log('Storage value:', response.value);
  }
});

eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, {
  requestId: storageRequestId,
  key: 'balance'
});

// Verify signature
const verifyRequestId = randomUUID();

eventBus.on(EVENTS.CONTRACT_CRYPTO_VERIFY_RESPONSE, (response) => {
  if (response.requestId === verifyRequestId) {
    console.log('Signature valid:', response.isValid);
  }
});

eventBus.emit(EVENTS.CONTRACT_CRYPTO_VERIFY, {
  requestId: verifyRequestId,
  data: 'message',
  signature: 'sig...',
  publicKey: 'pub...'
});
```

### Request/Response Pattern with Request IDs

Many events in the event bus follow a **request/response pattern** where one component makes a request and expects a response. To handle concurrent requests safely, all request/response events include a `requestId` field.

#### Why Request IDs Are Important

In a concurrent environment, multiple requests can be in-flight simultaneously. Request IDs ensure each response can be matched to its corresponding request:

```typescript
// Without request IDs (PROBLEM):
eventBus.emit('storage.get', { key: 'balance' });  // Request 1
eventBus.emit('storage.get', { key: 'name' });     // Request 2

eventBus.on('storage.response', (response) => {
  // Which request is this for? We can't tell! ❌
});

// With request IDs (SOLUTION):
const req1 = crypto.randomUUID();
const req2 = crypto.randomUUID();

eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, { requestId: req1, key: 'balance' });
eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, { requestId: req2, key: 'name' });

eventBus.on(EVENTS.CONTRACT_STORAGE_RESPONSE, (response) => {
  if (response.requestId === req1) {
    // This is the balance response ✅
  }
});
```

#### Events That Use Request IDs

The following event categories require request IDs:

**CLI Events:**
- `CLI_SUBMIT_VALIDATION_REQUEST` → `CLI_VALIDATION_RESPONSE`
- `CLI_SUBMIT_TRANSACTION` → `CLI_TRANSACTION_RESPONSE`

**Attestation Events:**
- `ATTESTATION_REQUEST` → `VALIDATOR_ATTESTATION` → `ATTESTATIONS_COMPLETE`

**Network Sync Events:**
- `NETWORK_SYNC_STARTED` → `NETWORK_SYNC_COMPLETED`

**Contract Service Events:**
- `CONTRACT_STORAGE_GET` → `CONTRACT_STORAGE_RESPONSE`
- `CONTRACT_CRYPTO_VERIFY` → `CONTRACT_CRYPTO_VERIFY_RESPONSE`
- `CONTRACT_CRYPTO_HASH` → `CONTRACT_CRYPTO_HASH_RESPONSE`
- `CONTRACT_ACCOUNT_GETBALANCE` → `CONTRACT_ACCOUNT_GETBALANCE_RESPONSE`
- `CONTRACT_MATH_DECIMAL` → `CONTRACT_MATH_DECIMAL_RESPONSE`
- `CONTRACT_MATH_ADD` → `CONTRACT_MATH_ADD_RESPONSE`
- `CONTRACT_MATH_SUBTRACT` → `CONTRACT_MATH_SUBTRACT_RESPONSE`
- `CONTRACT_MATH_COMPARE` → `CONTRACT_MATH_COMPARE_RESPONSE`
- `CONTRACT_ENCODING_TOJSON` → `CONTRACT_ENCODING_TOJSON_RESPONSE`
- `CONTRACT_TRANSACTION_VALIDATESIGNATURES` → `CONTRACT_TRANSACTION_VALIDATESIGNATURES_RESPONSE`

#### Complete Request/Response Example

```typescript
import eventBus, { EVENTS } from 'streembit-bc-events';
import { randomUUID } from 'crypto';

// Component A: Smart Contract requesting storage
const requestId = randomUUID();

// Set up response listener BEFORE making request
const responseHandler = (response: any) => {
  if (response.requestId === requestId) {
    console.log('Balance:', response.value);
    // Clean up listener after receiving response
    eventBus.off(EVENTS.CONTRACT_STORAGE_RESPONSE, responseHandler);
  }
};

eventBus.on(EVENTS.CONTRACT_STORAGE_RESPONSE, responseHandler);

// Make the request
eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, {
  requestId,
  key: 'balance'
});

// Component B: Consensus layer handling request
eventBus.on(EVENTS.CONTRACT_STORAGE_GET, (request) => {
  // Get the value from storage
  const value = storageLayer.get(request.key);

  // Send response with matching requestId
  eventBus.emit(EVENTS.CONTRACT_STORAGE_RESPONSE, {
    requestId: request.requestId,  // Must match!
    value
  });
});
```

#### Promise-Based Request/Response Helper

For cleaner async/await syntax, you can create a helper function:

```typescript
import { randomUUID } from 'crypto';
import eventBus, { EVENTS } from 'streembit-bc-events';

function requestStorage(key: string, timeoutMs = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    const requestId = randomUUID();

    const timeout = setTimeout(() => {
      eventBus.off(EVENTS.CONTRACT_STORAGE_RESPONSE, handleResponse);
      reject(new Error(`Storage request ${requestId} timed out`));
    }, timeoutMs);

    const handleResponse = (response: any) => {
      if (response.requestId === requestId) {
        clearTimeout(timeout);
        eventBus.off(EVENTS.CONTRACT_STORAGE_RESPONSE, handleResponse);
        resolve(response.value);
      }
    };

    eventBus.on(EVENTS.CONTRACT_STORAGE_RESPONSE, handleResponse);
    eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, { requestId, key });
  });
}

// Usage with async/await
async function getBalance(address: string) {
  try {
    const balance = await requestStorage(`balance_${address}`);
    console.log('Balance:', balance);
  } catch (error) {
    console.error('Failed to get balance:', error);
  }
}
```

#### CLI Request/Response Pattern

```typescript
import eventBus, { EVENTS } from 'streembit-bc-events';
import { randomUUID } from 'crypto';

// Submit transaction and wait for response
const requestId = randomUUID();

eventBus.once(EVENTS.CLI_TRANSACTION_RESPONSE, (response) => {
  if (response.requestId === requestId) {
    if (response.success) {
      console.log('Transaction submitted:', response.txId);
    } else {
      console.error('Transaction failed:', response.errors);
    }
  }
});

eventBus.emit(EVENTS.CLI_SUBMIT_TRANSACTION, {
  requestId,
  txJson: JSON.stringify(transaction)
});
```

#### Attestation Request/Response Pattern

```typescript
import eventBus, { EVENTS } from 'streembit-bc-events';
import { randomUUID } from 'crypto';

// Request attestations for a transaction
const requestId = randomUUID();
const attestations: any[] = [];

// Listen for individual validator attestations
eventBus.on(EVENTS.VALIDATOR_ATTESTATION, (response) => {
  if (response.requestId === requestId) {
    attestations.push(response);
    console.log(`Received attestation from ${response.validatorId}`);
  }
});

// Listen for attestation completion
eventBus.once(EVENTS.ATTESTATIONS_COMPLETE, (response) => {
  if (response.requestId === requestId) {
    console.log(`All attestations collected for ${response.txId}`);
    console.log(`Total attestations: ${attestations.length}`);
  }
});

// Request attestations
eventBus.emit(EVENTS.ATTESTATION_REQUEST, {
  requestId,
  tx: transaction,
  creatorId: 'creator-node-1'
});
```

### Using in Isolated Modules

One of the key advantages of this event bus is enabling communication between isolated components, such as a sandboxed smart contract environment and the main blockchain application.

#### Main Application
```typescript
// blockchain-app/src/consensus/engine.ts
import eventBus, { EVENTS } from 'streembit-bc-events';

// Listen for contract storage requests
eventBus.on(EVENTS.CONTRACT_STORAGE_GET, (request) => {
  const value = storageLayer.get(request.key);

  // Respond using the response event with matching requestId
  eventBus.emit(EVENTS.CONTRACT_STORAGE_RESPONSE, {
    requestId: request.requestId,
    value: value
  });
});

// Emit block finalized event
eventBus.emit(EVENTS.BLOCK_FINALIZED, block, height, hash, txIds);
```

#### Isolated Smart Contract Sandbox
```typescript
// blockchain-app/src/contracts/sandbox/vm.ts
import eventBus, { EVENTS } from 'streembit-bc-events';
import { randomUUID } from 'crypto';

// Same singleton instance!
// Listen for blocks
eventBus.on(EVENTS.BLOCK_FINALIZED, (block, height) => {
  console.log('Sandbox: Block finalized at height', height);
  updateContractState(block);
});

// Request storage from host using request/response pattern
const requestId = randomUUID();

eventBus.once(EVENTS.CONTRACT_STORAGE_RESPONSE, (response) => {
  if (response.requestId === requestId) {
    console.log('Contract balance:', response.value);
    // Continue contract execution with the value
  }
});

eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, {
  requestId,
  key: 'contractBalance'
});
```

### Best Practices

#### 1. Use Event Constants
Always use the `EVENTS` constants instead of string literals to prevent typos and enable IDE autocomplete.

```typescript
// ✅ Good - Type safe, autocomplete works
eventBus.emit(EVENTS.BLOCK_FINALIZED, block, height, hash, txIds);

// ❌ Bad - Prone to typos, no type checking
eventBus.emit('block:finalized', block, height, hash, txIds);
```

#### 2. Clean Up Listeners
Remove event listeners when they're no longer needed to prevent memory leaks, especially in long-running applications.

```typescript
class MyService {
  private handleBlock = (block: object) => {
    // Handle block
  };

  start() {
    eventBus.on(EVENTS.BLOCK_FINALIZED, this.handleBlock);
  }

  stop() {
    eventBus.off(EVENTS.BLOCK_FINALIZED, this.handleBlock);
  }
}
```

#### 3. Handle Errors in Listeners
Always wrap listener logic in try-catch blocks to prevent one failing listener from affecting others.

```typescript
eventBus.on(EVENTS.BLOCK_FINALIZED, (block, height, hash, txIds) => {
  try {
    processBlock(block);
  } catch (error) {
    console.error('Error processing block:', error);
    eventBus.emit(EVENTS.SYSTEM_ERROR, 'block-processor', error, false);
  }
});
```

#### 4. Use Specific Events
Emit events at the appropriate granularity. More specific events make it easier for consumers to listen only to what they need.

```typescript
//  Good - Specific events for different purposes
eventBus.emit(EVENTS.DEPOSIT_LOCKED, address, amount, blockHeight);
eventBus.emit(EVENTS.DEPOSIT_RELEASED, address, amount, blockHeight);
eventBus.emit(EVENTS.DEPOSIT_SLASHED, address, amount, reason, blockHeight);

//  Bad - Generic event requiring consumers to filter
eventBus.emit('deposit:event', { type: 'locked', address, amount, blockHeight });
```

#### 5. Always Use Request IDs for Request/Response
For any request/response pattern, always generate and use unique request IDs.

```typescript
import { randomUUID } from 'crypto';

//  Good - Unique request ID for each request
const requestId = randomUUID();  // or crypto.randomUUID() in Node 15+

eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, {
  requestId,
  key: 'balance'
});

//  Bad - Reusing request IDs or hardcoding them
eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, {
  requestId: 'storage-request',  // Same ID for all requests!
  key: 'balance'
});
```

#### 6. Set Up Response Listeners Before Emitting Requests
Always register your response listener before emitting the request to avoid race conditions.

```typescript
//  Good - Listener registered first
eventBus.on(EVENTS.CONTRACT_STORAGE_RESPONSE, handleResponse);
eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, { requestId, key });

//  Bad - Request sent before listener is ready
eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, { requestId, key });
eventBus.on(EVENTS.CONTRACT_STORAGE_RESPONSE, handleResponse);  // Might miss response!
```

## Available Events

See [src/events.ts](./src/events.ts) for the complete list of available events with detailed documentation for each event including:
- Event purpose and behavior
- Source components that emit the event
- Consumer components that listen to the event
- Parameter types and descriptions

## API Reference

### Default Export: `eventBus`

The singleton EventHandler instance.

#### Methods

##### `emit<K>(event: K, ...args): boolean`
Emit an event with type-safe parameters.

##### `on<K>(event: K, listener: Function): this`
Register a listener for an event.

##### `once<K>(event: K, listener: Function): this`
Register a one-time listener for an event.

##### `off<K>(event: K, listener: Function): this`
Remove a listener for an event.

### Named Exports

#### `EVENTS`
Object containing all event name constants.

#### `BlockchainEvents` (Type)
TypeScript type definition for all events and their signatures.

## TypeScript Support

This package is written in TypeScript and provides full type definitions. When you use the event constants, TypeScript will:

1. Autocomplete event names
2. Enforce correct parameter types when emitting
3. Infer correct parameter types in listener callbacks
4. Catch type errors at compile time

```typescript
// TypeScript knows the exact signature
eventBus.on(EVENTS.BLOCK_FINALIZED, (block, height, hash, txIds) => {
  // block: object
  // height: number
  // hash: string
  // txIds: string[]
});
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure all tests pass and add tests for new functionality.

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/streembit/streembit-bc-events/issues).