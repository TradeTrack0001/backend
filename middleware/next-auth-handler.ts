// nextAuthHandler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import { Request, Response } from 'express';

export default function nextAuthHandler(
  req: Request,
  res: Response,
  options: AuthOptions
) {
  const nextApiReq = req as unknown as NextApiRequest;
  const nextApiRes = res as unknown as NextApiResponse;
  return NextAuth(nextApiReq, nextApiRes, options);
}
