import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User);
