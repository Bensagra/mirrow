import { jwtControllers } from "../utilities/export_routes";
import prisma from "../client";

const login = async (req: any, res: any) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || jwtControllers.decryptPassword(user.password) !== password) {
            return res.status(401).json({ message: "Usuario o contraseña incorrecta" });
        }

        return res.status(200).json({ message: "Usuario logueado" });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

const register = async (req: any, res: any) => {
    const { email, password, address, name, phone, role, surname } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: "El usuario ya existe" });
        }

        const encryptedPassword = jwtControllers.encryptPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: encryptedPassword,
                address,
                name,
                phone,
                role,
                surname,
            },
        });

        return res.status(201).json({ message: "Usuario creado", user: newUser.id });

    } catch (error) {
        console.error("Error en register:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const userControllers = {
    login,
    register
}
