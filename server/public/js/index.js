
// const socket = io('http://127.0.0.1:3000/menu');
const HOST = 'http://127.0.0.1:3000';

// axios
//   .get('http://127.0.0.1:3000/', {
//     headers: { clientId },
//   })
//   .then((res) => {
//     console.log(res);
//   });

// if (window.localStorage.getItem('menuClient')) {
//   socket.emit('authenticate', window.location.getItem('menuClient'));
// }

// socket.emit('authenticate', 'my token');

axios.defaults.baseURL = HOST;

function init() {
  let token = window.localStorage.getItem('Authorization');
  if (!token) {
    axios.get('/authenticate').then((res_token) => {
      window.localStorage.setItem('Authorization', res_token);
      axios.defaults.headers.common['Authorization'] = res_token;
      token = res_token;
    });
  } else {
    axios.defaults.headers.common['Authorization'] =
      window.localStorage.getItem('Authorization');
  }
  return io(HOST, {
    extraHeaders: {
      Authorization: token,
    },
  });
}

function setDishes() {}
function handleDishChangeEvent(dishEvent) {}
function handlePaymentCompleted(paymanrEvent) {}
function handleJoinTable(tableEvent) {}
function handleTableLeave(tableLEaveEvent) {}

function configureSocket(socket) {
  socket.on('joinTable', handleJoinTable);
  socket.on('dishSelectChange', handleDishChangeEvent);
  socket.on('paymentCompleted', handlePaymentCompleted);
  socket.on('leaveTable', handleTableLeave);
}

async function main() {
  const socket = init();
  axios.get('/').then(setDishes);
  configureSocket(socket);
}
main();
