import { Router } from "express";
import prisma from "../data/prisma.js";

const router = Router();

router.get("/profile/:id", async (req, res) => {
    const id = parseInt(req.params.id);
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