/**
 * Jest test setup file
 * Configures global test environment and mocks
 */

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.JWT_REFRESH_SECRET =
  'test-jwt-refresh-secret-key-for-testing-purposes-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

// Mock database configuration for tests
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test_db';

// Mock Redis configuration for tests
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

// Increase timeout for async operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Helper to create mock request objects
  createMockRequest: (overrides = {}) => ({
    user: { id: 'test-user-id', adminId: 'test-admin-id' },
    headers: {},
    body: {},
    query: {},
    params: {},
    ...overrides,
  }),

  // Helper to create mock response objects
  createMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    return res;
  },

  // Helper to wait for async operations
  wait: (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)),
};

// Mock TypeORM for unit tests that don't need real database
jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    createConnection: jest.fn(),
    getConnection: jest.fn(),
    getRepository: jest.fn(),
    Entity: actual.Entity,
    Column: actual.Column,
    PrimaryGeneratedColumn: actual.PrimaryGeneratedColumn,
    CreateDateColumn: actual.CreateDateColumn,
    UpdateDateColumn: actual.UpdateDateColumn,
    DeleteDateColumn: actual.DeleteDateColumn,
    ManyToOne: actual.ManyToOne,
    OneToMany: actual.OneToMany,
    ManyToMany: actual.ManyToMany,
    JoinTable: actual.JoinTable,
    JoinColumn: actual.JoinColumn,
  };
});

// Mock Redis for tests
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    flushall: jest.fn(),
    quit: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  }));
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
