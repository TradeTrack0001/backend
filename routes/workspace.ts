import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import transporter from '../data/mailer'; // Import the transporter

const prisma = new PrismaClient();
const router = Router();

const SECRET_KEY = process.env.SECRET_KEY as string;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY environment variable is not defined');
}

// Middleware to protect routes
const jwtMiddleware = expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] });

// Helper function to check if the user is an admin
async function isAdmin(userId: string, workspaceId: number): Promise<boolean> {
  const userWorkspace = await prisma.userWorkspace.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId,
      isAdmin: true,
    },
  });
  return !!userWorkspace;
}
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

// Endpoint to invite a user to a workspace
router.post('/invite', jwtMiddleware, async (req, res) => {
  const { email, workspaceId } = req.body;
  const userId = (req as any).auth.id;

  if (!email || !workspaceId) {
    return res.status(400).send('Email and workspace ID are required');
  }

  if (!(await isAdmin(userId, workspaceId))) {
    return res.status(403).send('Only admins can invite users to workspaces');
  }

  // Generate an invitation token (e.g., JWT or a unique token)
  const inviteToken = jwt.sign({ email, workspaceId }, SECRET_KEY, { expiresIn: '1d' });

  const inviteLink = `http://localhost:1420/accept-invite?token=${inviteToken}`; // Replace with your actual invite link

  // Send the invitation email
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: email, // Recipient address
    subject: 'Workspace Invitation',
    text: `You have been invited to join a workspace. Click the link to accept the invitation: ${inviteLink}`,
    html: `<p>You have been invited to join a workspace. Click the link to accept the invitation:</p><p><a href="${inviteLink}">${inviteLink}</a></p>`,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending invitation email');
    }
    res.status(200).json({ message: 'Invitation sent', info });
  });
});

// Endpoint to accept an invitation
router.post('/accept-invite', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { email: string, workspaceId: number };
    const { email, workspaceId } = decoded;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).send('User not found');
    }

    await prisma.userWorkspace.create({
      data: {
        userId: user.id,
        workspaceId: workspaceId,
        isAdmin: false, // Set as false as they are being invited
      },
    });

    res.status(200).json({ message: 'User added to workspace' });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(400).send('Invalid or expired token');
  }
});

// Endpoint to get all workspaces a user is in
router.get('/get_workspaces', jwtMiddleware, async (req, res) => {
  const userId = (req as any).auth.id;

  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        userWorkspaces: {
          some: {
            userId: userId,
          },
        },
      },
    });

    res.status(200).json({ workspaces });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).send('Error fetching workspaces');
  }
});

// Endpoint to add an inventory item to a workspace
router.post('/add_inventory', jwtMiddleware, async (req, res) => {
  const {  workspaceId, itemName, itemDescription, itemQuantity, itemStatus, itemSize, type, location, checkInDate, checkOutDate } = req.body;
  const userId = (req as any).auth.id;
  console.log(workspaceId)

  try {
    const newInventory = await prisma.inventory.create({
      data: {

        itemName,
        itemDescription,
        itemQuantity: parseInt(itemQuantity, 10),
        itemStatus,
        itemSize,
        type,
        location,
        checkInDate,
        checkOutDate: checkOutDate || "N/A",
        workspaceId: workspaceId,
      },
    });

    res.status(201).json({ message: 'Inventory item added', inventory: newInventory });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).send('Error adding inventory item');
  }
});

// Endpoint to get the current workspace
router.get('/current_workspace', jwtMiddleware, async (req, res) => {
  const userId = (req as any).auth.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { currentWorkspace: true },
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ currentWorkspace: user.currentWorkspace });
  } catch (error) {
    console.error('Error fetching current workspace:', error);
    res.status(500).send('Error fetching current workspace');
  }
});

// Endpoint to set the current workspace
router.post('/current_workspace', jwtMiddleware, async (req, res) => {
  const { workspaceId } = req.body;
  const userId = (req as any).auth.id;

  try {
    // Ensure the user is part of the workspace
    const userWorkspace = await prisma.userWorkspace.findFirst({
      where: {
        userId: userId,
        workspaceId: workspaceId,
      },
    });

    if (!userWorkspace) {
      return res.status(403).send('User is not a member of the specified workspace');
    }

    // Update the user's current workspace
    await prisma.user.update({
      where: { id: userId },
      data: { currentWorkspaceId: workspaceId },
    });

    res.status(200).json({ message: 'Current workspace set' });
  } catch (error) {
    console.error('Error setting current workspace:', error);
    res.status(500).send('Error setting current workspace');
  }
});

router.get('/workspaces/:workspaceId/inventory', jwtMiddleware, async (req, res) => {
  const { workspaceId } = req.params;

  try {
    const inventoryItems = await prisma.inventory.findMany({
      where: { workspaceId: parseInt(workspaceId, 10) },
    });

    res.status(200).json({ inventoryItems });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).send('Error fetching inventory items');
  }
});



// Export the router
export default router;
