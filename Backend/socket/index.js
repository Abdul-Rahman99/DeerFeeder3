const models = require("../models");
// const io = require('socket.io')(process.env.SOCKET_PORT, {
//     cors: {
//         origin: true,
//         optionsSuccessStatus: 200,
//         credentials: true,
//     },
//     maxHttpBufferSize: 1e8
// })
// const io = require('socket.io')(process.env.SOCKET_PORT)
const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: [
      //"https://mngar.ae:3002",
      //"https://mngar.ae:3001",
      "https://mngar.ae",
      //"https://mngar.ae:8080",
      //"https://www.mngar.ae",
      //'http://192.168.1.131:8080',
      "http://localhost:3000",
      "http://localhost:7000",
      //"http://gaztec.ddns.net:8080",
      //"http://92.98.78.202:8080",
      "http://192.168.1.7:1883",
      //"http://91.72.155.42:8080",
      "https://ghazaal.dccme.ai",
    ],
  },
  maxHttpBufferSize: 1e8,
});

io.setMaxListeners(0);
const postSocketMessage = (topic, message, feeder_id) => {
  if (!Object.keys(message || {}).length) return;

  io.emit("custom-event", topic, message, feeder_id);
  console.log("socket message: ", topic);
};
const postSocketNotification = (notifications) => {
  io.emit("notification", notifications);
  console.log("socket notification");
};

const splitStr = (str, separator) => {
  // Function to split string
  let string = str.split(separator);
  return string;
};

io.on("connection", (socket) => {
  console.log("Socket Connected. ID: " + socket.id);
  socket.on("custom-event", (topic, message) => {
    console.log("received socket message: ", topic, message);
    var client_topic = topic;
    // var client_message = message.toString()

    //publishMessage(topic, message);

    // Code to modify topic

    let splited_topic = splitStr(client_topic, "/");
    var topic_length = Object.keys(splited_topic).length;
    var getLastElem = splited_topic[topic_length - 1];

    if (topic_length == 4) {
      getLastElem =
        splited_topic[topic_length - 2] + "" + splited_topic[topic_length - 1];
    }

    let post = { message: message, topic: getLastElem };
    models.ServerMessages.create(post).catch((error) => {
      if (error) {
        console.log("error in creation commands" + error);
      }
    });
  });
});
module.exports = { io, splitStr, postSocketMessage, postSocketNotification };
