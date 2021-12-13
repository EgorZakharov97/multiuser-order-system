import React from 'react'

export default function MenuItem(props) {

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

  const styles = {
    container: {
      width: '30%',
    },
    patch: {
      position: 'absolute',
      top: '0',
      right: '0',
    },
    icon: {
      paddingRight: '5px',
    }
  }

  return (
    <div style={styles.container} className="entry">
      <h6>{props.name}</h6>
      <div className="rating">
        { setStars() }
      </div>
      <div className="price">
        <h5>${props.price}</h5>
      </div>
      <button onClick={() => props.addItem(props.id, 1)} className="button">ADD TO CART</button>
    </div>
  )
}