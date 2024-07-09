import { Router } from "express";
import prisma from "../data/prisma";

const router = Router();

const products: Object[] = [];

router.post("/add_product", async (req, res) => {
    console.log("Connect to server successfully");
    console.log(req.body);
    const pdata = req.body;
    let isTrue = false;
    console.log(pdata.name);
    try {
    const newInventory = await prisma.inventory.create({
      data: {
        itemName: pdata.name,
        itemSize: pdata.size,
        itemDescription: pdata.description,
        checkInDate: pdata.checkInDate,
        location: pdata.location,
        itemStatus:isTrue,
        itemQuantity: parseInt(pdata.quantity),
        itemID: parseInt(pdata.id),
        type: pdata.type,
      },
    });

    products.push(pdata);
    res.status(200).json({
      status_code: 200,
      message: "Product created",
      inventory: newInventory,
    });
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
  });
  
  router.get("/get_products", async (req, res) => {
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
    const pdata = req.body;
    console.log(id);
    const inventory = await prisma.inventory.update({
      where: {
        itemID: id,
      },
      data: {
        itemName: pdata.name,
        itemSize: pdata.size,
        itemDescription: pdata.description,
        checkInDate: pdata.checkInDate,
        location: pdata.location,
        itemStatus: pdata.status,
        itemQuantity: parseInt(pdata.quantity),
        type: pdata.type,
      },
    });
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

  // router.post("/test_add", async (req, res) => {
  //   // prisma.$connect();
  //   console.log("Connect to server successfully");
  //   // console.log(req.body);
  //   // const pdata = req.body;
  //   let isTrue = false;
  //   // console.log(pdata.name);
  //   try{
  //   const newInventory = await prisma.inventory.create({
  //     data: {
  //       itemName: "pdata.name",
  //       itemSize: "pdata.size",
  //       itemDescription: "pdata.description",
  //       checkInDate: "pdata.checkInDate",
  //       location: "pdata.location",
  //       itemStatus:true,
  //       itemQuantity: 100,
  //       itemID:102,
  //       type: "pdata.type",
  //     },
  //   });
  //   res.status(200).json({
  //     status_code: 200,
  //     message: "Product created",
  //     inventory: newInventory,
  //   });

  // }catch(err){
  //   console.log(err);
  // }
  //   // products.push(pdata);
  // });
export default router;