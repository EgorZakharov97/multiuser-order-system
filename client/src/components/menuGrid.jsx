import React from 'react'
import MenuItem from './menuItem'

export default function MenuGrid(props) {
  
  const styles = {
    grid: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  }
  
  return (
    <div className="menu-grid app-pages app-section">
		<div className="container">
			<div className="pages-title">
				<h3>Menu</h3>
			</div>
			<div style={styles.grid}>
        {props.children}
			</div>
		</div>
	</div>
  )
}