#### ĐỒ ÁN CHUYÊN NGÀNH 
# XÂY DỰNG HỆ THỐNG ĐIỀU KHIỂN CÔNG TẮC TỪ XA CHO THIẾT BỊ ĐIỆN DÂN DỤNG
- Sinh viên: **Nguyễn Đức Mạnh**
- MSSV: **110121202**
- Lớp: **DA21TTB**
- Email: **nguyenducmanhsttvu@gmail.com**
- Số điện thoại: **0868818614**
- Giảng viên hướng dẫn: **Nguyễn Ngọc Đan Thanh**
##
### Tổng quan về đồ án
Hệ thống điều khiển công tắt từ xa qua internet cho phép bạn gián tiếp điều khiển các thiết bị điện của mình như máy bơm, đèn, cửa cuốn, máy lạnh,... thông qua một công tắt được thiết kế tối giản nhưng điều đặc biệt của nó nằm ở việc nó hoạt động liên tục và tức thời ở bất kỳ đâu và bất kỳ nơi nào. Yêu cầu duy nhất hệ thống này là thiết bị và ứng dụng trên điện thoại được kết nối internet.

![Remote switch control system for civil electrical system!][def] 

[def]: /assets/Remote-switch-control-system-for-civil-electrical-system.png


Dự án này sử dụng tổ hợp nhiều giao thức truyền thông khác nhau nhằm đảo bảo truyền tải thông điệp qua các đối tượng được hiệu quả và tương thích cao giữa các đối tượng được sử dụng trong hệ thống. MQTT Broker là mấu chốt chính của dự án này. Nó giải quyết vấn đề về địa chỉ nhận / gửi tin ở nơi đặt thiết bị bị thay đổi liên tục bởi IP động của các gói dịch vụ internet dân dụng. MQTT Broker còn cho thấy tính đa dụng của nó khi cho phép kết nối theo nhiều giao thức và các giao thức khác nhau có thể trao đổi thông tin với nhau.

### Mục Lục
1. [Giới Thiệu Và Quy Tắc Về Dự Án Với Git](#1-giới-thiệu-và-quy-tắc-về-dự-án-với-git)

    1.1 [Thông Tin Các Nhánh)](#11-thông-tin-các-nhánh)

    1.2 [Quy Tắc Làm Việc Với Nhánh](#12-quy-tắc-làm-việc-với-nhánh)

    1.3 [Quy Tắc Viết Thông Điệp Commit](#13-quy-tắc-viết-thông-điệp-commit)


## 1. Giới Thiệu Và Quy Tắc Về Dự Án Với Git
### 1.1 Thông Tin Các Nhánh
-   `main` các tài nguyên hoàn thiện của dự án (Theo từng giai đoạn), nhánh này không được thay đổi trực tiếp (Ngoại trừ lần đầu tạo repository) mà chỉ được tạo nên nhờ gộp các nhánh con trực tiếp.
-   `dev` các tài nguyên về mặt coding
    -   Thư mục làm việc: `./src`
    -   Có 4 nhánh con:
        -   `app` chứa tài nguyên coding dành cho ứng dụng trên thiết bị di động (Android app). Thư mục làm việc `./src/app`
        -   `server` chứa tài nguyên coding cho server. Thư mục làm việc `./src/server`
        -   `mqtt` chứa tài nguyên xây dựng - cấu hình MQTT Broker. Thư mục làm việc: `./src/mqtt-broker`
        -   `equipment` chứa tài nguyên cho các thiết bị vật lý trong dự án. Thực mục làm việc: `./src/equipment`
-   `doc` các tài nguyên về mặt thông tin (Tài liệu dự án, giới thiệu dự án, bài báo cáo,...)
    - Thự mục làm việc: `./assets, ./propress-report, ./thesis`
### 1.2 Quy Tắc Làm Việc Với Nhánh
Các nhánh con thuộc nhánh `dev` sẽ được gộp lại vào `dev` sau mỗi <b><u>giai đoạn testing</u></b>. Nếu có lỗi cần fix ngay thì quay về các nhánh con chính để sửa đổi và gộp lại vào nhánh `dev` để tiếp tục <b><u>giai đoạn testing</u></b>. Nếu lỗi lớn thì mang sang thực hiện sửa lỗi ở giai đoạn tiếp theo sau khi testing hoàn tất.

Sau khi kết thúc các <b><u>giai đoạn testing</u></b> nếu nội dung ở từng nhánh hoàn thiện thì tiến hành gộp vào nhánh main.
### 1.3 Quy Tắc Viết Thông Điệp Commit
Trong mỗi commit có thể có nhiều trạng thái code khác nhau vì thế mỗi trạng thái sẽ được gắn kèm tag và mô tả về code đó.
```terminal
$ git commit -m "[DEV] sign-up with Google, sign-in interface [FIX] visibility the password on sign-in"
```

Tag:
-   [DEV] code thông thường (bao gồm việc code các tính năng) hoặc bất cứ thứ gì thuộc code nhằm xây dựng dự án.
-   [REFACTOR] tái cấu trúc code nhưng không làm thay đổi tính năng trước đó.
-   [DOC] viết tài liệu hoặc các hoạt động ngoài code.
-   [FIX] các hoạt động sửa đổi code/tài liệu nhằm khắc phục lỗi đang tồn tại.