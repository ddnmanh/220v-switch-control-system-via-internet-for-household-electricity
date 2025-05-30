package com.dnmanh.smartome.service;

import com.dnmanh.smartome.dto.DeviceDTO;
import com.dnmanh.smartome.dto.HouseDTO;
import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.entity.*;
import com.dnmanh.smartome.repository.DeviceRepository;
import com.dnmanh.smartome.repository.HouseRepository;
import com.dnmanh.smartome.repository.UserRepository;
import com.dnmanh.smartome.util.GenerateUuidUtil;
import com.dnmanh.smartome.util.constant.TypeAlphabet;
import com.dnmanh.smartome.util.error.FieldsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class DeviceService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    @Autowired
    private Environment env;
    private final HouseRepository houseRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final GenerateUuidUtil generateUuidUtil;

    public DeviceService(
        HouseRepository hR,
        UserRepository uR,
        DeviceRepository dR,
        GenerateUuidUtil gUU
    ) {
        this.houseRepository = hR;
        this.userRepository = uR;
        this.deviceRepository = dR;
        this.generateUuidUtil = gUU;
    }

    public Optional<Device> handleCreateDevice(DeviceDTO.ReqCreate body) {
        // Validate input of house for creat house
        validateCreateDeviceInput(body);

        Device device = new Device();
        // Phòng trường hợp tạo id số đứng đầu
        device.setId("S" + this.generateUuidUtil.generateId(5, TypeAlphabet.BEAUTI));
        device.setName(body.getName());
        device.setDescription(body.getDescription());

        device.setType(body.getType());

        DeviceAP deviceAP = new DeviceAP();
        deviceAP.setApSsid(device.getId());

        if (body.getApPassword() == null || body.getApPassword().trim().isEmpty()) {
            deviceAP.setApPassword(generateApPassword(8));
        } else {
            deviceAP.setApPassword(body.getApPassword());
        }

        deviceAP.setDevice(device);
        device.setDeviceAP(deviceAP);

        System.out.println("Device Service: " + device);

        // Save house to database
        Device newDevice = this.deviceRepository.save(device);

        System.out.println("New Device: " + newDevice);

        return Optional.ofNullable(newDevice);
    }

    public Optional<Device> handleGetDeviceById(String deviceId) {
        return this.deviceRepository.findById(deviceId);
    }

    public Optional<List<Device>> handleGetAllDevices() {
        List<Device> devices = this.deviceRepository.findAll();
        return Optional.ofNullable(devices);
    }

    public Optional<Device> handleUpdateDevice(DeviceDTO.ReqUpdate body) {
        // Validate input of house for creat house
        validateUpdateDeviceInput(body);

        Optional<Device> device = this.deviceRepository.findById(body.getId());

        if (!device.isPresent()) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id", "Device not found")));
        }

        device.get().setName(body.getName().trim());
        device.get().setDescription(body.getDescription().trim());

        if (body.getApPassword() != null && !body.getApPassword().trim().isEmpty()) {
            device.get().getDeviceAP().setApPassword(body.getApPassword().trim());
        }

        Device updatedDevice = this.deviceRepository.save(device.get());

        return Optional.ofNullable(updatedDevice);
    }

    public Boolean handleDeleteDevice(String deviceId) {
        Optional<Device> device = this.deviceRepository.findById(deviceId);

        if (!device.isPresent()) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id", "Device not found")));
        }

        // Kiểm tra xem thiết bị đang được sử dụng bên OwnDevice không
        // Nếu đang được sử dụng thì không cho xóa và return false

        this.deviceRepository.delete(device.get());

        return true;
    }

    // --------------------------------------------------

    // Validate input of device for creat device
    private void validateCreateDeviceInput(DeviceDTO.ReqCreate body) {
        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (body.getName() == null || body.getName().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must not be empty"));
        }

        if (body.getName() != null && body.getName().trim().length() > 25) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must be less than 25 characters"));
        }

        if (body.getDescription() != null && body.getDescription().trim().length() > 150) {
            invalidFields.add(new InvalidFieldDTO("description", "Description must be less than 150 characters"));
        }

        if (body.getApPassword() != null && body.getApPassword().trim().length() != 8) {
            invalidFields.add(new InvalidFieldDTO("ap_password", "AP password must be 8 characters"));
        }

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }

    // Validate input of device for update device
    private void validateUpdateDeviceInput(DeviceDTO.ReqUpdate body) {
        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (body.getName() == null || body.getName().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must not be empty"));
        }

        if (body.getName() != null && body.getName().trim().length() > 25) {
            invalidFields.add(new InvalidFieldDTO("name", "Name must be less than 25 characters"));
        }

        if (body.getDescription() != null && body.getDescription().trim().length() > 150) {
            invalidFields.add(new InvalidFieldDTO("description", "Description must be less than 150 characters"));
        }

        if (body.getApPassword() != null && body.getApPassword().trim().length() != 8) {
            invalidFields.add(new InvalidFieldDTO("ap_password", "AP password must be 8 characters"));
        }

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }

    public DeviceDTO.Res convertDeviceToResDevice(Device device) {
        DeviceDTO.Res resDevice = new DeviceDTO.Res();
        resDevice.setId(device.getId());
        resDevice.setName(device.getName());
        resDevice.setDescription(device.getDescription());
        resDevice.setType(device.getType());
        resDevice.setDeviceAP(new DeviceDTO.ResDeviceAP());
        resDevice.getDeviceAP().setApSSID(device.getDeviceAP().getApSsid());
        resDevice.getDeviceAP().setApPassword(device.getDeviceAP().getApPassword());
        resDevice.setCreatedBy(device.getCreatedBy());
        resDevice.setCreatedAt(device.getCreatedAt());
        return resDevice;
    }

    // Tạo mã số
    private String generateApPassword(int length) {
        Random random = new Random();

        // Tạo số ngẫu nhiên với chiều dài tùy ý
        int randomNumber = (int) (Math.pow(10, length - 1)) + random.nextInt((int) (Math.pow(10, length) - Math.pow(10, length - 1)));

        return String.valueOf(randomNumber);
    }
}
