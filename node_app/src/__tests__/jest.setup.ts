import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';
import path from 'path';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'node_tododb_test',
  synchronize: false,
  dropSchema: true,
  entities: [User, Todo],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')]
});

beforeAll(async () => {
  // Initialize the connection
  await TestDataSource.initialize();
  
  // Drop all tables to ensure clean state
  await TestDataSource.dropDatabase();
  
  // Run migrations
  await TestDataSource.runMigrations({ transaction: 'all' });
});

beforeEach(async () => {
  // Clear data from all tables between tests
  const entities = TestDataSource.entityMetadatas;
  const tableNames = entities.map(entity => `"${entity.tableName}"`).join(', ');
  
  await TestDataSource.query(`TRUNCATE TABLE ${tableNames} CASCADE;`);
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});