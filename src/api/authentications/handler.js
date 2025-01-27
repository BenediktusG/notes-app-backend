const ClientError = require("../../exceptions/ClientError");

class AuthenticationsHandler {
    constructor(authenticationsService, userService, tokenManager, validator) {
        this._authenticationService = authenticationsService;
        this._userService = userService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, h) {
        try {
            this._validator.validatePostAuthenticationPayload(request.payload);
            
            const { username, password } = request.payload;
            const id = await this._userService.verifyUserCredential(username, password);
            
            const accessToken = this._tokenManager.generateAccessToken({id});
            const refreshToken = this._tokenManager.generateRefreshToken({id});

            await this._authenticationService.addRefreshToken(refreshToken);

            const response = h.response({
                status: 'success',
                message: 'Authentication berhasil ditambahkan',
                data: {
                    accessToken,
                    refreshToken,
                },
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

    async putAuthenticationHandler(request, h) {
        try {
            this._validator.validatePutAuthenticationPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authenticationService.verifyRefreshToken(refreshToken);
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

            const accessToken = this._tokenManager.generateAccessToken({id});
            return {
                status: 'success',
                message: 'Access token berhasil diperbarui',
                data: {
                    accessToken,
                },
            }; 
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

    async deleteAuthenticationHandler(request, h) {
        try {
            this._validator.validateDeleteAuthenticationPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authenticationService.verifyRefreshToken(refreshToken);
            await this._authenticationService.deleteRefreshToken(refreshToken); 
            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus',
            };

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
}

module.exports = AuthenticationsHandler;