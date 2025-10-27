import { BlockchainEvents, REQUESTS } from './events';
import { EventEmitter } from 'events';
import type { Block, Transaction } from 'streembit-bc-types';
declare const singleton: unique symbol;
declare class EventHandler extends EventEmitter {
    private static [singleton];
    constructor(enforcer: symbol);
    emit<K extends keyof BlockchainEvents>(event: K, ...args: Parameters<BlockchainEvents[K]>): boolean;
    on<K extends keyof BlockchainEvents>(event: K, listener: BlockchainEvents[K]): this;
    once<K extends keyof BlockchainEvents>(event: K, listener: BlockchainEvents[K]): this;
    off<K extends keyof BlockchainEvents>(event: K, listener: BlockchainEvents[K]): this;
    static get instance(): EventHandler;
}
declare const _default: EventHandler;
export default _default;
export { EVENTS } from './events';
export type { BlockchainEvents, SubmitTransactionPayload, PeerBlockInboundPayload, ContractStorageGetPayload, ContractCryptoVerifyPayload, ContractCryptoHashPayload, ContractAccountGetBalancePayload, ContractMathDecimalPayload, ContractMathBinaryPayload, ContractEncodingToJsonPayload, ContractTXValidateSigPayload, ContractConfigGetGenesisKeysPayload, GenesisPublicKeyInfo, ContractConfigGetGenesisPublicKeysResponse } from './events';
export type EventName = keyof BlockchainEvents;
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
    [REQUESTS.GET_BLOCK]: {
        req: {
            id: string;
        };
        res: Block | null;
    };
    [REQUESTS.SUBMIT_TX]: {
        req: {
            tx: Transaction;
        };
        res: {
            ok: true;
            id: string;
        } | {
            ok: false;
            error: string;
        };
    };
    [REQUESTS.GET_BLOCKS_FROM]: {
        req: {
            startIndex: number;
            count: number;
        };
        res: {
            blocks: Block[];
            nextStartIndex: number | null;
        };
    };
}
export type RequestPayloads = {
    [K in keyof Requests]: Requests[K]["req"];
};
export type ReplyPayloads = {
    [K in keyof Requests]: Requests[K]["res"];
};
export { REQUESTS } from './events';
//# sourceMappingURL=index.d.ts.map