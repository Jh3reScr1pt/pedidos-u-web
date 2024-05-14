import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [data, setData] = useState({
        userCI: "",
        ubicationId: ""
    })
    

    const { getTotalCartAmount, token, food_list, cartItems, url, url_cs, setCartItems } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        try {
            let orderItems = [];
            food_list.forEach((item) => {
                if (cartItems[item._id] > 0) {
                    let itemInfo = { // Asegúrate de que el id esté en el formato correcto
                        name: item.name,
                        price: item.price,
                        quantity: cartItems[item._id]
                    };
                    orderItems.push(itemInfo);
                }
            });
    
            let orderData = {
                userCI: data.userCI, // Asegúrate de que estás pasando el userCI correcto
                items: orderItems,
                amount: getTotalCartAmount() + 5,
                ubicationId: data.ubicationId, // Asegúrate de que estás pasando el ubicationId correcto
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
            
            toast.success("Order right");
            navigate("/myorders");

        } catch (error) {
            console.error("Error placing order:", error);
            if (error.response) {
                toast.error(`Error: ${error.response.status} - ${error.response.data}`);
            } else {
                toast.error("Something Went Wrong");
            }
        }
    };
    

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <input type="text" name='userCI' onChange={onChangeHandler} value={data.userCI} placeholder='CI' required />
                <input type="text" name='ubicationId' onChange={onChangeHandler} value={data.ubicationId} placeholder='Ubicacion' required />
                
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>${getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b></div>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>Proceed To Payment</button>
            </div>
        </form>
    )
}

export default PlaceOrder
