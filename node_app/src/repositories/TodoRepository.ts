import { AppDataSource } from '../config/database';
import { Todo } from '../entities/Todo';

export const TodoRepository = AppDataSource.getRepository(Todo);
