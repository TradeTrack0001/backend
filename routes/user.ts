import { Router } from "express";
import prisma from "../data/prisma.js";
import { expressjwt } from "express-jwt";

const router = Router();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not defined');
  }

const jwtMiddleware = expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] });

router.get("/get_user", jwtMiddleware,async (req, res) => {
    const id = (req as any).auth.id;
    console.log("This is the id: ", id);
    const users = await prisma.user.findUnique(
        {
            where: {
                id: id
            }
        }
    );
    res.json(users);
})



export default router