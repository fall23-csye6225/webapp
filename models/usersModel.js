module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true    
    },       
    first_name: {
    type: DataTypes.STRING
    },
    last_name: {
    type: DataTypes.STRING
    },
    email: {
    type: DataTypes.STRING
    },
    password: {
    type: DataTypes.STRING
    },
    account_created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    },
    account_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    }
    }, {tableName: 'users', timestamps: false});

    return Users;

    };