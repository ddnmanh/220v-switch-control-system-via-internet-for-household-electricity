## Khởi Chạy App
```terminal
npm start
```

Nếu xuất hiện lỗi liên quan đến `Error: EMFILE: too many open files, watch`, lỗi này thường xảy ra khi sử dụng MacOS thì xử lý theo cách sau:

-  Cài đặt trình theo dõi file
    ```terminal
    brew install watchman
    ```
-  Xoá `./node_modules`
    ```terminal
    rm -rf ./node_modules
    ```

-  Cài đặt lại node_modules
    ```terminal
    npm install
    ```

-  Chạy app
    ```terminal
    npm start
    ```
