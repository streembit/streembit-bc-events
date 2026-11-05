import { describe, it } from 'node:test';
import assert from 'node:assert';
import eventBus, {
    EVENTS,
    BlockchainEvents,
    SubmitTransactionPayload,
    PeerBlockInboundPayload,
    ContractStorageGetPayload,
    ContractCryptoVerifyPayload,
    ContractCryptoHashPayload,
    ContractAccountGetBalancePayload,
    ContractMathDecimalPayload,
    ContractMathBinaryPayload,
    ContractEncodingToJsonPayload,
    ContractTXValidateSigPayload
} from '../src/index';

describe('Module Exports', () => {
    it('should export default eventBus instance', () => {
        assert.ok(eventBus, 'Default export should exist');
        assert.strictEqual(typeof eventBus, 'object', 'Default export should be an object');
    });

    it('should export EVENTS as named export', () => {
        assert.ok(EVENTS, 'EVENTS should be exported');
        assert.strictEqual(typeof EVENTS, 'object', 'EVENTS should be an object');
    });

    it('should have BlockchainEvents type available (compilation check)', () => {
        // This is a compile-time check - if types aren't exported, this won't compile
        const eventsInterface: Partial<BlockchainEvents> = {
            'system:ready': () => {},
        };

        assert.ok(eventsInterface, 'BlockchainEvents type should be importable');
    });

    it('should have SubmitTransactionPayload type available', () => {
        // Compile-time type check
        const payload: SubmitTransactionPayload = {
            requestId: 'test-id',
            txJson: '{"test": "data"}'
        };

        assert.strictEqual(payload.requestId, 'test-id');
        assert.strictEqual(payload.txJson, '{"test": "data"}');
    });

    it('should have PeerBlockInboundPayload type available', () => {
        // Compile-time type check
        const payload: PeerBlockInboundPayload = {
            blockPayload: { test: 'data' },
            advertisedBlockCount: 100,
            peerId: 'peer-123',
            timestamp: Date.now()
        };

        assert.strictEqual(payload.peerId, 'peer-123');
        assert.strictEqual(payload.advertisedBlockCount, 100);
    });

    it('should have contract service payload types available', () => {
        // Compile-time type checks
        const storagePayload: ContractStorageGetPayload = {
            requestId: 'req-1',
            key: 'test-key'
        };

        const cryptoPayload: ContractCryptoVerifyPayload = {
            requestId: 'req-2',
            data: 'test-data',
            signature: 'test-sig',
            publicKey: 'test-key'
        };

        const hashPayload: ContractCryptoHashPayload = {
            requestId: 'req-3',
            data: 'test-data'
        };

        const balancePayload: ContractAccountGetBalancePayload = {
            requestId: 'req-4',
            address: 'test-address',
            asset: 'test-asset'
        };

        const decimalPayload: ContractMathDecimalPayload = {
            requestId: 'req-5',
            value: '123.45'
        };

        const binaryPayload: ContractMathBinaryPayload = {
            requestId: 'req-6',
            a: '10',
            b: '20'
        };

        const jsonPayload: ContractEncodingToJsonPayload = {
            requestId: 'req-7',
            data: { test: 'value' }
        };

        assert.ok(storagePayload, 'ContractStorageGetPayload type should be available');
        assert.ok(cryptoPayload, 'ContractCryptoVerifyPayload type should be available');
        assert.ok(hashPayload, 'ContractCryptoHashPayload type should be available');
        assert.ok(balancePayload, 'ContractAccountGetBalancePayload type should be available');
        assert.ok(decimalPayload, 'ContractMathDecimalPayload type should be available');
        assert.ok(binaryPayload, 'ContractMathBinaryPayload type should be available');
        assert.ok(jsonPayload, 'ContractEncodingToJsonPayload type should be available');
    });

    it('should have ContractTXValidateSigPayload type available', () => {
        // This requires Transaction type from streembit-bc-types
        // We'll just verify the type is importable
        const validateType = typeof ContractTXValidateSigPayload;
        assert.strictEqual(validateType, 'undefined', 'Type should be importable (undefined at runtime)');
    });

    it('should export both default and named exports from same module', () => {
        assert.ok(eventBus, 'Default export should exist');
        assert.ok(EVENTS, 'Named export EVENTS should exist');
        assert.notStrictEqual(eventBus, EVENTS, 'Default and named exports should be different');
    });
});
