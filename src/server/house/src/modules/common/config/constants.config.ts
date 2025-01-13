
export const config = () => ({
    app_run_port: process.env.APP_RUN_PORT || 50053,
    database_type: process.env.DATABASE_TYPE || 'mysql',
    database_host: process.env.DATABASE_HOST || 'localhost',
    database_port: parseInt(process.env.DATABASE_PORT) || 3306,
    database_username: process.env.DATABASE_USERNAME || 'username',
    database_password: process.env.DATABASE_PASSWORD || '123456789',
    database_name: process.env.DATABASE_NAME || 'microservice_house',
});
