import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [data, setData] = useState({
        userId: "",
        userEmail: "",
        ubicationUni: ""
    });

    const { 
        getTotalCartAmount, 
        token, 
        food_list, 
        cartItems, 
        setCartItems, 
        userId, 
        userEmail, 
        userName, 
        userLastName 
    } = useContext(StoreContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Effect triggered");
        console.log("Token:", token);
        console.log("UserId:", userId);
        console.log("UserEmail:", userEmail);

        if (!token) {
            toast.error("Para realizar un pedido, por favor inicie sesión primero.");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        } else {
            setData(data => ({ ...data, userId, userEmail }));
        }
    }, [token, getTotalCartAmount, navigate, userId, userEmail]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        try {
            let orderItems = [];
            food_list.forEach((item) => {
                if (cartItems[item._id] > 0) {
                    let itemInfo = {
                        name: item.name,
                        price: item.price,
                        quantity: cartItems[item._id]
                    };
                    orderItems.push(itemInfo);
                }
            });

            let orderData = {
                userId: data.userId,
                userEmail: data.userEmail,
                items: orderItems,
                amount: getTotalCartAmount() + 5,
                ubicationUni: data.ubicationUni,
            };

            console.log("Order Data:", orderData);

            let response = await axios.post("https://localhost:7139/api/Order/placeOrder", orderData, {
                headers: { token }
            });

            food_list.forEach(item => {
                if (cartItems[item._id] > 0) {
                    delete cartItems[item._id];
                }
            });

            toast.success("Pedido realizado con éxito.");
            navigate("/myorders");

        } catch (error) {
            console.error("Error placing order:", error);
            if (error.response) {
                toast.error(`Error: ${error.response.status} - ${error.response.data}`);
            } else {
                toast.error("Algo salió mal.");
            }
        }
    };

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Información del Pedido</p>
                <h4>Id</h4>
                <input type="text" name='userId' value={data.userId} placeholder='Id' required readOnly />
                <h4>Nombre(s)</h4>
                <input type="text" name='userName' value={userName} placeholder='Nombre' readOnly />
                <h4>Apellido(s)</h4>
                <input type="text" name='userLastName' value={userLastName} placeholder='Apellido' readOnly />
                <h4>Correo Institucional</h4>
                <input type="text" name='userEmail' value={userEmail} placeholder='Correo' readOnly />
                <h4>Ubicación</h4>
                <input type="text" name='ubicationUni' onChange={onChangeHandler} value={data.ubicationUni} placeholder='Ubicación' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Totales del carrito</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>Bs {getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Gastos de Envío</p><p>Bs {getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>Bs {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b></div>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>Proceder al Pedido</button>
            </div>
        </form>
    );
}

export default PlaceOrder;
