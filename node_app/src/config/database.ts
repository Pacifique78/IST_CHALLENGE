import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import path from 'path';
import { Todo } from '../entities/Todo';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || 'node_tododb', // Updated database name
  synchronize: false,
  logging: true,
  entities: [User, Todo],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error initializing the database', err);
  });
