## 1 ROOT mTLS
### 1.1 RootCA.key
```terminal
openssl genpkey -algorithm RSA -out RootCA.key
``` 

### 1.2 RootCA.pem
```terminal
openssl req -x509 -key RootCA.key -out RootCA.pem -days 3650 -subj "/C=US/ST=State/L=City/O=MyOrg/OU=MyUnit/CN=Root-CA"
``` 

### 1.3 Convert RootCA.pem to RootCA.crt
```terminal
openssl x509 -outform pem -in RootCA.pem -out RootCA.crt
```

## 3 Create mTLS for service
### 3.1 Generate private key and certificate request (CSR)
#### You should change 
- YourState, YourCity, Example-Certificaties.
- `localhost.local` to one of all `DNS.n in` of `mTLS-service-config.ext` file.
``` terminal
openssl req -new -nodes -newkey rsa:2048 -keyout postman.key -out postman.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"
```

### 3.2 Generate certificate
``` terminal
openssl x509 -req -sha256 -days 500 -in postman.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -out postman.crt -extfile mTLS-service-config.ext
```