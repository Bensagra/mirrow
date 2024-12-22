import { jwtControllers } from "../utilities/export_routes";
import * as validator from 'email-validator';
import { sendVerificationEmail } from "../utilities/emailVerification";
import { randomUUID } from "crypto";
import { sendResetPasswordEmail } from "../utilities/passwordReset";
import { PrismaClient } from "@prisma/client";

const login = async (req: any, res: any, prisma: PrismaClient ) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log(jwtControllers.decryptPassword(user!.password), password);

        if (!user || jwtControllers.decryptPassword(user.password) !== password) {
            return res.status(402).json({ message: "Usuario o contraseña incorrecta" });
        }
        if (!user.verified) {
            return res.status(401).json({ message: "Usuario no verificado" });}

        return res.status(200).json({ message: "Usuario logueado" });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error en el servidor", data: error, valid:false });
    }
}

const register = async (req: any, res: any, prisma: PrismaClient ) => {
    const { email, password, address, name, phone, role, surname } = req.body;
    if (!validator.validate(email)) {
        return res.status(400).json({ message: "Email invalido", data: {}, valid:false });
        
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: "El usuario ya existe", data: {}, valid:false });
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
      let data = await sendVerificationEmail(email, (name+" "+surname), newUser.verificationToken);
      console.log(data);
      if (!data) {
        return res.status(500).json({ message: "No hay data", data: data, valid:false });
        
      }

        return res.status(201).json({ message: "Usuario creado", user: newUser.id, valid:true });

    } catch (error) {
        console.error("Error en register:", error);
        return res.status(500).json({ message: "Error en el servidor", data: error, valid:false });
    }
}


const verify = async (req: any, res: any, prisma: PrismaClient ) => {
    const {uuid} = req.body;
    console.log(uuid);

    try {
        const user = await prisma.user.update({
            where: {
                verificationToken: uuid
            },
        
        data:{
            verified: true,
            verificationToken: randomUUID()
           
        }});

        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(500).json({success: false, error: error});
    }

    
    
}



const requestPasswordReset = async (req: any, res: any, prisma: PrismaClient ) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        await sendResetPasswordEmail(user.email, user.name, user.verificationToken);
        

        // Send email with resetToken

        return res.status(200).json({ message: "Email enviado" });

    } catch (error) {
        console.error("Error en requestPasswordReset:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


const resetPassword = async (req: any, res: any, prisma: PrismaClient ) => {
    const { resetToken, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { verificationToken: resetToken },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const encryptedPassword = jwtControllers.encryptPassword(password);

        await prisma.user.update({
            where: { verificationToken: resetToken },
            data: {
                password: encryptedPassword,
                verificationToken: randomUUID(),
            },
        });

        return res.status(200).json({ message: "Contraseña actualizada" });

    } catch (error) {
        console.error("Error en resetPassword:", error);
        return res.status(500).json({ message: "Error en el servidor", error });
    }
}




export const userControllers = {
    login,
    register,
    verify,
    requestPasswordReset,
    resetPassword,
}
