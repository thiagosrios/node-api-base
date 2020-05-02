/**
 * Módulo para conexão com fonte de dados
 */
var mongoose = require('mongoose');
var config = require('../config/env.config.js');

/**
 * Configuração do schema e conexão com o banco
 */
const Schema = mongoose.Schema;
var db = mongoose.connection;
mongoose.connect(config.datasource, { useNewUrlParser: true });

db.on('error', console.error.bind(console, 'Erro de conexão:'));
db.once('open', function() {});

/**
 * Retorna instância do objeto model a ser usado nas classes de model a partir de schema especificado
 * 
 * @param model Nome do model a ser utilizado 
 * @param schema Objeto contendo schema/definição da tabela/documento
 * @return Model para manipulação dos dados na camada model
 */
exports.getModel = (model, schema) => {
	const modelSchema = new Schema(schema);
	return mongoose.model(model, modelSchema);
}

/**
 * Retorna instância de conexão com a fonte de dados
 *
 * @return db Instância de conexão com o banco
 */
exports.getConnection = () => {
	return db; 
}