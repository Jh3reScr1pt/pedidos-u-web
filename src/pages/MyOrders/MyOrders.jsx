import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data, setData] = useState([]);
  const { url_cs, userId } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url_cs}/api/Order/userOrders/${""+userId+""}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div className='my-orders'>
      <h2>Mis Órdenes</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt="" />
            <p>
              {order.items.map((item, index) => 
                `${item.name} x ${item.quantity}${index === order.items.length - 1 ? '' : ', '}`
              )}
            </p>
            <p>Bs {order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders;
