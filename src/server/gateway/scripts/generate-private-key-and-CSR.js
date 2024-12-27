const prompt = require('prompt-sync')();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục gốc Auth (thư mục cha của `script` và `node_modules`)
const authDir = path.resolve(__dirname, '..');
// Đường dẫn thư mục `mTLS` (ngang hàng với `script` và `node_modules`)
const mtlsDir = path.join(authDir, 'mTLS');
// Đường dẫn thư mục chứa các file chứng chỉ trong `node_modules`
const baseDir = path.join(authDir, 'node_modules', 'config-project-global', 'mTLS');

// Tạo thư mục "mTLS" nếu chưa tồn tại
if (!fs.existsSync(mtlsDir)) {
    fs.mkdirSync(mtlsDir);
    console.log(`Directory "mTLS" created successfully at: ${mtlsDir}`);
} else {
    console.log(`Directory "mTLS" already exists at: ${mtlsDir}`);
}

// Giá trị mặc định
const defaultDomain = 'localhost';
const defaultOrganization = 'Personal';
const defaultCountry = 'VI';
const defaultState = 'TraVinh';
const defaultCity = 'ChauThanh';

// Nhắc người dùng nhập các giá trị, dùng giá trị mặc định nếu không có đầu vào
prompt(`Generate a private key and a Certificate Signing Request (CSR) for the service. Press Enter to continue...`);
const domain = prompt(`Domain of service [${defaultDomain}]: `) || defaultDomain;
const organization = prompt(`Organization [${defaultOrganization}]: `) || defaultOrganization;
const country = prompt(`Country code [${defaultCountry}]: `) || defaultCountry;
const state = prompt(`State or province [${defaultState}]: `) || defaultState;
const city = prompt(`City [${defaultCity}]: `) || defaultCity;

// Lệnh OpenSSL
const command = `openssl req -new -nodes -newkey rsa:2048 -keyout ${path.join(mtlsDir, 'gateway.key')} -out ${path.join(mtlsDir, 'gateway.csr')} -subj "/C=${country}/ST=${state}/L=${city}/O=${organization}/CN=${domain}"`;

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
    console.log(`stdout: ${stdout}`);
});
