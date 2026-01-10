// import { getProducts } from '../../src/utils/api/fashion-shop-2'
import api from "utils/api/fashion-shop-2";
export default async function handler(req, res){
    //  ("Resoponse of Staus Before",res)
    //   ("Request",req)
     ("-------------------------------------------------------------")
    const data = await api.getProducts()
     ("Resoponse of getProducts inside helper ",data)
	res.status(200).json(data)
     ("Resoponse of Staus After",res)

}