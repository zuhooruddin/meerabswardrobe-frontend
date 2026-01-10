import axios from "axios";
import useSWR from 'swr';

const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE || process.env.BACKEND_API_BASE;

// Create axios instance with timeout to prevent hanging
const axiosInstance = axios.create({
  timeout: 10000, // 10 second timeout for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

const getProducts = async (slug) => {
  const url = server_ip+'getItemSearchCategory'
  if(slug!==undefined){
    try {
      const args = {'id':slug}
      let data = await axiosInstance.post(url,args).then((res) => res.data);
      return data
    } catch (error) {
      console.error('Error fetching products:', error.message);
      return null;
    }
  }
  return null
};

const getSectionProduct = async (slug2) => {
  const url = server_ip+'getItemSearchCategory'
  if(slug2!==undefined){
    try {
      const args = {'id':slug2}
      let data = await axiosInstance.post(url,args).then((res) => res.data);
      return data
    } catch (error) {
      console.error('Error fetching section products:', error.message);
      return null;
    }
  }
  return null
};



const GetWishlist = async () => {
    const fetcher =(url)=>axios.get(url,{headers: {Authorization: `Bearer ${session.accessToken}`}}).then(response=>response.data)
    const { data, error } = useSWR(server_ip+'getWishlist', fetcher)
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
  };

const getindvidualorderbox = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"webind");
    return response.data;
  } catch (error) {
    console.error('Error fetching individual order box:', error.message);
    return [];
  }
};

const getSectionSequence = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getsection");
    return response.data;
  } catch (error) {
    console.error('Error fetching section sequence:', error.message);
    return [];
  }
};

const getLatestProducts = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getFearuredProduct");
    return response.data;
  } catch (error) {
    console.error('Error fetching latest products:', error.message);
    return [];
  }
};

const getBundles = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getBundels");
    return response.data;
  } catch (error) {
    console.error('Error fetching bundles:', error.message);
    return [];
  }
};

const getBrandBundles = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getBrandBundels");
    return response.data;
  } catch (error) {
    console.error('Error fetching brand bundles:', error.message);
    return [];
  }
};

const getProductBundles = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getProductBundels");
    return response.data;
  } catch (error) {
    console.error('Error fetching product bundles:', error.message);
    return [];
  }
};

const getSlidersFromCloud = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getSlidersFromCloud");
    return response.data;
  } catch (error) {
    console.error('Error fetching sliders from cloud:', error.message);
    return [];
  }
};

const getSlidersFromLocal = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getsliderimage");
    return response.data;
  } catch (error) {
    console.error('Error fetching sliders from local:', error.message);
    return [];
  }
};

const getFooterItem = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getFooterSettings");
    return response.data;
  } catch (error) {
    console.error('Error fetching footer item:', error.message);
    return {};
  }
};

const getGeneralSetting = async () => {
  try {
    const response = await axiosInstance.get(server_ip+"getGeneralSetting");
    return response.data;
  } catch (error) {
    console.error('Error fetching general setting:', error.message);
    return [];
  }
};



// const getFeatureProducts = async () => {
//   const response = await axios.get("/api/fashion-shop-2/feature-products");
//   return response.data;
// };

// const getSaleProducts = async () => {
//   const response = await axios.get("/api/fashion-shop-2/sale-products");
//   return response.data;
// };

// const getPopularProducts = async () => {
//   const response = await axios.get("/api/fashion-shop-2/popular-products");
//   return response.data;
// };



// const getBestWeekProducts = async () => {
//   const response = await axios.get("/api/fashion-shop-2/best-week-products");
//   return response.data;
// };

// const getBlogs = async () => {
//   const response = await axios.get("/api/fashion-shop-2/blogs");
//   return response.data;
// }; // eslint-disable-next-line import/no-anonymous-default-export

export default {
  // getBlogs,
  getProducts,

  getBundles,
  getBrandBundles,
  getSectionProduct,
  getProductBundles,
  getLatestProducts,
  // getFeatureProducts,
  // getPopularProducts,
  // getBestWeekProducts,
  getindvidualorderbox,
  GetWishlist,
  getSectionSequence,
  getSlidersFromCloud,
  getSlidersFromLocal,
  getFooterItem,
  getGeneralSetting,
};
