
'use strict';

import { BlockchainEvents } from './src/events';
import { EventEmitter } from 'events';

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
export { EVENTS } from './src/events';
export type { BlockchainEvents } from './src/events';



