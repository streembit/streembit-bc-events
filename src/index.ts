
'use strict';

import { BlockchainEvents, REQUESTS } from './events';
import { EventEmitter } from 'events';
import type { Block, Transaction } from 'streembit-bc-types';

const singleton = Symbol('singleton');
const singletonEnforcer = Symbol('singletonEnforcer');

class EventHandler extends EventEmitter {
    private static [singleton]: EventHandler;

    constructor(enforcer: symbol) {
        if (enforcer !== singletonEnforcer) {
            throw new Error("Cannot construct singleton");
        }

        // call the events constructor
        super();
    }

    // Type-safe emit
    override emit<K extends keyof BlockchainEvents>(
        event: K,
        ...args: Parameters<BlockchainEvents[K]>
    ): boolean {
        return super.emit(event, ...args);
    }

    // Type-safe on
    override on<K extends keyof BlockchainEvents>(
        event: K,
        listener: BlockchainEvents[K]
    ): this {
        return super.on(event, listener);
    }

    // Type-safe once
    override once<K extends keyof BlockchainEvents>(
        event: K,
        listener: BlockchainEvents[K]
    ): this {
        return super.once(event, listener);
    }

    // Type-safe off
    override off<K extends keyof BlockchainEvents>(
        event: K,
        listener: BlockchainEvents[K]
    ): this {
        return super.off(event, listener);
    }

    static get instance(): EventHandler {
        if (!this[singleton]) {
            this[singleton] = new EventHandler(singletonEnforcer);
        }
        return this[singleton];
    }
}

// Export the singleton instance
export default EventHandler.instance;

// Also export types for consumers
export { EVENTS } from './events';
export type {
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
    ContractTXValidateSigPayload,
    ContractConfigGetGenesisKeysPayload,
    GenesisPublicKeyInfo,
    ContractConfigGetGenesisPublicKeysResponse
} from './events';

export type EventName = keyof BlockchainEvents; // "network:broadcast-tx" | "network:broadcast-block"

export type EventPayloads = {
    [K in keyof BlockchainEvents]: Parameters<BlockchainEvents[K]>[0];
};

export type RequestName = (typeof REQUESTS)[keyof typeof REQUESTS];

/**
 * Per-request typed request/response payloads:
 *   Requests[K]["req"] -> request payload type
 *   Requests[K]["res"] -> response payload type
 */
export interface Requests {
    [REQUESTS.GET_BLOCK]: { req: { id: string }; res: Block | null };
    [REQUESTS.SUBMIT_TX]: { req: { tx: Transaction }; res: { ok: true; id: string } | { ok: false; error: string } };
    [REQUESTS.GET_BLOCKS_FROM]: {
        req: { startIndex: number; count: number }; // e.g. startIndex=1200, count=50
        res: { blocks: Block[]; nextStartIndex: number | null }; // null if no more
    };
}

export type RequestPayloads = { [K in keyof Requests]: Requests[K]["req"] };
export type ReplyPayloads = { [K in keyof Requests]: Requests[K]["res"] };


