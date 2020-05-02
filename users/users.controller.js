const UserModel = require('./users.model');
const crypto = require('crypto');

// Cria um usuário na API
exports.insert = (req, res) => {
	let salt = crypto.randomBytes(16).toString('base64');
	let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
	req.body.password = salt + "$" + hash; 
	req.body.permissionLevel = 1;
	UserModel.createUser(req.body)
		.then((result) => {
			res.status(201).send({ id: result._id }); 
		})
}; 

// Encontra um usuário a partir do id
exports.getById = (req, res) => {
	let id = req.params.userId; 
	UserModel.findById(id)
		.then((result) => {
			res.status(200).send(result); 
		})
}

// Atualização de usuário
exports.patchById = (req, res) => {
   if (req.body.password){
       let salt = crypto.randomBytes(16).toString('base64');
       let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
       req.body.password = salt + "$" + hash;
   }
   UserModel.patchUser(req.params.userId, req.body).then((result) => {
           res.status(200).send({ sucess: "Usuário atualizado com sucesso!" });
   });
};

// Lista de usuários
exports.list = (req, res) => {
   let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
   let page = 0;
   if (req.query) {
       if (req.query.page) {
           req.query.page = parseInt(req.query.page);
           page = Number.isInteger(req.query.page) ? req.query.page : 0;
       }
   }
   UserModel.list(limit, page).then((result) => {
       res.status(200).send(result);
   })
};

// Exclusão de registro de usuário
exports.removeById = (req, res) => {
   UserModel.removeById(req.params.userId)
       .then((result) => {
           res.status(200).send({ sucess: "Usuário excluído com sucesso!" });
       });
};