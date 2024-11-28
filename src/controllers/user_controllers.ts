import {jwtControllers } from "../export_routes";
import prisma from "../client";

const login = (req: any, res: any) => {
    const { email, password } = req.body;
    const encryptedPassword = jwtControllers.decryptPassword(password);
    console.log(encryptedPassword);
    prisma.user.findUnique({
        where: {
            email: email,
            password: encryptedPassword as string
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
    const { email, password, address, name, phone, role, surname } = req.body;
    let encryptedPassword = jwtControllers.encryptPassword(password);
    console.log(encryptedPassword);
    prisma.user.create({
        data: {
            email: email as string,
            password: encryptedPassword as string,
            address: address as string,
            name: name as string,
            phone: phone as number,
            role: role as string,
            surname: surname as string,
        }
    }).then((user) => {
        res.status(201).json({ message: "Usuario registrado" });
    }).catch((error) => {
        res.status(500).json({error});
    });
}



export const userControllers = {
    login,
    register
}