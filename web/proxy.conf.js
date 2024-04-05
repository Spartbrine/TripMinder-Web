/** 
 * @see https://angular.io/guide/build#proxying-to-a-backend-server
 * @see https://angular.io/guide/build#proxy-multiple-entries 
 */
const PROXY_CONFIG = [{
    context: [
        "/api/",
    ],
    //target: "http://localhost:8000",
    target: "http://127.0.0.1:8000",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
}]

module.exports = PROXY_CONFIG;