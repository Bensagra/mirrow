import { Router } from "express";
import {userControllers}  from "./controllers/user_controllers";
import { clothesControllers } from "./controllers/product_controllers";
import prisma from "../src/client";





const router = Router();

router.post("/users/register",(req,res)=>userControllers.register(req,res,prisma));
router.post("/users/login",(req,res)=>userControllers.login(req,res,prisma));
router.put("/users/verify",(req,res)=>userControllers.verify(req,res,prisma));
router.post("/users/requestPasswordReset",(req,res)=>userControllers.requestPasswordReset(req,res,prisma));
router.put("/users/resetPassword",(req,res)=>userControllers.resetPassword(req,res,prisma));


router.get("/clothes",(req,res)=>clothesControllers.getClothes(req,res, prisma));
export default router;