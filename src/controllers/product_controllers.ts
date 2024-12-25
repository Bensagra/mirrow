import { PrismaClient } from "@prisma/client";


const getClothes = async (req: any, res: any, prisma: PrismaClient)  => {
    
    try {
        const products = await prisma.clothes.findMany({
           where:{
            remove:false
           },
    include: {
        subType:{

            include: {
                type: true
        },},
        sizeStocks: {
            include: {

                size: true
            }
        },
    },
    });

   let finalClothes = products.map((product: any) => {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            subType: product.subType.name,
            type: product.subType.type.name,
            fabric: product.fabric,
            color: product.color,
            sizeStocks: product.sizeStocks.map((sizeStock: any) => {
                return{
                    size: sizeStock.size.name,
                    stock: sizeStock.stock,
                    sizeId: sizeStock.sizeId
                }
        })
        }
    });
        return res.status(200).json({ message: "Ropa descargada", data: finalClothes, valid:true });
    } catch (error) {
        console.error("Error en getProducts:", error);
        return res.status(500).json({ message: "Error en el servidor", data: error, valid:false });
    }



}

const updateStock = async (req: any, res: any, prisma: PrismaClient) => {
    const { sizeId, stock, clotheId } = req.body;
    try {
        const product = await prisma.clothesSizeStock.update({
            where: {
                clothesId_sizeId: {
                    clothesId: parseInt(clotheId),
                    sizeId: parseInt(sizeId)
                }
            },
            data: {
                stock: stock
            }
        });
        return res.status(200).json({ message: "Stock actualizado", data: product, valid:true });
    } catch (error) {
        console.error("Error en updateStock:", error);
        return res.status(500).json({ message: "Error en el servidor", data: error, valid:false });
    }
}

const createClothes = async (req: any, res: any, prisma: PrismaClient) => {
    const { name, price, description, image, subTypeId, fabric, color, typeId } = req.body;
    try {
        const product = await prisma.clothes.create({
            data: {
               color,
               description,
               fabric,
               image,
               name,
               price,
               typeId,
               subTypeId,
               
            }
        });
        return res.status(201).json({ message: "Producto creado", data: product, valid:true });
    } catch (error) {
        console.error("Error en createProduct:", error);
        return res.status(500).json({ message: "Error en el servidor", data: error, valid:false });
    }
}

const updateClothes = async (req: any, res: any, prisma: PrismaClient) => {
    const { name, price, description, image, subTypeId, fabric, color, typeId, clotheId } = req.body;
    try {
        const product = await prisma.clothes.update({
            where: {
                id: parseInt(clotheId)
            },
            data: {
                color,
                description,
                fabric,
                image,
                name,
                price,
                typeId,
                subTypeId,
            }
        });
        return res.status(200).json({ message: "Producto actualizado", data: product, valid:true });
    } catch (error) {
        console.error("Error en updateProduct:", error);
        return res.status(500).json({ message: "Error en el servidor", data: error, valid:false });
    }
}

const removeClothes = async (req:any,res:any,prisma:PrismaClient) => {
    const {clothesId} = req.body
    await prisma.clothes.update({
        where:{
            id: parseInt(clothesId)
        },
        data:{
            remove: true
        }
    })
}

export const clothesControllers =  {
   getClothes,
    updateStock,
    createClothes,
    updateClothes,
    removeClothes
}