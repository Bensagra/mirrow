import {jwtControllers } from "../export_routes";
import prisma from "../client";

const login = (req: any, res: any) => {
    const { email, password } = req.body;
    const encryptedPassword = jwtControllers.encryptPassword(password);
    prisma.user.findUnique({
        where: {
            email: email,
            password: encryptedPassword
        }
    }).then((user) => {
        if (user) {
            res.status(200).json({ message: "Usuario logueado" });
        } else {
            res.status(401).json({ message: "Usuario o contraseña incorrecta" });
        }
    }).catch((error) => {
        res.status(500).json({ message: "Error en el servidor" });
    });
}

const register = (req: any, res: any) => {
    const { email, password, address, name, phone, role, surename } = req.body;
    const encryptedPassword = jwtControllers.encryptPassword(password);
    console.log(req.body);
    prisma.user.create({
        data: {
            email: email as string,
            password: encryptedPassword as string,
            address: address as string,
            name: name as string,
            phone: phone as number,
            role: role as string,
            surname: surename as string,
            
        }
    }).then((user) => {
        res.status(201).json({ message: "Usuario registrado" });
    }).catch((error) => {
        res.status(500).json({ message: "Error en el servidor" });
    });
}



export const userControllers = {
    login,
    register
}