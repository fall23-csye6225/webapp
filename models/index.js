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


const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./usersModel.js')(sequelize, DataTypes);
db.assignments = require('./assignmentsModel.js')(sequelize, DataTypes);
db.submissions = require('./submissionsModel.js')(sequelize, DataTypes);

// db.users.hasMany(db.assignments, {
// 	foreignKey: 'id',
// 	as: 'assignment'
// });

db.assignments.belongsTo(db.users, {
	foriegnKey: 'id',
	as: 'user'
});

db.submissions.belongsTo(db.assignments, {
	foriegnKey: 'id',
	as: 'assignment_id'
})

db.submissions.belongsTo(db.users, {
	foriegnKey: 'id',
	as: 'user_id'
})


sequelize.authenticate()
.then(() => {
    console.log('connected...');
	return db.sequelize.sync({ force: false });
})
.then(async () => {
  console.log('Database schema synchronized');
  await run(db.users);
})
.catch(err => {
    console.log('Error' + err);
});


// db.sequelize.sync({force: false})
// .then(async () => {
//     console.log('Database schema synchronized');
// 	await run(db.users);
// })
// .catch((error) => {
// 	console.error('Error synchronizing database:', error);
// }); 







module.exports = db;

