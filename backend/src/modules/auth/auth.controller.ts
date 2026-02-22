import { Request, Response } from 'express';
import ApiError from '../../utils/ApiError';
import { prisma } from '../../config/postgres';
import { hashPassword } from '../../utils/password';
import { asyncHandler } from '../../utils/asyncHandler';

const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password }: { name: string; email: string; password: string } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const hashedPassword: string = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: user,
  });
});

export { register };
