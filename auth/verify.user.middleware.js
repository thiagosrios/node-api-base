const UserModel = require('../users/users.model');
const crypto = require('crypto');

// Verifica dados de requisição para autenticação
exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            // return res.status(400).send({errors: errors.join(',')});
            return res.status(400).send({ errors: errors });
        } else {
            return next();
        }
    } else {
        return res.status(400).send({ errors: 'Missing email and password fields' });
    }
};

// Busca usuáriio por e-mail e valida senha 
exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((result) => {
            let user = result[0]; 
            if(!user){
                res.status(404).send({ message: "Usuário não encontrado" });
            } else {
                let passwordFields = user.password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user._id,
                        email: user.email,
                        permissionLevel: user.permissionLevel,
                        provider: 'email',
                        name: user.firstName + ' ' + user.lastName,
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: ['Invalid email or password']});
                }
            }
        });
};