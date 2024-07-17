import express from "express";
import inventoryRouter from "./routes/inventory.js";
import ApiRouter from "./routes/api.js"; 
import prisma from "./data/prisma.js";
import cors from "cors";
import user from "./routes/user.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";
const app = express();
const PORT = 2000;



app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", ApiRouter);
app.use("/profile", user)
// app.use("/inventory", inventoryRouter);
// Use the auth router for all /auth routes
app.use('/auth', authRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const server = app.listen(PORT, () => {
  prisma.$connect();
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, prisma };