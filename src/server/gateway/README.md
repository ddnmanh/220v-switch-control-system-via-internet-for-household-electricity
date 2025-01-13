## START
### 1. Install dependencies general
```terminal
npm install
```
### 2. Install `config-project-global` as a dependency
```terminal
npm run config-project-global:install
```
### 3. Compile proto configs to TS syntax for use
```terminal
npm run proto:all
```

### 4. Generate key and certificate for mTLS
#### 4.1 Change domains security
Change protected domains in file `mTLS-service-config.ext`.

Default path: `node_modules\config-project-global\mTLS\mTLS-service-config.ext`

#### 4.2 Generate mTLS files
```terminal
npm run mtls:all
```


### 5. Run app
- Rename `.env.example` to `.env`
- Rename `.env.share.example` to `.env.share`

### 6. Run app
```terminal
npm run start:dev
```

## RULES
### 1. Throw
Just like throw new `RpcException` code follow after documentation https://grpc.io/docs/guides/status-codes/

```vscode
import * as grpc from '@grpc/grpc-js';

// method
throw new RpcException({code: grpc.status.UNAVAILABLE, message: 'Method not implemented'});
```

### 2. Response
Every response has a 'success: true' attribute if it reaches the endpoint, otherwise the response will be 'false' if there is a system error or an error outside the scope of the code and purpose of the request.
```vscode
{
    code: int,
    status: string,
    message: [
        {
            property: 'property_name',
            message: 'err message'
        }
    ],
    data: any
}
```

### 3. Variable
Using only "camel case" for variable name
