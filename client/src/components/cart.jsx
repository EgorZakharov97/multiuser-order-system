import React, { useState, useEffect } from 'react'
import CartItem from './cartItem'
import CartItemPrev from './cartItemPrev';

export default function Cart(props) {

  const [total, setTotal] = useState(0)
  
  useEffect(() => {
    let all = 0;
    props.items.map((item) => {
      all += item.dish.price * item.quantity;
      return 0;
    })
    setTotal(all)
  }, [props.items, total])

  return (
    <div className="panel-control-right">
      <div id="slide-out-right" className="side-nav">
        {
          props.items && props.items.length >= 1 && props.items.map((item) => {
            if (item.status <= 0) return (
              <CartItem
                id={item.dish.id}
                name={item.dish.name}
                price={item.dish.price}
                quantity={item.quantity}
                onCartRemove={props.onCartRemove}
              />
            )
            else return (
              <CartItemPrev
                id={item.dish.id}
                name={item.dish.name}
                price={item.dish.price}
                quantity={item.quantity}
                status={item.status}
              />
            )
          })
        }
        <div className="row price">
          <div className="col s8">
            <h6>Total</h6>
          </div>
          <div className="col s4">
            <h6>${total}</h6>
          </div>
        </div>
        <ul>
          <li>
            <button onClick={props.onConfirm} className="button">Confirm Choice</button>
          </li>
          <li>
          </li>
        </ul>
      </div>
    </div>
  )
}