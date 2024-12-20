import { Router } from "express";
import {userControllers}  from "./controllers/user_controllers";
import { clothesControllers } from "./controllers/product_controllers";





const router = Router();

router.post("/users/register",(req,res)=>userControllers.register(req,res));
router.post("/users/login",(req,res)=>userControllers.login(req,res));
router.put("/users/verify",(req,res)=>userControllers.verify(req,res));
router.post("/users/requestPasswordReset",(req,res)=>userControllers.requestPasswordReset(req,res));
router.put("/users/resetPassword",(req,res)=>userControllers.resetPassword(req,res));


router.get("/clothes",(req,res)=>clothesControllers.getClothes(req,res));
export default router;