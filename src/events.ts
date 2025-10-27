
import type { Block, Transaction, NodeIdentity } from 'streembit-bc-types';


// Event payload types - single source of truth
export type SubmitTransactionPayload = {
    requestId: string;
    txJson: string;
};

export type PeerBlockInboundPayload = {
    blockPayload: unknown;
    advertisedBlockCount: number;
    peerId: string;
    timestamp: number;
};

// Contract service payload types
export type ContractStorageGetPayload = { requestId: string; key: string };
export type ContractCryptoVerifyPayload = { requestId: string; data: string; signature: string; publicKey: string };
export type ContractCryptoHashPayload = { requestId: string; data: string | Buffer };
export type ContractAccountGetBalancePayload = { requestId: string; address: string; asset: string };
export type ContractMathDecimalPayload = { requestId: string; value: string };
export type ContractMathBinaryPayload = { requestId: string; a: string; b: string };
export type ContractEncodingToJsonPayload = { requestId: string; data: any };
export type ContractTXValidateSigPayload = { requestId: string; transaction: Transaction };
export type ContractConfigGetGenesisKeysPayload = { requestId: string; };
export type GenesisPublicKeyInfo = {
    genesisId: string;
    publicKey: string;
};

export type ContractConfigGetGenesisPublicKeysResponse = {
    requestId: string;
    success: boolean;
    data?: GenesisPublicKeyInfo[];
    error?: string;
};

export type ConsrtiumApprovalResult= {
    consortiumId: string;
    validatorId: string;
    approved: boolean;
    signature: {
        publicKey: string;
        signature: string;
    }
    rejectedReason?: string;
};

// Export event names as constants for easy reference
export const EVENTS = {
    // CLI
    TRANSACTION_SUBMIT: 'tx:submit-transaction',
    TRANSACTION_RESPONSE: 'tx:transaction-response',
    TRANSACTION_SUBMIT_VALIDATION_REQUEST: 'tx:submit-validation-request',
    TRANSACTION_VALIDATION_RESPONSE: 'tx:validation-response',

    // Mempool
    MEMPOOL_TRANSACTION: 'mempool:transaction',
    MEMPOOL_RETURN: 'mempool:return',
    TX_REJECTED: 'tx:rejected',
    TX_REMOVED: 'tx:removed',

    // Attestations
    VALIDATOR_ATTESTATION: 'validator:attestation',
    ATTESTATIONS_COMPLETE: 'attestations:complete',
    ATTESTATION_REQUEST: 'attestation:request',

    // Registry
    REGISTRY_NODES_UPDATED: 'registry:nodes-updated',
    REGISTRY_VALIDATORS_UPDATED: 'registry:validators-updated',

    // Consensus
    CONSENSUS_ROLE_CHANGED: 'consensus:role-changed',
    CONSENSUS_SLOT_TICK: 'consensus:slot-tick',
    SCHEDULE_CHANGE: 'schedule:change',

    // Shadow
    SHADOW_PREPARE: 'shadow:prepare',
    SHADOW_TAKEOVER: 'shadow:takeover',

    // Blocks
    BLOCK_FINALIZED: 'block:finalized',
    NETWORK_BLOCK_RECEIVED: 'network:block-received',
    BLOCK_PROPAGATE: 'block:propagate',
    PEER_BLOCK: 'peer:block',
    PEER_BLOCK_INBOUND: 'peer:block-inbound',
    BLOCK_REORG: 'block:reorg',

    // Deposits
    DEPOSIT_LOCKED: 'deposit:locked',
    DEPOSIT_RELEASED: 'deposit:released',
    DEPOSIT_SLASHED: 'deposit:slashed',

    // State
    STATE_BALANCE_UPDATED: 'state:balance-updated',
    STATE_ROOT_UPDATED: 'state:root-updated',

    // Network
    NETWORK_BROADCAST_TX: 'network:broadcast-tx',
    NETWORK_BROADCAST_BLOCK: 'network:broadcast-block',
    NETWORK_PEER_CONNECTED: 'network:peer-connected',
    NETWORK_PEER_DISCONNECTED: 'network:peer-disconnected',
    NETWORK_SYNC_STARTED: 'network:sync-started',
    NETWORK_SYNC_COMPLETED: 'network:sync-completed',

    // System
    SYSTEM_READY: 'system:ready',
    SYSTEM_SHUTDOWN: 'system:shutdown',
    SYSTEM_ERROR: 'system:error',
    SYSTEM_METRIC: 'system:metric',

    // Contract Service Events - Requests
    CONTRACT_STORAGE_GET: 'contract:storage.get',
    CONTRACT_CRYPTO_VERIFY: 'contract:crypto.verify',
    CONTRACT_CRYPTO_HASH: 'contract:crypto.hash',
    CONTRACT_ACCOUNT_GETBALANCE: 'contract:account.getBalance',
    CONTRACT_MATH_DECIMAL: 'contract:math.decimal',
    CONTRACT_MATH_ADD: 'contract:math.add',
    CONTRACT_MATH_SUBTRACT: 'contract:math.subtract',
    CONTRACT_MATH_COMPARE: 'contract:math.compare',
    CONTRACT_ENCODING_TOJSON: 'contract:encoding.toJSON',
    CONTRACT_TRANSACTION_VALIDATESIGNATURES: 'contract:transaction.validateSignatures',
    CONTRACT_CONFIG_GET_GENESISKEYS: 'contract:config.getGenesisKeys',

    // Contract Service Events - Responses
    CONTRACT_STORAGE_RESPONSE: 'contract:storage.response',
    CONTRACT_CRYPTO_VERIFY_RESPONSE: 'contract:crypto.verify.response',
    CONTRACT_CRYPTO_HASH_RESPONSE: 'contract:crypto.hash.response',
    CONTRACT_ACCOUNT_GETBALANCE_RESPONSE: 'contract:account.getBalance.response',
    CONTRACT_MATH_DECIMAL_RESPONSE: 'contract:math.decimal.response',
    CONTRACT_MATH_ADD_RESPONSE: 'contract:math.add.response',
    CONTRACT_MATH_SUBTRACT_RESPONSE: 'contract:math.subtract.response',
    CONTRACT_MATH_COMPARE_RESPONSE: 'contract:math.compare.response',
    CONTRACT_ENCODING_TOJSON_RESPONSE: 'contract:encoding.toJSON.response',
    CONTRACT_TRANSACTION_VALIDATESIGNATURES_RESPONSE: 'contract:transaction.validateSignatures.response',
    CONTRACT_CONFIG_GET_GENESISKEYS_RESPONSE: 'contract:config.getGenesisKeys.response',
} as const;




// Events

export interface Events {
    /**
    * Emitted when CLI submits a validation request as JSON string
    * Source: CLI (command line interface) or GUI app
    * Consumers: TransactionPool
    * Purpose: Submit raw transaction JSON for validation only (no processing)
    * Note: CLI should NOT serialize - it sends raw JSON string
    * Note: requestId is required to match response with request in concurrent scenarios
    */
    [EVENTS.TRANSACTION_SUBMIT_VALIDATION_REQUEST]: (request: {
        requestId: string;
        txJson: string;
    }) => void;

    /**
     * Response to CLI validation request submission
     * Source: TransactionPool
     * Consumers: CLI
     * Purpose: Return the validated (signed by the validators), serializid transaction as a string to the CLI and
     * the validation result (success or validation errors)
     * Note: requestId matches the original request
     */
    [EVENTS.TRANSACTION_VALIDATION_RESPONSE]: (response: {
        requestId: string;
        success: boolean;
        errors?: string[];
        txJson?: string;
    }) => void;

    /**
     * Emitted when CLI submits a transaction as JSON string
     * Source: CLI (command line interface)
     * Consumers: TransactionPool
     * Purpose: Submit raw transaction JSON for deserialization and processing
     * Note: CLI should NOT serialize - it sends raw JSON string
     * Note: requestId is required to match response with request in concurrent scenarios
     */
    [EVENTS.TRANSACTION_SUBMIT]: (request: SubmitTransactionPayload) => void;

    /**
     * Response to CLI transaction submission
     * Source: TransactionPool
     * Consumers: CLI
     * Purpose: Notify CLI of submission result (success or validation errors)
     * Note: requestId matches the original request
     */
    [EVENTS.TRANSACTION_RESPONSE]: (response: {
        requestId: string;
        success: boolean;
        txId?: string;
        errors?: string[];
    }) => void;

    /**
     * Emitted when transaction arrives at mempool and is ready for processing
     * Source: Mempool
     * Consumers: Engine (via OnMempoolTransaction)
     * Purpose: Notify engine that transaction is available
     */
    [EVENTS.MEMPOOL_TRANSACTION]: (tx: Transaction) => void;

    /**
     * Command to return transaction to mempool (e.g., on failure)
     * Source: Engine (InstantEngine, EpochEngine)
     * Consumers: Mempool
     * Purpose: Return failed/unprocessed transaction to pool
     */
    [EVENTS.MEMPOOL_RETURN]: (tx: Transaction) => void;

    /**
     * Emitted when transaction validation fails
     * Source: Engine or Mempool
     * Consumers: CLI, RPC (for error reporting)
     * Purpose: Notify submission failure with reasons
     */
    [EVENTS.TX_REJECTED]: (tx: Transaction, errors: string[]) => void;

    /**
     * Emitted when transactions are removed from pool (included in block)
     * Source: Engine (after block finalization)
     * Consumers: Mempool, RPC
     * Purpose: Remove transactions that are now in blockchain
     */
    [EVENTS.TX_REMOVED]: (txIds: string[], reason: 'included' | 'expired' | 'replaced') => void;


    // ============================================================================
    // Attestation Events (Core to PoC Consensus)
    // ============================================================================

    /**
     * Emitted when validator sends attestation to block creator
     * Source: Validator nodes
     * Consumers: Engine (creator nodes)
     * Purpose: Validators attest to transaction validity
     * Note: requestId matches the attestation request to track which transaction this attestation is for
     */
    [EVENTS.VALIDATOR_ATTESTATION]: (response: {
        requestId: string;
        transaction: Transaction;
        validatorId: string;
        signature: string;
        timestamp: number;
    }) => void;

    /**
     * Emitted when enough attestations collected for a transaction
     * Source: Engine
     * Consumers: Engine internal
     * Purpose: Signal that transaction has enough validators
     * Note: requestId matches the original attestation request
     */
    [EVENTS.ATTESTATIONS_COMPLETE]: (response: {
        requestId: string;
        txId: string;
    }) => void;

    /**
     * Request validators to attest a transaction
     * Source: Engine (when transaction needs validation)
     * Consumers: Validator nodes
     * Purpose: Request attestation from validators
     * Note: requestId is required to track attestations for this specific transaction
     */
    [EVENTS.ATTESTATION_REQUEST]: (request: {
        requestId: string;
        tx: Transaction;
        creatorId: string;
    }) => void;


    // ============================================================================
    // Registry Events (Node Management)
    // ============================================================================


    /**
     * Emitted when accountable/creator nodes list changes
     * Source: Registry service
     * Consumers: Engine (updates accountableNodes)
     * Purpose: Track changes in block creators
     */
    [EVENTS.REGISTRY_NODES_UPDATED]: (nodes: NodeIdentity[]) => void;

    /**
     * Emitted when validator set changes
     * Source: Registry service
     * Consumers: Engine, Validators
     * Purpose: Track changes in validator set
     */
    [EVENTS.REGISTRY_VALIDATORS_UPDATED]: (validators: NodeIdentity[]) => void;


    // ============================================================================
    // Consensus Engine Events
    // ============================================================================


    /**
     * Emitted when node role changes
     * Source: Engine
     * Consumers: RPC (status), Metrics
     * Purpose: Notify role transition
     */
    [EVENTS.CONSENSUS_ROLE_CHANGED]: (
        oldRole: 'creator' | 'validator' | 'none',
        newRole: 'creator' | 'validator' | 'none'
    ) => void;

    /**
     * Emitted when slot changes (epoch mode)
     * Source: EpochEngine
     * Consumers: Metrics, RPC
     * Purpose: Notify slot progression
     */
    [EVENTS.CONSENSUS_SLOT_TICK]: (
        slot: number,
        slotOwner: string
    ) => void;

    /**
     * Emitted for schedule changes that might affect role
     * Source: Coordinator/Scheduler
     * Consumers: Engine (UpdateBlockProducerRole)
     * Purpose: Re-evaluate block producer role
     */
    [EVENTS.SCHEDULE_CHANGE]: () => void;


    // ============================================================================
    // Shadow Production Events
    // ============================================================================


    /**
     * Command to prepare shadow block
     * Source: InstantEngine/EpochEngine (when not primary)
     * Consumers: ShadowEngine
     * Purpose: Trigger shadow block preparation
     */
    [EVENTS.SHADOW_PREPARE]: (data: {
        transaction: Transaction;  // For instant mode
        transactions?: Transaction[];  // For epoch mode
        primaryNode: string;
        expectedBlockTime: number;
    }) => void;

    /**
     * Emitted when shadow takes over from failed primary
     * Source: ShadowEngine
     * Consumers: RPC, Metrics
     * Purpose: Notify shadow takeover event
     */
    [EVENTS.SHADOW_TAKEOVER]: (
        primaryNode: string,
        shadowNode: string,
        blockIndex: number
    ) => void;


    // ============================================================================
    // Block Events
    // ============================================================================


    /**
     * Emitted when block is finalized and ready for storage
     * Source: Engine
     * Consumers: BlockStore, State, Mempool, Network
     * Purpose: Notify that block is confirmed and should be stored/applied
     */
    [EVENTS.BLOCK_FINALIZED]: (
        block: Block,
        index: number,
        hash: string,
        txIds: string[]
    ) => void;

    /**
     * Emitted when receiving block from network
     * Source: Network
     * Consumers: Engine (OnNetworkBlock)
     * Purpose: Process block received from peer
     */
    [EVENTS.NETWORK_BLOCK_RECEIVED]: (block: Block) => void;

    /**
     * Command to propagate block to network
     * Source: Engine (after creating block)
     * Consumers: Network
     * Purpose: Broadcast new block to peers
     */
    [EVENTS.BLOCK_PROPAGATE]: (block: Block) => void;

    /**
     * Emitted when peer sends us a block
     * Source: P2P network layer
     * Consumers: Engine (OnPeerBlock)
     * Purpose: Handle blocks from specific peers
     */
    [EVENTS.PEER_BLOCK]: (block: Block) => void;

    /**
     * Emitted when block is received via REST API from peer
     * Source: REST API /block/publish route
     * Consumers: Engine
     * Purpose: Queue inbound block for async validation and processing
     */
    [EVENTS.PEER_BLOCK_INBOUND]: (payload: PeerBlockInboundPayload) => void;

    /**
     * Emitted when blockchain reorganization occurs
     * Source: Engine
     * Consumers: State, Mempool, RPC
     * Purpose: Rollback and reapply transactions
     */
    [EVENTS.BLOCK_REORG]: (
        oldTip: { index: number; hash: string },
        newTip: { index: number; hash: string },
        commonAncestor: { index: number; hash: string }
    ) => void;


    // ============================================================================
    // Deposit Events (Core to PoC - D ≥ 2×TV requirement)
    // ============================================================================


    /**
     * Emitted when creator locks deposit for block creation
     * Source: Engine (before block creation)
     * Consumers: Deposit contract, RPC
     * Purpose: Track deposit locking
     */
    [EVENTS.DEPOSIT_LOCKED]: (
        creatorAddress: string,
        amount: string,
        blockIndex: number
    ) => void;

    /**
     * Emitted when deposit is released after block finalization
     * Source: Engine (after block confirmed)
     * Consumers: Deposit contract, RPC
     * Purpose: Release locked deposit
     */
    [EVENTS.DEPOSIT_RELEASED]: (
        creatorAddress: string,
        amount: string,
        blockIndex: number
    ) => void;

    /**
     * Emitted when deposit is slashed for misbehavior
     * Source: Engine (on violation detection)
     * Consumers: Deposit contract, RPC
     * Purpose: Slash deposit for protocol violation
     */
    [EVENTS.DEPOSIT_SLASHED]: (
        creatorAddress: string,
        amount: string,
        reason: string,
        blockIndex: number
    ) => void;


    // ============================================================================
    // State Events
    // ============================================================================


    /**
     * Emitted after account balance changes
     * Source: State/Ledger
     * Consumers: RPC (balance notifications)
     * Purpose: Notify balance updates
     */
    [EVENTS.STATE_BALANCE_UPDATED]: (
        address: string,
        asset: string,
        oldBalance: string,
        newBalance: string,
        txId: string
    ) => void;

    /**
     * Emitted when state root changes (after block application)
     * Source: State
     * Consumers: Engine (for next block), RPC
     * Purpose: Track state progression
     */
    [EVENTS.STATE_ROOT_UPDATED]: (
        oldRoot: string,
        newRoot: string,
        blockIndex: number
    ) => void;


    // ============================================================================
    // Network Events
    // ============================================================================


    /**
     * Request to broadcast transaction to peers
     * Source: Mempool
     * Consumers: Network
     * Purpose: Propagate transaction across network
     */
    [EVENTS.NETWORK_BROADCAST_TX]: (tx: Transaction) => void;

    /**
     * Request to broadcast block to peers
     * Source: Engine
     * Consumers: Network
     * Purpose: Propagate finalized block
     */
    [EVENTS.NETWORK_BROADCAST_BLOCK]: (payload: { block: Block; blockCount: number }) => void;

    /**
     * Emitted when peer connects
     * Source: Network
     * Consumers: RPC (peer count)
     * Purpose: Track network topology
     */
    [EVENTS.NETWORK_PEER_CONNECTED]: (
        peerId: string,
        address: string
    ) => void;

    /**
     * Emitted when peer disconnects
     * Source: Network
     * Consumers: RPC
     * Purpose: Track network topology
     */
    [EVENTS.NETWORK_PEER_DISCONNECTED]: (
        peerId: string,
        reason: string
    ) => void;

    /**
     * Emitted when sync starts
     * Source: Network/Sync
     * Consumers: Engine (pause block production)
     * Purpose: Coordinate sync process
     * Note: requestId is required to track individual sync sessions
     */
    [EVENTS.NETWORK_SYNC_STARTED]: (request: {
        requestId: string;
        fromIndex: number;
        toIndex: number;
        peerId: string;
    }) => void;

    /**
     * Emitted when sync completes
     * Source: Network/Sync
     * Consumers: Engine (resume)
     * Purpose: Resume normal operation
     * Note: requestId matches the sync session that started
     */
    [EVENTS.NETWORK_SYNC_COMPLETED]: (response: {
        requestId: string;
        success: boolean;
        finalIndex: number;
    }) => void;


    // ============================================================================
    // System Events
    // ============================================================================


    /**
     * Emitted on startup completion
     * Source: Bootstrap
     * Consumers: All modules
     * Purpose: Signal system ready
     */
    [EVENTS.SYSTEM_READY]: () => void;

    /**
     * Emitted on shutdown initiation
     * Source: Bootstrap
     * Consumers: All modules
     * Purpose: Graceful shutdown
     */
    [EVENTS.SYSTEM_SHUTDOWN]: (reason: string) => void;

    /**
     * Emitted on critical errors
     * Source: Any module
     * Consumers: Bootstrap, Monitoring
     * Purpose: Handle fatal errors
     */
    [EVENTS.SYSTEM_ERROR]: (
        module: string,
        error: Error,
        fatal: boolean
    ) => void;

    /**
     * Emitted for important metrics
     * Source: Various modules
     * Consumers: Metrics collector
     * Purpose: Performance monitoring
     */
    [EVENTS.SYSTEM_METRIC]: (
        name: string,
        value: number,
        labels: Record<string, string>
    ) => void;


    // ============================================================================
    // Contract Service Events
    // ============================================================================


    /**
     * Storage get request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Get value from storage
     */
    [EVENTS.CONTRACT_STORAGE_GET]: (request: ContractStorageGetPayload) => void;

    /**
     * Crypto verify request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Verify signature
     */
    [EVENTS.CONTRACT_CRYPTO_VERIFY]: (request: ContractCryptoVerifyPayload) => void;

    /**
     * Crypto hash request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Hash data using blake2b256
     */
    [EVENTS.CONTRACT_CRYPTO_HASH]: (request: ContractCryptoHashPayload) => void;

    /**
     * Account get balance request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Get account balance
     */
    [EVENTS.CONTRACT_ACCOUNT_GETBALANCE]: (request: ContractAccountGetBalancePayload) => void;

    /**
     * Math decimal request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Create decimal value
     */
    [EVENTS.CONTRACT_MATH_DECIMAL]: (request: ContractMathDecimalPayload) => void;

    /**
     * Math add request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Add two decimal values
     */
    [EVENTS.CONTRACT_MATH_ADD]: (request: ContractMathBinaryPayload) => void;

    /**
     * Math subtract request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Subtract two decimal values
     */
    [EVENTS.CONTRACT_MATH_SUBTRACT]: (request: ContractMathBinaryPayload) => void;

    /**
     * Math compare request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Compare two decimal values
     */
    [EVENTS.CONTRACT_MATH_COMPARE]: (request: ContractMathBinaryPayload) => void;

    /**
     * Encoding toJSON request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Encode data to deterministic JSON
     */
    [EVENTS.CONTRACT_ENCODING_TOJSON]: (request: ContractEncodingToJsonPayload) => void;

    /**
     * Transaction validate signatures request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Validate transaction signatures using consensus layer logic
     */
    [EVENTS.CONTRACT_TRANSACTION_VALIDATESIGNATURES]: (request: ContractTXValidateSigPayload) => void;




    // ============================================================================
    // Contract Service Response Events
    // ============================================================================


    /**
     * Storage get response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return value from storage
     */
    [EVENTS.CONTRACT_STORAGE_RESPONSE]: (response: { requestId: string; value: any }) => void;

    /**
     * Crypto verify response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return signature verification result
     */
    [EVENTS.CONTRACT_CRYPTO_VERIFY_RESPONSE]: (response: { requestId: string; isValid: boolean }) => void;

    /**
     * Crypto hash response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return hash result
     */
    [EVENTS.CONTRACT_CRYPTO_HASH_RESPONSE]: (response: { requestId: string; hash: string }) => void;

    /**
     * Account get balance response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return account balance
     */
    [EVENTS.CONTRACT_ACCOUNT_GETBALANCE_RESPONSE]: (response: { requestId: string; balance: string }) => void;

    /**
     * Math decimal response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return decimal value
     */
    [EVENTS.CONTRACT_MATH_DECIMAL_RESPONSE]: (response: { requestId: string; result: string }) => void;

    /**
     * Math add response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return addition result
     */
    [EVENTS.CONTRACT_MATH_ADD_RESPONSE]: (response: { requestId: string; result: string }) => void;

    /**
     * Math subtract response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return subtraction result
     */
    [EVENTS.CONTRACT_MATH_SUBTRACT_RESPONSE]: (response: { requestId: string; result: string }) => void;

    /**
     * Math compare response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return comparison result (-1, 0, or 1)
     */
    [EVENTS.CONTRACT_MATH_COMPARE_RESPONSE]: (response: { requestId: string; result: number }) => void;

    /**
     * Encoding toJSON response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return deterministic JSON string
     */
    [EVENTS.CONTRACT_ENCODING_TOJSON_RESPONSE]: (response: { requestId: string; json: string }) => void;

    /**
     * Transaction validate signatures response
     * Source: Consensus layer
     * Consumers: Smart contracts
     * Purpose: Return signature validation result
     */
    [EVENTS.CONTRACT_TRANSACTION_VALIDATESIGNATURES_RESPONSE]: (response: { requestId: string; isValid: boolean; errors?: string[] }) => void;


    /**
     * Config get genesis keys request
     * Source: Smart contracts
     * Consumers: Consensus layer
     * Purpose: Get genesis public keys for validation
     */
    [EVENTS.CONTRACT_CONFIG_GET_GENESISKEYS]: (request: ContractConfigGetGenesisKeysPayload) => void;

    /**
     * 
     * Config get genesis keys response
     * 
     */
    [EVENTS.CONTRACT_CONFIG_GET_GENESISKEYS_RESPONSE]: (response: ContractConfigGetGenesisPublicKeysResponse) => void;

}


// Request/Reply events 
export const REQUESTS = {
    // examples; rename to your domain
    GET_BLOCK: "rpc:get-block",
    SUBMIT_TX: "rpc:submit-tx",
    GET_BLOCKS_FROM: "rpc:get-blocks-from",
} as const;


// Combine all event interfaces
type BlockchainEvents = Events;

// Export event types for modules to use
export type { BlockchainEvents };


