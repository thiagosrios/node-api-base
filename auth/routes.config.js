const VerifyUserMiddleware = require('./verify.user.middleware');
const AuthValidationMiddleware = require('../common/auth.validation.middleware');
const AuthorizationController = require('./auth.controller');

exports.routesConfig = function (app) {
	app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.login
    ]);
}