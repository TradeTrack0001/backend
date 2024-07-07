import { Router } from "express";
import prisma from "../data/prisma";

const router = Router();

const products: Object[] = [];

router.post("/add_product", async (req, res) => {
    console.log("Connect to server successfully");
    console.log(req.body);
    const pdata = req.body;
    let isTrue = false; 
    console.log(pdata[0].itemName);
    const newInventory = await prisma.inventory.create({
      data: {
        itemName: pdata[0].itemName,
        itemSize: pdata[0].itemSize,
        itemDescription: pdata[0].itemDescription,
        checkInDate: pdata[0].checkInDate,
        location: pdata[0].location,
        itemStatus:pdata[0].itemStatus,
        itemQuantity: parseInt(pdata[0].itemQuantity),
        itemID: parseInt(pdata[0].itemID),
        type: pdata[0].type,
      },
    });

    products.push(pdata);
    res.status(200).json({
      status_code: 200,
      message: "Product created",
      inventory: newInventory,
    });
  });
  
  router.get("/get_products", async (req, res) => {
    console.log("Connect to server successfully");
    prisma.$connect();
    await prisma.inventory.findMany().then((data) => {
      console.log(data);
      if (data.length > 0) {
      res.status(200).json({
        status_code: 200,
        message: "Product list",
        inventory: data,
      });
    } else {
      res.status(200).json({
        status_code: 200,
        message: "No products found",
        inventory: [],
      });
    }
    }
    );
  }
  );
  router.delete("/delete_product/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    const inventory = await prisma.inventory.delete({
      where: {
        itemID: id,
      },
    });
    if(inventory){
      res.status(200).json({
        status_code: 200,
        message: "Product deleted",
        inventory: inventory,
      });
    } else {
      res.status(200).json({
        status_code: 200,
        message: "Product not found",
        inventory: [],
      });
    }
  });

  router.put("/update_product/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    console.log("Connect to server successfully and id is:" + id);
    const pdata = req.body;
    console.log(id); 
    const inventory = await prisma.inventory.update({
      where: {
        itemID: id, 
      },
      data: {
        itemName: pdata.name,
        checkInDate: pdata?.checkInDate,
        checkOutDate: pdata?.checkOutDate,
        location: pdata.location,
        itemQuantity: parseInt(pdata.newQuantity),
        type: pdata.type,
      },

    });
    const inventoryItem = await prisma.inventory.findUnique({
      where: { itemID: id }
  });
  
  console.log('Inventory Item from DB:', inventoryItem);
    if(inventory){
      res.status(200).json({
        status_code: 200,
        message: "Product updated",
        inventory: inventory,
      });
    } else {
      res.status(200).json({
        status_code: 200,
        message: "Product not found",
        inventory: [],
      });
    }
  });

  router.get("/get_product/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    const inventory = await prisma.inventory.findUnique({
      where: {
        itemID: id,
      },
    });
    if(inventory){
      res.status(200).json({
        status_code: 200,
        message: "Product found",
        inventory: inventory,
      });
    } else {
      res.status(200).json({
        status_code: 200,
        message: "Product not found",
        inventory: [],
      });
    }
  });
  router.delete("/delete_all", async (req, res) => {
    const inventory = await prisma.inventory.deleteMany();
    if(inventory){
      res.status(200).json({
        status_code: 200,
        message: "All products deleted",
        inventory: inventory,
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

