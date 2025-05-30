package com.dnmanh.smartome.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.dnmanh.smartome.entity.*;
import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.dto.response.PermissionDTO;
import com.dnmanh.smartome.dto.response.ResPaginationDTO;
import com.dnmanh.smartome.dto.response.UserDTO;
import com.dnmanh.smartome.repository.*;
import com.dnmanh.smartome.util.error.FieldsException;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    @Autowired
    private Environment env;

    private final UserRepository userRepository;
    private final UserRegisterRepository userRegisterRepository;
    private final HistoryLogInRepository historyLogInRepository;
    private final OtpUserRegisterRepository otpUserRegisterRepository;
    private final RoleRepository roleRepository;
    private final RoleService roleService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            UserRegisterRepository uRR,
            HistoryLogInRepository historyLogInRepository,
            OtpUserRegisterRepository oURR,
            RoleRepository rR,
            RoleService roleService,
            EmailService eS,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.userRegisterRepository = uRR;
        this.historyLogInRepository = historyLogInRepository;
        this.otpUserRegisterRepository = oURR;
        this.roleRepository = rR;
        this.roleService = roleService;
        this.emailService = eS;
        this.passwordEncoder = passwordEncoder;
    }

    public UserRegister handleUserRegiter(UserDTO.ReqUserRegisterDTO userRegisterDTO) {

        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (userRegisterDTO.email == null || userRegisterDTO.email.trim().equals("")) {
            invalidFields.add(new InvalidFieldDTO("email", "Email not empty"));
        }else if (!EMAIL_PATTERN.matcher(userRegisterDTO.getEmail()).matches()) {
            invalidFields.add(new InvalidFieldDTO("email", "Email is invalid"));
        };

        if (userRegisterDTO.password == null || userRegisterDTO.password.trim().length() < 8 || userRegisterDTO.password.trim().length() > 16) invalidFields.add(new InvalidFieldDTO("password", "Password must be from 8 - 16 characters"));
        if (userRegisterDTO.username == null || userRegisterDTO.username.trim().length() < 3 || userRegisterDTO.username.trim().length() > 25) invalidFields.add(new InvalidFieldDTO("username", "Username must be from 3 - 25 characters"));

        if (!invalidFields.isEmpty()) throw new FieldsException(invalidFields);

        // Kiểm tra email đã tồn tại chưa
        if (this.userRepository.existsByEmail(userRegisterDTO.email) || this.userRegisterRepository.existsByEmailAndNonExpired(userRegisterDTO.email, Instant.now())) {
            invalidFields.add(new InvalidFieldDTO("email", "Email is already in use"));
        }

        // Kiemer tra username da ton tai chua
        if (this.userRepository.existsByUsername(userRegisterDTO.username) || this.userRegisterRepository.existsByUsernameAndNonExpired(userRegisterDTO.username, Instant.now())) {
            invalidFields.add(new InvalidFieldDTO("username", "Username is already in use"));
        }

        if (!invalidFields.isEmpty()) throw new FieldsException(invalidFields);

        userRegisterDTO.setPassword(this.passwordEncoder.encode(userRegisterDTO.password));

        // Ghi thông tin đaăng ký người dùng vào DB
        UserRegister userRegister = new UserRegister();
        userRegister.setName(userRegisterDTO.name);
        userRegister.setEmail(userRegisterDTO.email);
        userRegister.setUsername(userRegisterDTO.username);
        userRegister.setPassword(userRegisterDTO.password);
        userRegister.setExpiresAt(
            Instant.now().plus(
                Integer.valueOf(this.env.getProperty("env.user-register-live-sec")),
                ChronoUnit.SECONDS
            )
        );
        UserRegister newUserRegister = this.userRegisterRepository.save(userRegister);

        // Tạo mã số OTP
        String otp = this.generateOTP(6);

        // Gửi email xác nhận
        this.emailService.otpConfirmEmailRegisterUserSync(newUserRegister.getEmail(), otp);

        // Lưu mã số OTP vào DB
        OtpUserRegister newOtpUserRegister = new OtpUserRegister();
        newOtpUserRegister.setUserRegister(newUserRegister);
        newOtpUserRegister.setOtp(otp);
        newOtpUserRegister.setExpiresAt(
            Instant.now().plus(
                Integer.valueOf(this.env.getProperty("env.otp-expiration-sec")),
                ChronoUnit.SECONDS
            )
        );
        this.otpUserRegisterRepository.save(newOtpUserRegister);

        return newUserRegister;
    }


    // Kiểm tra otp và email
    // Nếu tồn tại thì xóa otp và trả về true
    public boolean verifyOtpUserRegister(UserDTO.ReqVerifyOTPRegisterUserDTO body) {
        OtpUserRegister otpUserRegister = this.otpUserRegisterRepository.findByEmailAndOtpAndExpiresAtAfter(body.email, body.otp, Instant.now());

        if (otpUserRegister != null) {
            this.otpUserRegisterRepository.delete(otpUserRegister);
            return true;
        }
        return false;
    }


    // Kiểm tra OTP và email
    // Nếu hợp lệ thì tạo user từ userRegister và trả về true
    @Transactional
    public Optional<User> handleCreateUserFromUserRegister(String email) {
        // Tìm thông tin đăng ký người dùng
        UserRegister userRegister = this.userRegisterRepository.findByEmailAndNonExpired(email, Instant.now());

        if (userRegister == null) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("email", "Email has expired or not found")));
        }

        Role role = this.roleRepository.findByName("USER");

        // Ghi thông tin đăng ký người dùng vào DB
        User user = new User();
        user.setName(userRegister.getName());
        user.setEmail(userRegister.getEmail());
        user.setUsername(userRegister.getUsername());
        user.setPassword(userRegister.getPassword());
        user.setRole(role);
        user.setCreatedBy("THIS_USER");
        User newUser = this.userRepository.save(user);

        if (newUser == null) {
            throw new RuntimeException("Failed to save User entity"); // Ném ngoại lệ để rollback
        }

        // Xoá các thông tin OTP liên quan
        this.otpUserRegisterRepository.deleteByUserRegister(userRegister);

        // Xoá thông tin đăng ký
        this.userRegisterRepository.delete(userRegister);

        return Optional.ofNullable(newUser);
    }


    public User handleGetUserByUsername(String username) {
        return this.userRepository.findUserByUsername(username);
    }

    // Gửi lại mã OTP xác thực người dùng đăng ký
    public void resendOtpUserRegister(String email) {
        UserRegister userRegister = this.userRegisterRepository.findByEmailAndNonExpired(email, Instant.now());

        if (userRegister == null) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("email", "Email has expired or not found")));
        }

        // Tạo mã số OTP
        String otp = this.generateOTP(6);

        // Gửi email xác nhận
        this.emailService.otpConfirmEmailRegisterUserSync(userRegister.getEmail(), otp);

        // Lưu mã số OTP vào DB
        OtpUserRegister newOtpUserRegister = new OtpUserRegister();
        newOtpUserRegister.setUserRegister(userRegister);
        newOtpUserRegister.setOtp(otp);
        newOtpUserRegister.setExpiresAt(
            Instant.now().plus(
                Integer.valueOf(this.env.getProperty("env.otp-expiration-sec")),
                ChronoUnit.SECONDS
            )
        );
        this.otpUserRegisterRepository.save(newOtpUserRegister);
    }

    // Tạo mã số OTP
    private String generateOTP(int length) {
        Random random = new Random();

        // Tạo số ngẫu nhiên với chiều dài tùy ý
        int randomNumber = (int) (Math.pow(10, length - 1)) + random.nextInt((int) (Math.pow(10, length) - Math.pow(10, length - 1)));

        return String.valueOf(randomNumber);
    }


    // Lưu refresh token và huỷ các fresh token cũ
    public void handleUserNewLogIn(User user, String refreshToken) {
        if (user != null) {
            this.historyLogInRepository.updateIsDeletedTrueByUsername(user.getUsername());
            HistoryLogIn historyLogIn = new HistoryLogIn();
            historyLogIn.setUser(user);
            historyLogIn.setRefreshToken(refreshToken);
            this.historyLogInRepository.save(historyLogIn);
        }
    }

    // Tìm user bằng refresh token và username
    public Optional<User> getUserByRefreshTokenAndUsername(String token, String username) {
        return this.historyLogInRepository.findUserByRefreshTokenAndUsernameAndIsDeletedFalse(token, username);
    }

    // Xoá history log in
    public void handleDeleteUserLogIn(String username) {
        this.historyLogInRepository.updateIsDeletedTrueByUsername(username);
    }


    public UserDTO.ResUserFullPermission convertUserToResUserFullPermissions(User user) {

        UserDTO.ResUserFullPermission res = new UserDTO.ResUserFullPermission();

        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setUsername(user.getUsername());
        res.setCreatedAt(user.getCreatedAt());

        UserDTO.RoleFullPermission role = new UserDTO.RoleFullPermission();

        List<PermissionDTO.ResPermissionDTO> permissions = new ArrayList<PermissionDTO.ResPermissionDTO>();

        if (user.getRole() != null) {

            user.getRole().getPermissions().forEach(item -> {
                PermissionDTO.ResPermissionDTO permissionTemp = new PermissionDTO.ResPermissionDTO();
                permissionTemp.setId(item.getId());
                permissionTemp.setName(item.getName());
                permissionTemp.setApiPath(item.getApiPath());
                permissionTemp.setMethod(item.getMethod());
                permissionTemp.setModule(item.getModule());
                permissions.add(permissionTemp);
            });

            role.setId(user.getRole().getId());
            role.setName(user.getRole().getName());
            role.setPermissions(permissions);

            res.setRole(role);
        }


        return res;
    }

}
