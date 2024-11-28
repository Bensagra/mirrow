import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const encodeToken = (payload: Object) => {
    console.log(process.env.SECRET_KEY);
  return jwt.sign(payload, process.env.SECRET_KEY as string);}

export const decodeToken = (payload: string) => {
    console.log(process.env.SECRET_KEY);
  return jwt.verify(payload, process.env.SECRET_KEY as string)}

export const encryptPassword = (password: String) => {
  return jwt.sign(password, process.env.USER_KEY as string)};

export const decryptPassword = (token: string) => {
    return jwt.verify(token, process.env.USER_KEY as string)};


    export const jwtControllers = {
        encodeToken,
        decodeToken,
        encryptPassword,
        decryptPassword
    }
