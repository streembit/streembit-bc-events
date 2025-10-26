import { BlockchainEvents } from './events';
import { EventEmitter } from 'events';
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
//# sourceMappingURL=index.d.ts.map