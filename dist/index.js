'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBJECTS = exports.REQUESTS = exports.REQUEST_ERROR_REASON = exports.EVENTS = void 0;
const events_1 = require("./events");
const events_2 = require("events");
const singleton = Symbol('singleton');
const singletonEnforcer = Symbol('singletonEnforcer');
class EventHandler extends events_2.EventEmitter {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw new Error("Cannot construct singleton");
        }
        // call the events constructor
        super();
    }
    // Type-safe emit
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    // Type-safe on
    on(event, listener) {
        return super.on(event, listener);
    }
    // Type-safe once
    once(event, listener) {
        return super.once(event, listener);
    }
    // Type-safe off
    off(event, listener) {
        return super.off(event, listener);
    }
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new EventHandler(singletonEnforcer);
        }
        return this[singleton];
    }
}
// Export the singleton instance
exports.default = EventHandler.instance;
// Also export types for consumers
var events_3 = require("./events");
Object.defineProperty(exports, "EVENTS", { enumerable: true, get: function () { return events_3.EVENTS; } });
exports.REQUEST_ERROR_REASON = {
    VALIDATION: 'validation',
    SYSTEM: 'system',
};
var events_4 = require("./events");
Object.defineProperty(exports, "REQUESTS", { enumerable: true, get: function () { return events_4.REQUESTS; } });
var events_5 = require("./events");
Object.defineProperty(exports, "SUBJECTS", { enumerable: true, get: function () { return events_5.SUBJECTS; } });
