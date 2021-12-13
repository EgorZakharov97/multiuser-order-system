import React from 'react'

export default function CartItemPrev(props) {

  const getStatus = (int) => {
    switch(int) {
      case 0:
        return 'Selected';
      case 1:
        return 'Ordered';
      case 2:
        return 'Cooking';
      case 3:
        return 'Serving';
      case 4:
        return 'Served';
      default:
        return 'Unknown';
    }
  }

  return (
    <div className="row entry">
      <div className="col s4">
      </div>
      <div className="col s6">
        <div className="desc">
          <h6>{props.name}</h6><h6>x{props.quantity}</h6>
          <div className="rating">
            { getStatus(props.status) }
          </div>
          <h6><span>${props.price}</span></h6>
        </div>
      </div>
    </div>
  )
}