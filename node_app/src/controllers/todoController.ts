import { Response } from 'express-serve-static-core';
import { TodoRepository } from '../repositories/TodoRepository';
import { UserRepository } from '../repositories/UserRepository';
import { RequestWithUser } from 'src/types/custom';
import { instanceToPlain } from 'class-transformer';

export const createTodo = async (
  req: RequestWithUser,
  res: Response,
): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.userId;
    const user = await UserRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const todo = TodoRepository.create({ title, description, user });
    await TodoRepository.save(instanceToPlain(todo));
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
};

export const getTodos = async (
  req: RequestWithUser,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const todos = await TodoRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    res.status(200).json(instanceToPlain(todos));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve todos' });
  }
};

export const getTodoById = async (
  req: RequestWithUser,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const todo = await TodoRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!todo) {
      res.status(404).json({
        message: 'Todo not found',
      });
      return;
    }
    res.status(200).json(instanceToPlain(todo));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve todo' });
  }
};
