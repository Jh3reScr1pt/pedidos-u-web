import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreMenu = ({category,setCategory}) => {

  const {category_list, url} = useContext(StoreContext);
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explora nuesto menú</h1>
      <p className='explore-menu-text'>Elija entre un menú variado que ofrece una deliciosa variedad de platos. Nuestra misión es satisfacer sus antojos y mejorar su experiencia gastronómica mientras estudias, una comida deliciosa a la vez..</p>
      <div className="explore-menu-list">
        {category_list.map((item,index)=>{
            return (
                <div onClick={()=>setCategory(prev=>prev===item.name?"All":item.name)} key={index} className='explore-menu-list-item'>
                    <img src={url+"/images/"+item.image} className={category===item.name?"active":""} alt="" />
                    <p>{item.name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
