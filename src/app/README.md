
# Smartome Android App

## Prerequisites

- Node v20

## Installation

1. **Environment Setup**
   - Copy the environment configuration file:
     ```bash
     cp .env.example .env
     ```
   - Update the configuration values in `.env` according to your environment

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Running the Application

Start the server:
```bash
npm start
```

The server will be available at `http://localhost:65534` by default.

### Warning error when start
1. If an error related to `Error: EMFILE: too many open files, watch` appears, this error often occurs when using MacOS, then handle it as follows:

    -  Install file tracker
    ```terminal
    brew install watchman
    ```
    -  Delete `./node_modules`
    ```terminal
    rm -rf ./node_modules
    ```

    -  Reinstall node_modules
    ```terminal
    npm install
    ```

    -  Run app
    ```terminal
    npm start
    ```
## Open App With Navive Module On Real Android Device
Use the pre-built installation file at `./app_on_android_device`.

If you need to develop further and need to install other native modules, follow these steps:

1. Install dev-client
    ```terminal
    npm i expo-dev-client
    ```

2. Install the native module you want

    Example with `react-native-wifi-reborn` native module:
    ```terminal
    npm i react-native-wifi-reborn
    ```
3. Install `eas-cli`

    ```terminal
    npm install -g eas-cli
    ```
    You'll also need to have an account with Expo as you might be prompted to sign-in during further steps.

4. Eas config
    ```terminal
    eas build:configure
    ```

5. Run build

    ```terminal
    eas build --profile development --platform android
    ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.