import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { expressjwt } from 'express-jwt';

const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY environment variable is not defined');
}

// Middleware to protect routes
const jwtMiddleware = expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] });

// Register route
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).send('User registered');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error registering user');
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  let user = null;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.log(error);
  }
  if (user && await bcrypt.compare(password, user.password)) {
    // Include user.id in the JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid email or password');
  }
});

// Protected route
router.get('/protected', jwtMiddleware, (req: Request, res: Response) => {
  res.send(`Hello ${(req as any).auth.email}, you have access to this route.`);
});

// Error handling for JWT
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
  } else {
    next(err);
  }
});

export default router;
