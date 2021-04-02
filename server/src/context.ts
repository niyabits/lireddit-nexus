import { PrismaClient } from '@prisma/client'
import { db } from './db'
import { Request, Response } from "express";
import Session from "../session"

export interface Context {
	db: PrismaClient;
	req: Request & { session: Session };
	res: Response;
}

export const context = ({ req, res }: { req: Request, res: Response }) => {
	return { db, req, res }
}
