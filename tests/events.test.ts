import { describe, it } from 'node:test';
import assert from 'node:assert';
import { EVENTS } from '../src/index';

describe('EVENTS Constants', () => {
    it('should export EVENTS object', () => {
        assert.ok(EVENTS, 'EVENTS object should be exported');
        assert.strictEqual(typeof EVENTS, 'object', 'EVENTS should be an object');
    });

    it('should contain CLI event constants', () => {
        assert.strictEqual(EVENTS.TRANSACTION_SUBMIT, 'tx:submit-transaction');
        assert.strictEqual(EVENTS.TRANSACTION_RESPONSE, 'tx:transaction-response');
        assert.strictEqual(EVENTS.TRANSACTION_SUBMIT_VALIDATION_REQUEST, 'tx:submit-validation-request');
        assert.strictEqual(EVENTS.TRANSACTION_VALIDATION_RESPONSE, 'tx:validation-response');
    });

    it('should contain mempool event constants', () => {
        assert.strictEqual(EVENTS.MEMPOOL_TRANSACTION, 'mempool:transaction');
        assert.strictEqual(EVENTS.MEMPOOL_RETURN, 'mempool:return');
        assert.strictEqual(EVENTS.TX_REJECTED, 'tx:rejected');
        assert.strictEqual(EVENTS.TX_REMOVED, 'tx:removed');
    });

    it('should contain consensus event constants', () => {
        assert.strictEqual(EVENTS.CONSENSUS_ROLE_CHANGED, 'consensus:role-changed');
        assert.strictEqual(EVENTS.CONSENSUS_SLOT_TICK, 'consensus:slot-tick');
        assert.strictEqual(EVENTS.SCHEDULE_CHANGE, 'schedule:change');
    });

    it('should contain block event constants', () => {
        assert.strictEqual(EVENTS.BLOCK_FINALIZED, 'block:finalized');
        assert.strictEqual(EVENTS.NETWORK_BLOCK_RECEIVED, 'network:block-received');
        assert.strictEqual(EVENTS.BLOCK_PROPAGATE, 'block:propagate');
        assert.strictEqual(EVENTS.PEER_BLOCK, 'peer:block');
        assert.strictEqual(EVENTS.BLOCK_REORG, 'block:reorg');
    });

    it('should contain system event constants', () => {
        assert.strictEqual(EVENTS.SYSTEM_READY, 'system:ready');
        assert.strictEqual(EVENTS.SYSTEM_SHUTDOWN, 'system:shutdown');
        assert.strictEqual(EVENTS.SYSTEM_ERROR, 'system:error');
        assert.strictEqual(EVENTS.SYSTEM_METRIC, 'system:metric');
    });

    it('should contain contract service event constants', () => {
        assert.strictEqual(EVENTS.CONTRACT_STORAGE_GET, 'contract:storage.get');
        assert.strictEqual(EVENTS.CONTRACT_CRYPTO_VERIFY, 'contract:crypto.verify');
        assert.strictEqual(EVENTS.CONTRACT_CRYPTO_HASH, 'contract:crypto.hash');
        assert.strictEqual(EVENTS.CONTRACT_ACCOUNT_GETBALANCE, 'contract:account.getBalance');
    });

    it('should contain network event constants', () => {
        assert.strictEqual(EVENTS.NETWORK_BROADCAST_TX, 'network:broadcast-tx');
        assert.strictEqual(EVENTS.NETWORK_BROADCAST_BLOCK, 'network:broadcast-block');
        assert.strictEqual(EVENTS.NETWORK_PEER_CONNECTED, 'network:peer-connected');
        assert.strictEqual(EVENTS.NETWORK_PEER_DISCONNECTED, 'network:peer-disconnected');
        assert.strictEqual(EVENTS.NETWORK_SYNC_STARTED, 'network:sync-started');
        assert.strictEqual(EVENTS.NETWORK_SYNC_COMPLETED, 'network:sync-completed');
    });

    it('should have string values for all constants', () => {
        const eventValues = Object.values(EVENTS);

        assert.ok(eventValues.length > 0, 'EVENTS should have at least one constant');

        eventValues.forEach((value) => {
            assert.strictEqual(typeof value, 'string', `Event value should be a string: ${value}`);
            assert.ok(value.length > 0, `Event value should not be empty: ${value}`);
        });
    });

    it('should have unique event names', () => {
        const eventValues = Object.values(EVENTS);
        const uniqueValues = new Set(eventValues);

        assert.strictEqual(
            eventValues.length,
            uniqueValues.size,
            'All event names should be unique'
        );
    });

    it('should follow naming convention (category:action)', () => {
        const eventValues = Object.values(EVENTS);

        eventValues.forEach((value) => {
            assert.ok(
                value.includes(':'),
                `Event name should follow category:action convention: ${value}`
            );
        });
    });
});
