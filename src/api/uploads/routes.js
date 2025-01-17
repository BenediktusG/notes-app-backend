const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/images',
        handler: handler.postUploadImageHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 10000000,
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
            directory: {
                // eslint-disable-next-line no-undef
                path: path.resolve(__dirname, 'file'),
            }
        }
    }
];

module.exports = routes;