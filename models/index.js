const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');
const run = require('../controllers/usersController.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER,
dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operationsAliases: false,
	pool: {
	max: dbConfig.pool.max,
	min: dbConfig.pool.min,
	acquire: dbConfig.pool.acquire,
	idle: dbConfig.pool.idle
	}
});

sequelize.authenticate()
.then(() => {
    console.log('connected...');
})
.catch(err => {
    console.log('Error' + err);
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./usersModel.js')(sequelize, DataTypes);
db.assignments = require('./assignmentsModel.js')(sequelize, DataTypes);


db.sequelize.sync({force: false})
.then(async () => {
    console.log('Database schema synchronized');
	await run(db.users);
})
.catch((error) => {
	console.error('Error synchronizing database:', error);
}); 


module.exports = db;

