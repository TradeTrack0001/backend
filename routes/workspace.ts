import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { expressjwt } from 'express-jwt';

const prisma = new PrismaClient();
const router = Router();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY environment variable is not defined');
}

// Middleware to protect routes
const jwtMiddleware = expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] });

// Create a new workspace
router.post('/create_workspace', jwtMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = (req as any).auth.id;

  if (!name) {
    return res.status(400).send('Workspace name is required');
  }

  try {
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: name,
        userWorkspaces: {
          create: {
            userId: userId,
            isAdmin: true,
          },
        },
      },
    });

    res.status(201).json({
      status_code: 201,
      message: 'Workspace created',
      workspace: newWorkspace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating workspace');
  }
});

// Export the router
export default router;
