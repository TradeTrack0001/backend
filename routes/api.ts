import { Router } from "express";
import prisma from "../data/prisma.js";

const router = Router();

const products: Object[] = [];

router.post("/add_product", async (req, res) => {
  try {

    const pdata = req.body;
    let isTrue = false; 

    const newInventory = await prisma.inventory.create({
      data: {
        itemName: pdata.itemName,
        itemSize: pdata.itemSize,
        itemDescription: pdata.itemDescription,
        checkInDate: pdata.checkInDate,
        location: pdata.location,
        itemStatus:pdata.itemStatus,
        itemQuantity: parseInt(pdata.itemQuantity),
        // itemID: parseInt(pdata.itemID),
        type: pdata.type,
        workspaceId: pdata.workspaceId,
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
    const id = (req.params.id);

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
    const id = (req.params.id);

    const pdata = req.body;

    const inventory = await prisma.inventory.update({
      where: {
        itemID: id, 
      },
      data: {
        itemName: pdata.name,
        itemDescription: pdata?.description,
        itemSize: pdata?.itemSize,
        checkInDate: pdata?.checkInDate,
        checkOutDate: pdata?.checkOutDate,
        location: pdata.location,
        itemQuantity: parseInt(pdata.itemQuantity),
        type: pdata.type,
      },

    });
    const inventoryItem = await prisma.inventory.findUnique({
      where: { itemID: id }
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
    const id = (req.params.id);
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

  // router.delete("/delete_all", async (req, res) => {
  //   const inventory = await prisma.inventory.deleteMany();
  //   if(inventory){
  //     res.status(200).json({
  //       status_code: 200,
  //       message: "All products deleted",
  //       inventory: inventory,
  //     });
  //   } else {
  //     res.status(200).json({
  //       status_code: 200,
  //       message: "No products found",
  //       inventory: [],
  //     });
  //   }
  // });

  router.put("/checkin/:id", async (req, res) => {
    const id = (req.params.id);
    const pdata = req.body;
    console.log("This is the data: ", pdata);
    const inventory = await prisma.inventory.findUnique({
      where: {
        itemID: id,
      },
    });
    if(inventory){
      const newQuantity = inventory.itemQuantity + parseInt(pdata.checkInQuantity);

      await prisma.inventory.update({
        where: {
          itemID: id, 
        },
        data: {
          itemQuantity: newQuantity
        },
  
      });

      res.status(200).json({
        status_code: 200,
        message: "Product checked in",
        inventory: inventory,
      });
    } else {
      res.status(200).json({
        status_code: 200,
        message: "Product not found",
        inventory: [],
      });
    }
  }
  );

  router.put("/checkout/:id", async (req, res) => {
    const id = (req.params.id);
    const pdata = req.body;
    console.log("This is the data: ", pdata);
    const inventory = await prisma.inventory.findUnique({
      where: {
        itemID: id,
      },
    });
    if(inventory){
      const newQuantity = inventory.itemQuantity - parseInt(pdata.checkOutQuantity);
      await prisma.inventory.update({
        where: {  
          itemID: id,
        },
        data: {
          itemQuantity: newQuantity
        },
      }); 
      res.status(200).json({
        status_code: 200,
        message: "Product checked out",
        inventory: inventory,
      });
    } else {
      res.status(200).json({
        status_code: 200,
        message: "Product not found",
        inventory: [],
      });
    }
  }
);

export default router;

