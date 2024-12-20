import { PrismaClient } from "@prisma/client";


const getClothes = async (req: any, res: any, prisma: PrismaClient) => {
    try {
        const products = await prisma.clothes.findMany({
           
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
        return res.status(200).json(finalClothes);
    } catch (error) {
        console.error("Error en getProducts:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


export const clothesControllers = {
   getClothes,
}