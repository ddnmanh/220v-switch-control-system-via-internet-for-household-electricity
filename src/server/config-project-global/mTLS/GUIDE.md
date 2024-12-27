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