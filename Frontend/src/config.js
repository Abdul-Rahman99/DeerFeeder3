module.exports = {
  api: {
    //Live
    // API_URL: "http://bf.okab.ae:8080",
    // SOCKET_API_URL: "http://bf.okab.ae:8081",

    // docker Live
    // API_URL: "https://dccme.ae:3001",
    // SOCKET_API_URL: "https://dccme.ae:3002",

    // docker Live
    // API_URL: "http://91.72.155.42:3001",
    // SOCKET_API_URL: "http://91.72.155.42:3002",

    // API_URL: "https://mngar.ae:3001",
    // SOCKET_API_URL: "https://mngar.ae:3002",

    API_URL: process.env.REACT_APP_API_URL,
    SOCKET_API_URL: process.env.REACT_APP_SOCKET_API_URL,

    //Localhsot
    // API_URL: "http://localhost:3001",
    // SOCKET_API_URL: "http://localhost:3002",
  },
};
