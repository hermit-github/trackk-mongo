import { Request } from 'express';

export type UserRequest = {
    id:string;
    email:string;
    roles:string[];
    isActive:boolean;
}

export interface AuthRequest extends Request {
  user?:  UserRequest;
}