const prompt = require('prompt-sync')();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục Auth (cha của script)
const authDir = path.resolve(__dirname, '..');
// Đường dẫn thư mục mTLS (nằm trong Auth)
const mtlsDir = path.join(authDir, 'mTLS');
// Đường dẫn các file trong node_modules
const baseDir = path.join(authDir, 'node_modules', 'config-project-global', 'mTLS');

// Tạo thư mục "mTLS" nếu chưa tồn tại
if (!fs.existsSync(mtlsDir)) {
    fs.mkdirSync(mtlsDir);
    console.log(`Directory "mTLS" created successfully at: ${mtlsDir}`);
} else {
    console.log(`Directory "mTLS" already exists at: ${mtlsDir}`);
}

// Giá trị mặc định
const defaultCertDays = '365';

// Nhắc người dùng nhập các giá trị, dùng giá trị mặc định nếu không có đầu vào
prompt(`Generate a certificate for the service. Press Enter to continue...`);
const certDays = prompt(`Number of days the certificate is valid [${defaultCertDays}]: `) || defaultCertDays;

// Đường dẫn file
const csrPath = path.join(mtlsDir, 'gateway.csr');
const crtPath = path.join(mtlsDir, 'gateway.crt');
const rootCAPath = path.join(baseDir, 'RootCA.pem');
const rootCAKeyPath = path.join(baseDir, 'RootCA.key');
const domainExtPath = path.join(baseDir, 'mTLS-service-config.ext');

// Lệnh OpenSSL
const command = `openssl x509 -req -sha256 -days ${certDays} -in ${csrPath} -CA ${rootCAPath} -CAkey ${rootCAKeyPath} -CAcreateserial -out ${crtPath} -extfile ${domainExtPath}`;

// Chạy lệnh OpenSSL
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Certificate generated successfully. Output:\n${stdout}`);
});
