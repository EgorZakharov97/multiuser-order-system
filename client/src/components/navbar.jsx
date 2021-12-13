import React from 'react'

export default function Navbar(props) {
  return (
    <div className="navbar">
		<div className="container">
			<div className="panel-control-left">
				{/* <a href="#" data-activates="slide-out-left" className="sidenav-control-left"><i className="fa fa-bars"></i></a> */}
			</div>
			<div className="site-title">
				<a href="index.html" className="logo"><h1>Delicious</h1></a>
			</div>
			<div className="panel-control-right">
				<a href="#" data-activates="slide-out-right" className="sidenav-control-right"><i className="fa fa-shopping-bag"></i><span>{props.numItems}</span></a>
			</div>
		</div>
	</div>
  )
}