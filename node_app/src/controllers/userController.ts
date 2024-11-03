import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { instanceToPlain } from 'class-transformer';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, email } = req.body;
    const existingUser = await UserRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'User exist' });
      return;
    }
    const user = UserRepository.create({ name, password, email });
    await UserRepository.save(user);
    res.status(201).json(instanceToPlain(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await UserRepository.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }, // Token expires in 1 hour
    );
    res.status(200).json({ user: instanceToPlain(user), token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};
