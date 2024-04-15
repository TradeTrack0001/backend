import express from "express";
import inventoryRouter from "./routes/inventory.js";

const app = express();
const PORT = 3000;

app.use("/inventory", inventoryRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
