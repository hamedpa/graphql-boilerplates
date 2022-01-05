import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

import { verifyToken } from '../utils/jwt';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    if (params?.args?.data?.password) 
        params.args.data.password = hashSync(params.args.data.password, 10);
    
    const result = await next(params);
    return result;
});

export default async ({ req }) => {
  const token = req.headers?.authorization || '';
  const user = await verifyToken(token);
  return { prisma, user };
};
