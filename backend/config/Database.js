import { Sequelize } from "sequelize";

const db = new Sequelize('open_payroll_dev', 'root', '', {
    host: "localhost",
    dialect: "mysql",
});

export default db;