
export const config = () => ({
    api_ui_detect_url: process.env.API_UI_DETECT_URL || 'http://localhost:5000/detect',
    app_run_port: process.env.APP_RUN_PORT || 8000,
    secret_key_access_token: process.env.JTW_SECRET_KEY_ACCESS_TOKEN || 'secret-access-token-Key',
    secret_key_refresh_token: process.env.JTW_SECRET_KEY_REFRESH_TOKEN || 'secret-refresh-token-Key',
    access_token_seconds_live: parseInt(process.env.JTW_ACCESS_TOKEN_SECONDS_LIVE) || 1800, // 30 minutes
    refresh_token_seconds_live: parseInt(process.env.JTW_REFRESH_TOKEN_SECONDS_LIVE) || 604800, // 7 days
    name_cookie_access_token: 'access_token',
    name_cookie_refresh_token: 'refresh_token',
    var_name_user_after_decode_token:'user_from_token',
    database_type: process.env.DATABASE_TYPE || 'mysql',
    database_host: process.env.DATABASE_HOST || 'localhost',
    database_port: parseInt(process.env.DATABASE_PORT) || 3306,
    database_username: process.env.DATABASE_USERNAME || 'root',
    database_password: process.env.DATABASE_PASSWORD || '123456789',
    database_name: process.env.DATABASE_NAME || 'microservice_auth',
});
