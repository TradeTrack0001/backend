import { Router } from "express";
import { PrismaClient } from "../node_modules/.prisma/client/index";

const prisma = new PrismaClient();

const router = Router();

const products: Object[] = [];

router.post("/add_product", (req, res) => {
  prisma.$connect();

    console.log("Connect to server successfully");
    console.log(req.body);
    const pdata = req.body;
    prisma.inventory.create({
      data: {
        itemName: pdata.body.name,
        itemSize: pdata.body.size,
        itemDescription: pdata.body.description,
        checkInDate: pdata.body.checkInDate,
        location: pdata.body.location,
        itemStatus:pdata.body.status,
        itemQuantity: pdata.body.quantity,
        itemID: pdata.body.id,
        type: pdata.body.type,
      },
    });
    products.push(pdata);
    res.status(200).json({
      status_code: 200,
      message: "Product created",
      inventory: pdata,
    });
  });
  
  router.get("/get_products", (req, res) => {
    if (products.length > 0) {
      res.status(200).json({
        status_code: 200,
        message: "Product list",
        inventory: products,
      });
    } else {
      res.status(200).json({
        status_code: 200,
        message: "No products found",
        inventory: [],
      });
    }
  });
export default router;