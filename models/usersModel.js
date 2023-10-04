module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,   
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