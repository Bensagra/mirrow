import { jwtControllers } from "../utilities/export_routes";
import prisma from "../client";
import * as validator from 'email-validator';
import { sendVerificationEmail } from "../utilities/emailVerification";

const login = async (req: any, res: any) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || jwtControllers.decryptPassword(user.password) !== password) {
            return res.status(401).json({ message: "Usuario o contraseña incorrecta" });
        }
        if (!user.verified) {
            return res.status(401).json({ message: "Usuario no verificado" });}

        return res.status(200).json({ message: "Usuario logueado" });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

const register = async (req: any, res: any) => {
    const { email, password, address, name, phone, role, surname } = req.body;
    if (!validator.validate(email)) {
        return res.status(400).json({ message: "Email inválido" });
        
    }
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
      let data = await sendVerificationEmail(email, (name+" "+surname));
      console.log(data);
      if (!data) {
        return res.status(500).json({ message: data });
        
      }

        return res.status(201).json({ message: "Usuario creado", user: newUser.id });

    } catch (error) {
        console.error("Error en register:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


const verify = async (req: any, res: any) => {
    const {email} = req.body;
    try {
        const user = await prisma.user.update({
            where: {email: email},
        
        data:{
            verified: true
        }});
        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(500).json({success: false});
    }

    
    
}




export const userControllers = {
    login,
    register,
    verify
}
