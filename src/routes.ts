import { Router, Request, Response } from "express";
import { userControllers } from "./controllers/user_controllers";
import { clothesControllers } from "./controllers/product_controllers";
import prisma from "../src/client";

const router = Router();

// Rutas para usuarios
router.post("/users/register", (req: Request, res: Response) =>
    userControllers.register(req, res, prisma)
);
router.post("/users/login", (req: Request, res: Response) =>
    userControllers.login(req, res, prisma)
);
router.put("/users/verify", (req: Request, res: Response) =>
    userControllers.verify(req, res, prisma)
);
router.post("/users/requestPasswordReset", (req: Request, res: Response) =>
    userControllers.requestPasswordReset(req, res, prisma)
);
router.put("/users/resetPassword", (req: Request, res: Response) =>
    userControllers.resetPassword(req, res, prisma)
);

// Rutas para ropa
router.get("/clothes", (req: Request, res: Response) =>
    clothesControllers.getClothes(req, res, prisma)
);
router.put("/clothes/updateStock", (req: Request, res: Response) =>
    clothesControllers.updateStock(req, res, prisma)
);
router.post("/clothes/create", (req: Request, res: Response) =>
    clothesControllers.createClothes(req, res, prisma)
);

export default router;
