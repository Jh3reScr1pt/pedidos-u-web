import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000"; // Express - Microservicios de comidas
  const url_cs = "https://localhost:7139"; // C# - Microservicio de ordenes
  const url_sb = "http://localhost:8080"; // Spring Boot - Microservicio de usuarios
  const [food_list, setFoodList] = useState([]);
  const [category_list, setCategoryList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(""); // Estado para almacenar el ID del usuario
  const [userName, setUserName] = useState(""); // Estado para almacenar el ID del usuario
  const [userLastName, setUserLastName] = useState(""); // Estado para almacenar el ID del usuario
  const [userEmail, setUserEmail] = useState(""); // Estado para almacenar el ID del usuario

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/activelist");
    setFoodList(response.data.data);
  };

  const fetchCategoryList = async () => {
    const response = await axios.get(url + "/api/category/activelist");
    setCategoryList(response.data.data);
  };

  const fetchUserId = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/user/getUserId",
        {},
        { headers: { token } }
      );
      if (!response.data.success) {
        console.log("Algo salio mal");
        // localStorage.setItem("userId", response.data.data._id); // Ajuste aquí si el ID está en data
      }

      setUserId(response.data.data._id);
      setUserName(response.data.data.name);
      setUserLastName(response.data.data.lastname);
      setUserEmail(response.data.data.email);
      console.log(
        "Id Obtenido > " +
          userId +
          "\nNombre: " +
          userName +
          "\nEmail: " +
          userEmail
      );
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData || {});
  };

  useEffect(() => {
    async function loadData() {
      await fetchCategoryList();
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await fetchUserId(savedToken); // Corregido: enviar el token directamente
        await loadCartData(savedToken); // Corregido: enviar el token directamente
      }
    }
    loadData();
  }, []);
  useEffect(() => {
    if (userId) {
      console.log(
        "Id Obtenido > " +
          userId +
          "\nNombre: " +
          userName +
          "\nEmail: " +
          userEmail
      );
    }
  }, [userId, userName, userLastName, userEmail]);

  const contextValue = {
    url,
    url_cs,
    url_sb,
    food_list,
    category_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    fetchUserId,
    userId,
    userName,
    userLastName,
    userEmail,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
