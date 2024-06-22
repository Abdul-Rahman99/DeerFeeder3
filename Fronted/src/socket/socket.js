import { io } from 'socket.io-client';
import { api } from "../config";
// import { ss } from "socket.io-stream";
// "undefined" means the URL will be computed from the `window.location` object

var socket = io.connect(api.SOCKET_API_URL);
// const socket = io(URL, {
//     autoConnect: true
// });
// socket.connect();
export {
    socket
}