
export const config = () => ({
    app_run_port: process.env.APP_RUN_PORT || 8000,
    app_run_https: process.env.APP_RUN_HTTPS || false,
    secret_key_access_token: process.env.JTW_SECRET_KEY_ACCESS_TOKEN || 'secret-access-token-Key',
    secret_key_refresh_token: process.env.JTW_SECRET_KEY_REFRESH_TOKEN || 'secret-refresh-token-Key',
    access_token_seconds_live: parseInt(process.env.JTW_ACCESS_TOKEN_SECONDS_LIVE) || 1800, // 30 minutes
    refresh_token_seconds_live: parseInt(process.env.JTW_REFRESH_TOKEN_SECONDS_LIVE) || 604800, // 7 days
    name_cookie_access_token: process.env.JWT_NAME_COOKIE_ACCESS_TOKEN || 'access_token',
    name_cookie_refresh_token: process.env.JWT_NAME_COOKIE_REFRESH_TOKEN || 'refresh_token',
    var_name_user_after_decode_token: process.env.VAR_NAME_USER_AFTER_DECODE_TOKEN || 'user_from_token',
});
