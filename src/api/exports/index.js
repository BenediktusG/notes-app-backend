const ExportsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'exports',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const exportHandler = new ExportsHandler(service, validator);
        await server.route(routes(exportHandler));
    }
}