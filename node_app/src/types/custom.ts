import { Request } from 'express';

export type RequestWithUser = Request & {
  user?: { userId: string; email: string };
};

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

export interface ITodoCreate {
  title: string;
  description?: string;
}

export interface ITodoResponse extends ITodoCreate {
  id: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ITodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}
