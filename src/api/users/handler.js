const ClientError = require("../../exceptions/ClientError");

class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
        this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
    }

    async postUserHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload);
            const { username, password, fullname } = request.payload;

            const userId = await this._service.addUser({username, password, fullname});
            
            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    userId: userId,
                }
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
        }
    }

    async getUserByIdHandler(request, h) {
        try {
            const { id } = request.params;

            const user = await this._service.getUserById(id);

            const response = h.response({
                status: 'success',
                data: {
                    user:user,
                }
            });
            response.code(200);
            return response;
        } catch(error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
        }
    }

    async getUsersByUsernameHandler(request, h) {
        try {
            const { username = '' } = request.query;
            const users = await this._service.getUsersByUsername(username);
            return {
                status: 'success',
                data: {
                    users,
                }
            };
        } catch(error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
              });
              response.code(500);
              console.error(error);
              return response;
        }
    }
}

module.exports = UsersHandler;