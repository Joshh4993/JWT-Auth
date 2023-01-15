import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access_flags: {
        type: DataTypes.JSON,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    projects: {
        type: DataTypes.JSON
    },
    custom_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Users;