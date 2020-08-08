require("dotenv").config();

module.exports = {
	type: "postgres",
	host: process.env.TYPEORM_HOST,
	port: parseInt(process.env.TYPEORM_PORT, 10),
	username: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [
        "./src/modules/**/infra/typeorm/entities/*.ts"
    ],
	migrations: [
        "./src/shared/infra/typeorm/migrations/*.ts"
    ],
	cli: {
		migrationsDir: "./src/shared/infra/typeorm/migrations"
	},
};
