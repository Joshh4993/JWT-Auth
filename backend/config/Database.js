import { Sequelize } from "sequelize";

const db = new Sequelize('project_dev', 'root', '', {
    host: "localhost",
    dialect: "mysql",
});

export default db;