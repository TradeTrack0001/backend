import { Router } from "express";


const router = Router();

const products: Object[] = [];

router.post("/add_product", (req, res) => {
    console.log("Connect to server successfully");
    console.log(req.body);
    const pdata = req.body;
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