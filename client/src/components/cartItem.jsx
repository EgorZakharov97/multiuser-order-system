import React from 'react'

export default function CartItem(props) {
  const setStars = () => {
    let numStars = Math.floor(Math.random() * 6);
    // eslint-disable-next-line no-unused-expressions
    numStars === 0 ? numStars += 1 : numStars;
    const stars = []
    for (let i=0; i<numStars; i++) {
      stars.push(<span id={i} className="active"><i className="fa fa-star"></i></span>)
    }
    for (let i=0; i<5-numStars; i++) {
      stars.push(<span id={i} className=""><i className="fa fa-star"></i></span>)
    }
    return stars;
  }

  return (
    <div className="row entry">
      <div className="col s4">
      </div>
      <div className="col s6">
        <div className="desc">
          <h6>{props.name}</h6><h6>x{props.quantity}</h6>
          <div className="rating">
            { setStars() }
          </div>
          <h6><span>${props.price}</span></h6>
        </div>
      </div>
      <div className="col s2">
        <div className="action">
          <button onClick={() => props.onCartRemove(props.id, 0)} className="fa fa-remove"></button>
        </div>
      </div>
    </div>
  )
}