import { describe, it } from 'node:test';
import assert from 'node:assert';
import eventBus from '../src/index';
import { EventEmitter } from 'events';

describe('EventHandler Singleton', () => {
    it('should return the same instance on multiple accesses', () => {
        const instance1 = eventBus;
        const instance2 = eventBus;

        assert.strictEqual(instance1, instance2, 'Should return the same singleton instance');
    });

    it('should be an instance of EventEmitter', () => {
        assert.ok(eventBus instanceof EventEmitter, 'EventHandler should extend EventEmitter');
    });

    it('should have type-safe emit method', () => {
        assert.strictEqual(typeof eventBus.emit, 'function', 'emit method should exist');
    });

    it('should have type-safe on method', () => {
        assert.strictEqual(typeof eventBus.on, 'function', 'on method should exist');
    });

    it('should have type-safe once method', () => {
        assert.strictEqual(typeof eventBus.once, 'function', 'once method should exist');
    });

    it('should have type-safe off method', () => {
        assert.strictEqual(typeof eventBus.off, 'function', 'off method should exist');
    });

    it('should emit and receive events', (t, done) => {
        const testEvent = 'system:ready' as const;

        eventBus.once(testEvent, () => {
            assert.ok(true, 'Event listener should be called');
            done();
        });

        eventBus.emit(testEvent);
    });

    it('should pass arguments through emit/on', (t, done) => {
        const testEvent = 'system:error' as const;
        const testModule = 'test-module';
        const testError = new Error('test error');
        const testFatal = true;

        eventBus.once(testEvent, (module: string, error: Error, fatal: boolean) => {
            assert.strictEqual(module, testModule, 'Module name should match');
            assert.strictEqual(error.message, testError.message, 'Error message should match');
            assert.strictEqual(fatal, testFatal, 'Fatal flag should match');
            done();
        });

        eventBus.emit(testEvent, testModule, testError, testFatal);
    });

    it('should allow removing listeners with off', () => {
        const testEvent = 'system:metric' as const;
        const listener = (name: string, value: number, labels: Record<string, string>) => {
            assert.fail('Listener should not be called after being removed');
        };

        eventBus.on(testEvent, listener);
        eventBus.off(testEvent, listener);
        eventBus.emit(testEvent, 'test-metric', 100, { label: 'value' });

        // If we get here without the listener being called, test passes
        assert.ok(true, 'Listener was successfully removed');
    });
});
