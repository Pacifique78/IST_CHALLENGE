import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './config/database';

dotenv.config();
const PORT = process.env.PORT || 5001;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');

    app.listen(PORT, () => {
      console.log(`Node APP is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing the database', error);
  });
