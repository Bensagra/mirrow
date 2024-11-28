import { Router } from "express";
import {userControllers}  from "./controllers/user_controllers";





const router = Router();

router.post("/users/register",(req,res)=>userControllers.register(req,res));
router.post("/users/login",(req,res)=>userControllers.login(req,res));
router.put("/users/verify",(req,res)=>userControllers.verify(req,res));
export default router;