import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {cartItems, food_list, removeFromCart,getTotalCartAmount,url} = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Plato</p> <p>Precio</p> <p>Cantidad</p> <p>Total</p> <p>Quitar</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id]>0) {
            return (<div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url+"/images/"+item.image} alt="" />
                <p>{item.name}</p>
                <p>Bs {item.price}</p>
                <div>{cartItems[item._id]}</div>
                <p>Bs {item.price*cartItems[item._id]}</p>
                <p className='cart-items-remove-icon' onClick={()=>removeFromCart(item._id)}>x</p>
              </div>
              <hr />
            </div>)
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Totales del carrito</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>Bs {getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Gastos de Envío</p><p>Bs {getTotalCartAmount()===0?0:5}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>Bs {getTotalCartAmount()===0?0:getTotalCartAmount()+5}</b></div>
          </div>
          <button onClick={()=>navigate('/order')}>CONTINUAR</button>
        </div>
        
      </div>
    </div>
  )
}

export default Cart
