export const config = () => ({
    app_run_port: process.env.APP_RUN_PORT || 50054,
    database_type: process.env.DATABASE_TYPE || 'mysql',
    database_host: process.env.DATABASE_HOST || 'localhost',
    database_port: parseInt(process.env.DATABASE_PORT) || 3306,
    database_username: process.env.DATABASE_USERNAME || 'username',
    database_password: process.env.DATABASE_PASSWORD || '123456789',
    database_name: process.env.DATABASE_NAME || 'microservice_device',
    mqtt_address: process.env.MQTT_BROKER_ADDRESS || 'mqtt://localhost',
    mqtt_username: process.env.MQTT_BROKER_USERNAME || 'username',
    mqtt_password: process.env.MQTT_BROKER_PASSWORD || '123',
    mqtt_client_id: process.env.MQTT_CLIENT_ID || 'Server-1986283476',
});
