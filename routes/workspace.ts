import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { expressjwt } from 'express-jwt';
import transporter from '../data/mailer'; 

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

  const inviteLink = `http://yourapp.com/accept-invite?token=${inviteToken}`; // Replace with your actual invite link

  // Send the invitation email
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: email, // Recipient address
    subject: 'Workspace Invitation',
    text: `You have been invited to join a workspace. Click the link to accept the invitation: ${inviteLink}`,
    html: `<p>You have been invited to join a workspace. Click the link to accept the invitation:</p><p><a href="${inviteLink}">${inviteLink}</a></p>`,
  };

  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending invitation email');
    }
    res.status(200).json({ message: 'Invitation sent', info });
  });
});


// Export the router
export default router;
