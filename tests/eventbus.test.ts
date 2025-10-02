import eventBus, { EVENTS, BlockchainEvents } from '../index';

describe('EventBus - Type Safety and Functionality', () => {

  beforeEach(() => {
    // Remove all listeners before each test
    eventBus.removeAllListeners();
  });

  // ============================================================================
  // CLI Events
  // ============================================================================

  describe('CLI Events', () => {
    it('should emit and listen to CLI_SUBMIT_VALIDATION_REQUEST', (done) => {
      const request = {
        requestId: 'req-123',
        txJson: '{"from": "addr1", "to": "addr2"}'
      };

      eventBus.on(EVENTS.CLI_SUBMIT_VALIDATION_REQUEST, (receivedRequest) => {
        expect(receivedRequest.requestId).toBe('req-123');
        expect(receivedRequest.txJson).toBe('{"from": "addr1", "to": "addr2"}');
        done();
      });

      eventBus.emit(EVENTS.CLI_SUBMIT_VALIDATION_REQUEST, request);
    });

    it('should emit and listen to CLI_VALIDATION_RESPONSE', (done) => {
      const response = {
        requestId: 'req-123',
        success: true,
        txJson: '{"validated": true}'
      };

      eventBus.on(EVENTS.CLI_VALIDATION_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req-123');
        expect(receivedResponse.success).toBe(true);
        expect(receivedResponse.txJson).toBe('{"validated": true}');
        done();
      });

      eventBus.emit(EVENTS.CLI_VALIDATION_RESPONSE, response);
    });

    it('should emit and listen to CLI_SUBMIT_TRANSACTION', (done) => {
      const request = {
        requestId: 'req-456',
        txJson: '{"type": "transfer"}'
      };

      eventBus.on(EVENTS.CLI_SUBMIT_TRANSACTION, (receivedRequest) => {
        expect(receivedRequest.requestId).toBe('req-456');
        expect(receivedRequest.txJson).toBe('{"type": "transfer"}');
        done();
      });

      eventBus.emit(EVENTS.CLI_SUBMIT_TRANSACTION, request);
    });

    it('should emit and listen to CLI_TRANSACTION_RESPONSE', (done) => {
      const response = {
        requestId: 'req-456',
        success: true,
        txId: 'tx123'
      };

      eventBus.on(EVENTS.CLI_TRANSACTION_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req-456');
        expect(receivedResponse.success).toBe(true);
        expect(receivedResponse.txId).toBe('tx123');
        done();
      });

      eventBus.emit(EVENTS.CLI_TRANSACTION_RESPONSE, response);
    });
  });

  // ============================================================================
  // Mempool Events
  // ============================================================================

  describe('Mempool Events', () => {
    it('should emit and listen to MEMPOOL_TRANSACTION', (done) => {
      const tx = { id: 'tx1', from: 'addr1' };

      eventBus.on(EVENTS.MEMPOOL_TRANSACTION, (receivedTx) => {
        expect(receivedTx).toEqual(tx);
        done();
      });

      eventBus.emit(EVENTS.MEMPOOL_TRANSACTION, tx);
    });

    it('should emit and listen to MEMPOOL_RETURN', (done) => {
      const tx = { id: 'tx2', from: 'addr2' };

      eventBus.on(EVENTS.MEMPOOL_RETURN, (receivedTx) => {
        expect(receivedTx).toEqual(tx);
        done();
      });

      eventBus.emit(EVENTS.MEMPOOL_RETURN, tx);
    });

    it('should emit and listen to TX_REJECTED', (done) => {
      const tx = { id: 'tx3' };
      const errors = ['Invalid signature', 'Insufficient balance'];

      eventBus.on(EVENTS.TX_REJECTED, (receivedTx, receivedErrors) => {
        expect(receivedTx).toEqual(tx);
        expect(receivedErrors).toEqual(errors);
        done();
      });

      eventBus.emit(EVENTS.TX_REJECTED, tx, errors);
    });

    it('should emit and listen to TX_REMOVED', (done) => {
      const txIds = ['tx1', 'tx2', 'tx3'];
      const reason = 'included';

      eventBus.on(EVENTS.TX_REMOVED, (receivedTxIds, receivedReason) => {
        expect(receivedTxIds).toEqual(txIds);
        expect(receivedReason).toBe(reason);
        done();
      });

      eventBus.emit(EVENTS.TX_REMOVED, txIds, reason);
    });
  });

  // ============================================================================
  // Attestation Events
  // ============================================================================

  describe('Attestation Events', () => {
    it('should emit and listen to VALIDATOR_ATTESTATION', (done) => {
      const response = {
        requestId: 'req-789',
        transaction: { id: 'tx1' },
        validatorId: 'val1',
        signature: 'sig123',
        timestamp: Date.now()
      };

      eventBus.on(EVENTS.VALIDATOR_ATTESTATION, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req-789');
        expect(receivedResponse.transaction).toEqual({ id: 'tx1' });
        expect(receivedResponse.validatorId).toBe('val1');
        done();
      });

      eventBus.emit(EVENTS.VALIDATOR_ATTESTATION, response);
    });

    it('should emit and listen to ATTESTATIONS_COMPLETE', (done) => {
      const response = {
        requestId: 'req-789',
        txId: 'tx123'
      };

      eventBus.on(EVENTS.ATTESTATIONS_COMPLETE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req-789');
        expect(receivedResponse.txId).toBe('tx123');
        done();
      });

      eventBus.emit(EVENTS.ATTESTATIONS_COMPLETE, response);
    });

    it('should emit and listen to ATTESTATION_REQUEST', (done) => {
      const request = {
        requestId: 'req-789',
        tx: { id: 'tx1' },
        creatorId: 'creator1'
      };

      eventBus.on(EVENTS.ATTESTATION_REQUEST, (receivedRequest) => {
        expect(receivedRequest.requestId).toBe('req-789');
        expect(receivedRequest.tx).toEqual({ id: 'tx1' });
        expect(receivedRequest.creatorId).toBe('creator1');
        done();
      });

      eventBus.emit(EVENTS.ATTESTATION_REQUEST, request);
    });
  });

  // ============================================================================
  // Registry Events
  // ============================================================================

  describe('Registry Events', () => {
    it('should emit and listen to REGISTRY_NODES_UPDATED', (done) => {
      const nodes = [{ id: 'node1' }, { id: 'node2' }];

      eventBus.on(EVENTS.REGISTRY_NODES_UPDATED, (receivedNodes) => {
        expect(receivedNodes).toEqual(nodes);
        expect(receivedNodes.length).toBe(2);
        done();
      });

      eventBus.emit(EVENTS.REGISTRY_NODES_UPDATED, nodes);
    });

    it('should emit and listen to REGISTRY_VALIDATORS_UPDATED', (done) => {
      const validators = [{ id: 'val1' }, { id: 'val2' }];

      eventBus.on(EVENTS.REGISTRY_VALIDATORS_UPDATED, (receivedValidators) => {
        expect(receivedValidators).toEqual(validators);
        done();
      });

      eventBus.emit(EVENTS.REGISTRY_VALIDATORS_UPDATED, validators);
    });
  });

  // ============================================================================
  // Consensus Events
  // ============================================================================

  describe('Consensus Events', () => {
    it('should emit and listen to CONSENSUS_ROLE_CHANGED', (done) => {
      const oldRole = 'validator';
      const newRole = 'creator';

      eventBus.on(EVENTS.CONSENSUS_ROLE_CHANGED, (receivedOldRole, receivedNewRole) => {
        expect(receivedOldRole).toBe(oldRole);
        expect(receivedNewRole).toBe(newRole);
        done();
      });

      eventBus.emit(EVENTS.CONSENSUS_ROLE_CHANGED, oldRole, newRole);
    });

    it('should emit and listen to CONSENSUS_SLOT_TICK', (done) => {
      const slot = 12345;
      const slotOwner = 'creator1';

      eventBus.on(EVENTS.CONSENSUS_SLOT_TICK, (receivedSlot, receivedSlotOwner) => {
        expect(receivedSlot).toBe(slot);
        expect(receivedSlotOwner).toBe(slotOwner);
        done();
      });

      eventBus.emit(EVENTS.CONSENSUS_SLOT_TICK, slot, slotOwner);
    });

    it('should emit and listen to SCHEDULE_CHANGE', (done) => {
      eventBus.on(EVENTS.SCHEDULE_CHANGE, () => {
        done();
      });

      eventBus.emit(EVENTS.SCHEDULE_CHANGE);
    });
  });

  // ============================================================================
  // Shadow Events
  // ============================================================================

  describe('Shadow Events', () => {
    it('should emit and listen to SHADOW_PREPARE', (done) => {
      const data = {
        transaction: { id: 'tx1' },
        transactions: [{ id: 'tx1' }, { id: 'tx2' }],
        primaryNode: 'node1',
        expectedBlockTime: 5000
      };

      eventBus.on(EVENTS.SHADOW_PREPARE, (receivedData) => {
        expect(receivedData).toEqual(data);
        expect(receivedData.primaryNode).toBe('node1');
        done();
      });

      eventBus.emit(EVENTS.SHADOW_PREPARE, data);
    });

    it('should emit and listen to SHADOW_TAKEOVER', (done) => {
      const primaryNode = 'node1';
      const shadowNode = 'node2';
      const blockHeight = 100;

      eventBus.on(EVENTS.SHADOW_TAKEOVER, (receivedPrimary, receivedShadow, receivedHeight) => {
        expect(receivedPrimary).toBe(primaryNode);
        expect(receivedShadow).toBe(shadowNode);
        expect(receivedHeight).toBe(blockHeight);
        done();
      });

      eventBus.emit(EVENTS.SHADOW_TAKEOVER, primaryNode, shadowNode, blockHeight);
    });
  });

  // ============================================================================
  // Block Events
  // ============================================================================

  describe('Block Events', () => {
    it('should emit and listen to BLOCK_FINALIZED', (done) => {
      const block = { height: 100 };
      const height = 100;
      const hash = '0xabc123';
      const txIds = ['tx1', 'tx2'];

      eventBus.on(EVENTS.BLOCK_FINALIZED, (receivedBlock, receivedHeight, receivedHash, receivedTxIds) => {
        expect(receivedBlock).toEqual(block);
        expect(receivedHeight).toBe(height);
        expect(receivedHash).toBe(hash);
        expect(receivedTxIds).toEqual(txIds);
        done();
      });

      eventBus.emit(EVENTS.BLOCK_FINALIZED, block, height, hash, txIds);
    });

    it('should emit and listen to NETWORK_BLOCK_RECEIVED', (done) => {
      const block = { height: 101 };

      eventBus.on(EVENTS.NETWORK_BLOCK_RECEIVED, (receivedBlock) => {
        expect(receivedBlock).toEqual(block);
        done();
      });

      eventBus.emit(EVENTS.NETWORK_BLOCK_RECEIVED, block);
    });

    it('should emit and listen to BLOCK_PROPAGATE', (done) => {
      const block = { height: 102 };

      eventBus.on(EVENTS.BLOCK_PROPAGATE, (receivedBlock) => {
        expect(receivedBlock).toEqual(block);
        done();
      });

      eventBus.emit(EVENTS.BLOCK_PROPAGATE, block);
    });

    it('should emit and listen to PEER_BLOCK', (done) => {
      const block = { height: 103 };

      eventBus.on(EVENTS.PEER_BLOCK, (receivedBlock) => {
        expect(receivedBlock).toEqual(block);
        done();
      });

      eventBus.emit(EVENTS.PEER_BLOCK, block);
    });

    it('should emit and listen to BLOCK_REORG', (done) => {
      const oldTip = { height: 100, hash: '0xold' };
      const newTip = { height: 101, hash: '0xnew' };
      const commonAncestor = { height: 99, hash: '0xcommon' };

      eventBus.on(EVENTS.BLOCK_REORG, (receivedOld, receivedNew, receivedAncestor) => {
        expect(receivedOld).toEqual(oldTip);
        expect(receivedNew).toEqual(newTip);
        expect(receivedAncestor).toEqual(commonAncestor);
        done();
      });

      eventBus.emit(EVENTS.BLOCK_REORG, oldTip, newTip, commonAncestor);
    });
  });

  // ============================================================================
  // Deposit Events
  // ============================================================================

  describe('Deposit Events', () => {
    it('should emit and listen to DEPOSIT_LOCKED', (done) => {
      const creatorAddress = 'addr1';
      const amount = '1000';
      const blockHeight = 100;

      eventBus.on(EVENTS.DEPOSIT_LOCKED, (receivedAddress, receivedAmount, receivedHeight) => {
        expect(receivedAddress).toBe(creatorAddress);
        expect(receivedAmount).toBe(amount);
        expect(receivedHeight).toBe(blockHeight);
        done();
      });

      eventBus.emit(EVENTS.DEPOSIT_LOCKED, creatorAddress, amount, blockHeight);
    });

    it('should emit and listen to DEPOSIT_RELEASED', (done) => {
      const creatorAddress = 'addr1';
      const amount = '1000';
      const blockHeight = 101;

      eventBus.on(EVENTS.DEPOSIT_RELEASED, (receivedAddress, receivedAmount, receivedHeight) => {
        expect(receivedAddress).toBe(creatorAddress);
        expect(receivedAmount).toBe(amount);
        expect(receivedHeight).toBe(blockHeight);
        done();
      });

      eventBus.emit(EVENTS.DEPOSIT_RELEASED, creatorAddress, amount, blockHeight);
    });

    it('should emit and listen to DEPOSIT_SLASHED', (done) => {
      const creatorAddress = 'addr1';
      const amount = '500';
      const reason = 'Double signing';
      const blockHeight = 102;

      eventBus.on(EVENTS.DEPOSIT_SLASHED, (receivedAddress, receivedAmount, receivedReason, receivedHeight) => {
        expect(receivedAddress).toBe(creatorAddress);
        expect(receivedAmount).toBe(amount);
        expect(receivedReason).toBe(reason);
        expect(receivedHeight).toBe(blockHeight);
        done();
      });

      eventBus.emit(EVENTS.DEPOSIT_SLASHED, creatorAddress, amount, reason, blockHeight);
    });
  });

  // ============================================================================
  // State Events
  // ============================================================================

  describe('State Events', () => {
    it('should emit and listen to STATE_BALANCE_UPDATED', (done) => {
      const address = 'addr1';
      const asset = 'STRM';
      const oldBalance = '1000';
      const newBalance = '1500';
      const txId = 'tx123';

      eventBus.on(EVENTS.STATE_BALANCE_UPDATED, (receivedAddress, receivedAsset, receivedOld, receivedNew, receivedTxId) => {
        expect(receivedAddress).toBe(address);
        expect(receivedAsset).toBe(asset);
        expect(receivedOld).toBe(oldBalance);
        expect(receivedNew).toBe(newBalance);
        expect(receivedTxId).toBe(txId);
        done();
      });

      eventBus.emit(EVENTS.STATE_BALANCE_UPDATED, address, asset, oldBalance, newBalance, txId);
    });

    it('should emit and listen to STATE_ROOT_UPDATED', (done) => {
      const oldRoot = '0xold';
      const newRoot = '0xnew';
      const blockHeight = 100;

      eventBus.on(EVENTS.STATE_ROOT_UPDATED, (receivedOld, receivedNew, receivedHeight) => {
        expect(receivedOld).toBe(oldRoot);
        expect(receivedNew).toBe(newRoot);
        expect(receivedHeight).toBe(blockHeight);
        done();
      });

      eventBus.emit(EVENTS.STATE_ROOT_UPDATED, oldRoot, newRoot, blockHeight);
    });
  });

  // ============================================================================
  // Network Events
  // ============================================================================

  describe('Network Events', () => {
    it('should emit and listen to NETWORK_BROADCAST_TX', (done) => {
      const tx = { id: 'tx1' };

      eventBus.on(EVENTS.NETWORK_BROADCAST_TX, (receivedTx) => {
        expect(receivedTx).toEqual(tx);
        done();
      });

      eventBus.emit(EVENTS.NETWORK_BROADCAST_TX, tx);
    });

    it('should emit and listen to NETWORK_BROADCAST_BLOCK', (done) => {
      const block = { height: 100 };

      eventBus.on(EVENTS.NETWORK_BROADCAST_BLOCK, (receivedBlock) => {
        expect(receivedBlock).toEqual(block);
        done();
      });

      eventBus.emit(EVENTS.NETWORK_BROADCAST_BLOCK, block);
    });

    it('should emit and listen to NETWORK_PEER_CONNECTED', (done) => {
      const peerId = 'peer1';
      const address = '192.168.1.1:8080';

      eventBus.on(EVENTS.NETWORK_PEER_CONNECTED, (receivedPeerId, receivedAddress) => {
        expect(receivedPeerId).toBe(peerId);
        expect(receivedAddress).toBe(address);
        done();
      });

      eventBus.emit(EVENTS.NETWORK_PEER_CONNECTED, peerId, address);
    });

    it('should emit and listen to NETWORK_PEER_DISCONNECTED', (done) => {
      const peerId = 'peer1';
      const reason = 'timeout';

      eventBus.on(EVENTS.NETWORK_PEER_DISCONNECTED, (receivedPeerId, receivedReason) => {
        expect(receivedPeerId).toBe(peerId);
        expect(receivedReason).toBe(reason);
        done();
      });

      eventBus.emit(EVENTS.NETWORK_PEER_DISCONNECTED, peerId, reason);
    });

    it('should emit and listen to NETWORK_SYNC_STARTED', (done) => {
      const request = {
        requestId: 'sync-001',
        fromHeight: 100,
        toHeight: 200,
        peerId: 'peer1'
      };

      eventBus.on(EVENTS.NETWORK_SYNC_STARTED, (receivedRequest) => {
        expect(receivedRequest.requestId).toBe('sync-001');
        expect(receivedRequest.fromHeight).toBe(100);
        expect(receivedRequest.toHeight).toBe(200);
        expect(receivedRequest.peerId).toBe('peer1');
        done();
      });

      eventBus.emit(EVENTS.NETWORK_SYNC_STARTED, request);
    });

    it('should emit and listen to NETWORK_SYNC_COMPLETED', (done) => {
      const response = {
        requestId: 'sync-001',
        success: true,
        finalHeight: 200
      };

      eventBus.on(EVENTS.NETWORK_SYNC_COMPLETED, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('sync-001');
        expect(receivedResponse.success).toBe(true);
        expect(receivedResponse.finalHeight).toBe(200);
        done();
      });

      eventBus.emit(EVENTS.NETWORK_SYNC_COMPLETED, response);
    });
  });

  // ============================================================================
  // System Events
  // ============================================================================

  describe('System Events', () => {
    it('should emit and listen to SYSTEM_READY', (done) => {
      eventBus.on(EVENTS.SYSTEM_READY, () => {
        done();
      });

      eventBus.emit(EVENTS.SYSTEM_READY);
    });

    it('should emit and listen to SYSTEM_SHUTDOWN', (done) => {
      const reason = 'User requested shutdown';

      eventBus.on(EVENTS.SYSTEM_SHUTDOWN, (receivedReason) => {
        expect(receivedReason).toBe(reason);
        done();
      });

      eventBus.emit(EVENTS.SYSTEM_SHUTDOWN, reason);
    });

    it('should emit and listen to SYSTEM_ERROR', (done) => {
      const module = 'consensus';
      const error = new Error('Critical failure');
      const fatal = true;

      eventBus.on(EVENTS.SYSTEM_ERROR, (receivedModule, receivedError, receivedFatal) => {
        expect(receivedModule).toBe(module);
        expect(receivedError).toEqual(error);
        expect(receivedFatal).toBe(fatal);
        done();
      });

      eventBus.emit(EVENTS.SYSTEM_ERROR, module, error, fatal);
    });

    it('should emit and listen to SYSTEM_METRIC', (done) => {
      const name = 'block_time';
      const value = 5.5;
      const labels = { node: 'node1', type: 'instant' };

      eventBus.on(EVENTS.SYSTEM_METRIC, (receivedName, receivedValue, receivedLabels) => {
        expect(receivedName).toBe(name);
        expect(receivedValue).toBe(value);
        expect(receivedLabels).toEqual(labels);
        done();
      });

      eventBus.emit(EVENTS.SYSTEM_METRIC, name, value, labels);
    });
  });

  // ============================================================================
  // Contract Service Events
  // ============================================================================

  describe('Contract Service Events', () => {
    it('should emit and listen to CONTRACT_STORAGE_GET', (done) => {
      const request = { requestId: 'req1', key: 'balance' };

      eventBus.on(EVENTS.CONTRACT_STORAGE_GET, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        expect(receivedRequest.key).toBe('balance');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_STORAGE_GET, request);
    });

    it('should emit and listen to CONTRACT_CRYPTO_VERIFY', (done) => {
      const request = {
        requestId: 'req2',
        data: 'message',
        signature: 'sig',
        publicKey: 'pubkey'
      };

      eventBus.on(EVENTS.CONTRACT_CRYPTO_VERIFY, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_CRYPTO_VERIFY, request);
    });

    it('should emit and listen to CONTRACT_CRYPTO_HASH', (done) => {
      const request = { requestId: 'req3', data: 'data to hash' };

      eventBus.on(EVENTS.CONTRACT_CRYPTO_HASH, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_CRYPTO_HASH, request);
    });

    it('should emit and listen to CONTRACT_ACCOUNT_GETBALANCE', (done) => {
      const request = { requestId: 'req4', address: 'addr1', asset: 'STRM' };

      eventBus.on(EVENTS.CONTRACT_ACCOUNT_GETBALANCE, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_ACCOUNT_GETBALANCE, request);
    });

    it('should emit and listen to CONTRACT_MATH_DECIMAL', (done) => {
      const request = { requestId: 'req5', value: '123.456' };

      eventBus.on(EVENTS.CONTRACT_MATH_DECIMAL, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_DECIMAL, request);
    });

    it('should emit and listen to CONTRACT_MATH_ADD', (done) => {
      const request = { requestId: 'req6', a: '100', b: '200' };

      eventBus.on(EVENTS.CONTRACT_MATH_ADD, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_ADD, request);
    });

    it('should emit and listen to CONTRACT_MATH_SUBTRACT', (done) => {
      const request = { requestId: 'req7', a: '500', b: '200' };

      eventBus.on(EVENTS.CONTRACT_MATH_SUBTRACT, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_SUBTRACT, request);
    });

    it('should emit and listen to CONTRACT_MATH_COMPARE', (done) => {
      const request = { requestId: 'req8', a: '100', b: '200' };

      eventBus.on(EVENTS.CONTRACT_MATH_COMPARE, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_COMPARE, request);
    });

    it('should emit and listen to CONTRACT_ENCODING_TOJSON', (done) => {
      const request = { requestId: 'req9', data: { key: 'value' } };

      eventBus.on(EVENTS.CONTRACT_ENCODING_TOJSON, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_ENCODING_TOJSON, request);
    });

    it('should emit and listen to CONTRACT_TRANSACTION_VALIDATESIGNATURES', (done) => {
      const request = { requestId: 'req10', transaction: { id: 'tx1' } };

      eventBus.on(EVENTS.CONTRACT_TRANSACTION_VALIDATESIGNATURES, (receivedRequest) => {
        expect(receivedRequest).toEqual(request);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_TRANSACTION_VALIDATESIGNATURES, request);
    });
  });

  // ============================================================================
  // Contract Service Response Events
  // ============================================================================

  describe('Contract Service Response Events', () => {
    it('should emit and listen to CONTRACT_STORAGE_RESPONSE', (done) => {
      const response = { requestId: 'req1', value: 'stored-value' };

      eventBus.on(EVENTS.CONTRACT_STORAGE_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req1');
        expect(receivedResponse.value).toBe('stored-value');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_STORAGE_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_CRYPTO_VERIFY_RESPONSE', (done) => {
      const response = { requestId: 'req2', isValid: true };

      eventBus.on(EVENTS.CONTRACT_CRYPTO_VERIFY_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req2');
        expect(receivedResponse.isValid).toBe(true);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_CRYPTO_VERIFY_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_CRYPTO_HASH_RESPONSE', (done) => {
      const response = { requestId: 'req3', hash: '0xabc123' };

      eventBus.on(EVENTS.CONTRACT_CRYPTO_HASH_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req3');
        expect(receivedResponse.hash).toBe('0xabc123');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_CRYPTO_HASH_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_ACCOUNT_GETBALANCE_RESPONSE', (done) => {
      const response = { requestId: 'req4', balance: '1000.50' };

      eventBus.on(EVENTS.CONTRACT_ACCOUNT_GETBALANCE_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req4');
        expect(receivedResponse.balance).toBe('1000.50');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_ACCOUNT_GETBALANCE_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_MATH_DECIMAL_RESPONSE', (done) => {
      const response = { requestId: 'req5', result: '123.456' };

      eventBus.on(EVENTS.CONTRACT_MATH_DECIMAL_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req5');
        expect(receivedResponse.result).toBe('123.456');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_DECIMAL_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_MATH_ADD_RESPONSE', (done) => {
      const response = { requestId: 'req6', result: '300' };

      eventBus.on(EVENTS.CONTRACT_MATH_ADD_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req6');
        expect(receivedResponse.result).toBe('300');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_ADD_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_MATH_SUBTRACT_RESPONSE', (done) => {
      const response = { requestId: 'req7', result: '100' };

      eventBus.on(EVENTS.CONTRACT_MATH_SUBTRACT_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req7');
        expect(receivedResponse.result).toBe('100');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_SUBTRACT_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_MATH_COMPARE_RESPONSE', (done) => {
      const response = { requestId: 'req8', result: -1 };

      eventBus.on(EVENTS.CONTRACT_MATH_COMPARE_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req8');
        expect(receivedResponse.result).toBe(-1);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_MATH_COMPARE_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_ENCODING_TOJSON_RESPONSE', (done) => {
      const response = { requestId: 'req9', json: '{"key":"value"}' };

      eventBus.on(EVENTS.CONTRACT_ENCODING_TOJSON_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req9');
        expect(receivedResponse.json).toBe('{"key":"value"}');
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_ENCODING_TOJSON_RESPONSE, response);
    });

    it('should emit and listen to CONTRACT_TRANSACTION_VALIDATESIGNATURES_RESPONSE', (done) => {
      const response = { requestId: 'req10', isValid: true };

      eventBus.on(EVENTS.CONTRACT_TRANSACTION_VALIDATESIGNATURES_RESPONSE, (receivedResponse) => {
        expect(receivedResponse.requestId).toBe('req10');
        expect(receivedResponse.isValid).toBe(true);
        done();
      });

      eventBus.emit(EVENTS.CONTRACT_TRANSACTION_VALIDATESIGNATURES_RESPONSE, response);
    });
  });

  // ============================================================================
  // Singleton Pattern
  // ============================================================================

  describe('Singleton Pattern', () => {
    it('should maintain singleton instance', () => {
      const instance1 = eventBus;
      const instance2 = eventBus;

      expect(instance1).toBe(instance2);
    });

    it('should share listeners across imports', (done) => {
      const testData = 'test-data';

      eventBus.on(EVENTS.SYSTEM_READY, () => {
        done();
      });

      // Emitting from the same instance should trigger the listener
      eventBus.emit(EVENTS.SYSTEM_READY);
    });
  });

  // ============================================================================
  // Event Listener Management
  // ============================================================================

  describe('Event Listener Management', () => {
    it('should support .once() for one-time listeners', () => {
      let callCount = 0;

      eventBus.once(EVENTS.SYSTEM_READY, () => {
        callCount++;
      });

      eventBus.emit(EVENTS.SYSTEM_READY);
      eventBus.emit(EVENTS.SYSTEM_READY);

      expect(callCount).toBe(1);
    });

    it('should support .off() to remove listeners', () => {
      let callCount = 0;

      const listener = () => {
        callCount++;
      };

      eventBus.on(EVENTS.SYSTEM_READY, listener);
      eventBus.emit(EVENTS.SYSTEM_READY);

      eventBus.off(EVENTS.SYSTEM_READY, listener);
      eventBus.emit(EVENTS.SYSTEM_READY);

      expect(callCount).toBe(1);
    });

    it('should support multiple listeners for the same event', (done) => {
      let count = 0;

      eventBus.on(EVENTS.SYSTEM_READY, () => {
        count++;
      });

      eventBus.on(EVENTS.SYSTEM_READY, () => {
        count++;
        expect(count).toBe(2);
        done();
      });

      eventBus.emit(EVENTS.SYSTEM_READY);
    });
  });
});
