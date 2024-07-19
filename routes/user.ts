import { Router } from "express";
import prisma from "../data/prisma.js";
import { expressjwt } from "express-jwt";
import bcrypt from "bcryptjs";
const router = Router();
const key = process.env.SECRET_KEY;
if (!key) {
    throw new Error("SECRET_KEY environment variable is not defined");
}
const jwtMiddleware = expressjwt({ secret: key, algorithms: ['HS256'] });

router.get("/get_user",jwtMiddleware, async (req, res) => {
    const id = (req as any).auth.id;
    // console.log("This is the id: ", id);
    const users = await prisma.user.findUnique(
        {
            where: {
                id: id
            }
        }
    );
    res.json(users);
})

router.put("/update_profile",jwtMiddleware, async (req, res) => {
    try {
    console.log("This is the body: ", req.body);
    const id = (req as any).auth.id;
    console.log("This is the id: ", id);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = await prisma.user.update(
        {
            where: {
                id: id
            },
            data: {
                email: req.body.email,
                password: hashedPassword
                // name: req.body.name
            }
        }
    );
    res.json(users);
    } catch (error) {
        console.log(error);
    }
})
export default router