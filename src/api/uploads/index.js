const UploadsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'uploads',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const updloadsHandler = new UploadsHandler(service, validator);
        server.route(routes(updloadsHandler));
    }
}