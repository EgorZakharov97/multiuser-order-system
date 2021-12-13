import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import io from 'socket.io-client';
import * as axios from 'axios';
import Navbar from './components/navbar';
import Footer from './components/footer';
import MenuGrid from './components/menuGrid';
import MenuItem from './components/menuItem';
import Cart from './components/cart';

export default function App() {
  const HOST = 'https://menu.egorzakharov.live/api';
  // const HOST = 'http://127.0.0.1:3000/api';
  const request = axios.create({ baseURL: `${HOST}` })
  let socket;
  const [dishes, setDishes] = useState([]);
  const [selections, setSelections] = useState([]);

  function main() {
    init()
      .then(() => {
        request.get('/').then((res) => setDishes(res.data));
        configureSocket();
      })
  }

  useEffect(main, []);

  async function init() {
    let token = window.localStorage.getItem('Authorization');
    if (!token) {
      const res_token = await request.get('/authorize');
      window.localStorage.setItem('Authorization', res_token.data);
      request.defaults.headers.common['Authorization'] = res_token.data;
      token = res_token.data;
    } else {
      request.defaults.headers.common['Authorization'] =
        window.localStorage.getItem('Authorization');
    }
    socket = io(`${HOST}/menu`, {
      extraHeaders: {
        Authorization: token,
      },
    });
    socket.emit('joinTable', 7);
  }
  
  // UI
  function onSelectedItem(itemId={}, quantity) {
    checkSocket();
    socket.emit('dishSelect', { itemId, quantity })
  }

  function onConfirm() {
    checkSocket();
    socket.emit('confirmOrder', {});
  }
  
  // LOGIC
  function checkSocket() {
    if (!socket) throw new Error('Socket was not initialized!');
  }

  // SOCKET
  function handleDishChangeEvent(dishEvent) {
    setSelections(dishEvent);
  }
  function handlePaymentCompleted(paymanrEvent) {}
  function handleJoinTable(tableEvent) {
    alert('You have joined table 7!')
    setSelections(tableEvent.order.selections);
  }
  function handleTableLeave(tableLEaveEvent) {}
  function handleDishReadyStateChange(dishStateEvent) {}
  function handleConnectionConfirmation(connectionEvent) {}
  function handleError(errorEvent) {
    console.log(errorEvent)
  }
  function handleOrderConfirmed(confirmEvent) {
    setSelections(confirmEvent);
  }
  
  function configureSocket() {
    checkSocket();
    socket.on('joinTable', handleJoinTable);
    socket.on('makeSelection', handleDishChangeEvent);
    socket.on('confirmOrder', handleOrderConfirmed);
    socket.on('paymentCompleted', handlePaymentCompleted);
    socket.on('leaveTable', handleTableLeave);
    socket.on('dishReadyStateChange', handleDishReadyStateChange);
    socket.on('enterRestaurant', handleConnectionConfirmation);
    socket.on('error', handleError);
    socket.emit('enterRestaurant', {})
  }

  const makeSelection = useCallback((id, quantity) => {
    socket.emit('makeSelection', { id, quantity });
  }, []);

  const confirm = useCallback(() => {
    socket.emit('confirmOrder')
  }, [])

  return (
    <div style={{minHeight: '100vh'}} className="App">
      {/* <input id="input" type="text" /> */}
      <Navbar numItems={selections.length} />
      <MenuGrid>
        {
          dishes.map((dish) => {
            return (
              <MenuItem
                id={dish.id}
                name={dish.name}
                price={dish.price}
                addItem={makeSelection}
              />
            )
          })
        }
      </MenuGrid>
      <Cart
        onConfirm={confirm}
        items={selections}
        onCartRemove={makeSelection}
      />
      <Footer />
    </div>
  );
}
