import express from "express";
import inventoryRouter from "./routes/inventory.js";
import ApiRouter from "./routes/api.js"; 
import prisma from "./data/prisma.js";
import cors from "cors";
import nextAuth from "next-auth";
import nextAuthConfig from "./middleware/next-auth-config.js";
import nextAuthHandler from "./middleware/next-auth-handler.js";

const app = express();
const PORT = 2000;


app.use('/api/auth', (req, res) => {
  nextAuthHandler(req, res, nextAuthConfig);
});
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api", ApiRouter);
// app.use("/inventory", inventoryRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  prisma.$connect();
  console.log(`Server is running on port ${PORT}`);
});
