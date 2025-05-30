package com.dnmanh.smartome.service;

import com.dnmanh.smartome.dto.DeviceDTO;
import com.dnmanh.smartome.dto.OwnDeviceDTO;
import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.entity.*;
import com.dnmanh.smartome.repository.*;
import com.dnmanh.smartome.util.GenerateUuidUtil;
import com.dnmanh.smartome.util.constant.TypeAlphabet;
import com.dnmanh.smartome.util.error.FieldsException;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class OwnDeviceService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    @Autowired
    private Environment env;
    private final HouseRepository houseRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final OwnDeviceRepository ownDeviceRepository;
    private final OperationOwnDeviceRepository operationOwnDeviceRepository;
    private final GenerateUuidUtil generateUuidUtil;

    public OwnDeviceService(
        HouseRepository hR,
        UserRepository uR,
        DeviceRepository dR,
        OwnDeviceRepository oDR,
        OperationOwnDeviceRepository oODR,
        GenerateUuidUtil gUU
    ) {
        this.houseRepository = hR;
        this.userRepository = uR;
        this.deviceRepository = dR;
        this.ownDeviceRepository = oDR;
        this.operationOwnDeviceRepository = oODR;
        this.generateUuidUtil = gUU;
    }

    public Optional<OwnDevice> handleCreateOwnDevice(OwnDeviceDTO.ReqCreate body) {
        // Validate input of house for creat house
        validateCreateOwnDeviceInput(body);

        // Kiểm tra house có thuộc về user không
        House house = this.houseRepository.findHouseByIdWithRelationByIdUser(body.getIdUser(), body.getIdHouse());

        if (house == null) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id_house", "House not belong to user or not exist")));
        }

        // Lấy room từ house đã có
        Room room = new Room();
        if (body.getIdRoom() != null) {
            Room roomTemp = house.getRooms().stream().filter(r -> r.getId().equals(body.getIdRoom())).findFirst().orElse(null);

            if (roomTemp != null) {
                 room = roomTemp;
            } else {
                throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id_room", "Phòng này không thuộc về nhà của bạn")));
            }
        }

        // Kiểm tra device có tồn tại không
        Device device = this.deviceRepository.findById(body.getIdDevice()).orElse(null);
        if (device == null) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id_device", "Thiết bị không tồn tại")));
        }

        // Kiểm tra device có đang được sử dụng trong owndevice không
        if (this.ownDeviceRepository.existsOwnDeviceByIdDevice(body.getIdDevice())) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id_device", "Thiết bị này đang được sử dụng")));
        }


        OwnDevice ownDevice = new OwnDevice();
        ownDevice.setId(this.generateUuidUtil.generateId(10, TypeAlphabet.SECURITY));
        ownDevice.setDevice(device);
        ownDevice.setIdDevice(device.getId());
        ownDevice.setHouse(house);
        ownDevice.setIdHouse(house.getId());

        // Kiểm tra xem nếu room không tồn tại thì không set room
        if (room.getId() != null) {
            ownDevice.setRoom(room);
            ownDevice.setIdRoom(room.getId());
        }

        ownDevice.setName(body.getName().trim());
        ownDevice.setDescription(body.getDescription().trim());
        ownDevice.setTopicSend(house.getId() + "/" + device.getId() + "/receive");
        ownDevice.setTopicReceive(house.getId() + "/" + device.getId() + "/send");

        OwnDeviceSetting ownDeviceSetting = new OwnDeviceSetting();
        ownDevice.setOwnDeviceSetting(ownDeviceSetting);
        ownDeviceSetting.setIdOwnDevice(ownDevice.getId());
        ownDeviceSetting.setOwnDevice(ownDevice);



        // Save house to database
        OwnDevice newOwnDevice = this.ownDeviceRepository.save(ownDevice);

        return Optional.ofNullable(newOwnDevice);
    }

    public Optional<OwnDevice> handleGetOwnDeviceById(long userId, String ownDeviceId) {

        OwnDevice ownDevice = this.ownDeviceRepository.findOwnDeviceByIdAndBelongToUser(userId, ownDeviceId);

        return Optional.ofNullable(ownDevice);
    }

    public Optional<OwnDevice> handleUpdateOwnDevice(OwnDeviceDTO.ReqUpdate body) {
        // Validate input of house for creat house
        validateUpdateOwnDeviceInput(body);

        OwnDevice ownDevice = this.ownDeviceRepository.findOwnDeviceByIdAndBelongToUser(body.getIdUser(), body.getId());

        if (ownDevice == null) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id", "Thiết bị này không tồn tại hoặc không thuộc về bạn")));
        }

        ownDevice.setName(body.getName().trim());
        ownDevice.setDescription(body.getDescription().trim());

        OwnDevice updatedOwnDevice = this.ownDeviceRepository.save(ownDevice);

        return Optional.ofNullable(updatedOwnDevice);
    }

    public void handleDeleteOwnDevice(long userId, String ownDeviceId) {
        OwnDevice ownDevice = this.ownDeviceRepository.findOwnDeviceByIdAndBelongToUser(userId, ownDeviceId);

        if (ownDevice == null) {
            throw new FieldsException(
                    Collections.singletonList(
                        new InvalidFieldDTO("id", "Thiết bị này không tồn tại hoặc không thuộc về bạn")
                    )
            );
        }

        // Delete operationOwnDevice have idHouse = ownDevice.idHouse and idDevice = ownDevice.idDevice
        List<OperationOwnDevice> operationOwnDevices = this.operationOwnDeviceRepository.findOperationOwnDeviceByIdHouseAndIdDevice(ownDevice.getIdHouse(), ownDevice.getIdDevice());
        if (operationOwnDevices != null) {
            this.operationOwnDeviceRepository.deleteAll(operationOwnDevices);
        }

        this.ownDeviceRepository.delete(ownDevice);

    }

    public Optional<List<OperationOwnDevice>> handleGetOperationOwnDevice(long userId, String ownDeviceId) {
        OwnDevice ownDevice = this.ownDeviceRepository.findOwnDeviceByIdAndBelongToUser(userId, ownDeviceId);

        if (ownDevice == null) {
            throw new FieldsException(
                    Collections.singletonList(
                        new InvalidFieldDTO("id", "Thiết bị này không tồn tại hoặc không thuộc về bạn")
                    )
            );
        }

        List<OperationOwnDevice> operationOwnDevices = this.operationOwnDeviceRepository.findOperationOwnDeviceByIdHouseAndIdDevice(ownDevice.getIdHouse(), ownDevice.getIdDevice());

        return Optional.ofNullable(operationOwnDevices);
    }

    public Optional<OwnDevice> handleUpdateOwnDeviceSetting(OwnDeviceDTO.ReqUpdateSetting body) {
        OwnDevice ownDevice = this.ownDeviceRepository.findOwnDeviceByIdAndBelongToUser(body.getIdUser(), body.getIdOwnDevice());

        if (ownDevice == null) {
            throw new FieldsException(
                    Collections.singletonList(
                        new InvalidFieldDTO("id", "Thiết bị này không tồn tại hoặc không thuộc về bạn")
                    )
            );
        }

        if (body.getIsSaveState() != null) {
            ownDevice.getOwnDeviceSetting().setIsSaveState(body.getIsSaveState());
        }

        if (body.getIsResetConfirm() != null) {
            ownDevice.getOwnDeviceSetting().setIsResetConfirm(body.getIsResetConfirm());
        }

        OwnDevice updatedOwnDevice = this.ownDeviceRepository.save(ownDevice);

        return Optional.ofNullable(updatedOwnDevice);
    }

    // --------------------------------------------------

    // Validate input of device for creat device
    private void validateCreateOwnDeviceInput(OwnDeviceDTO.ReqCreate body) {
        List<InvalidFieldDTO> invalidFields = new ArrayList<>();

        if (body.getIdUser() == null) {
            invalidFields.add(new InvalidFieldDTO("id_user", "Id user must not be empty"));
        }

        if (body.getIdDevice() == null || body.getIdDevice().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("id_device", "Id device must not be empty"));
        }

        if (body.getIdHouse() == null || body.getIdHouse().trim().isEmpty()) {
            invalidFields.add(new InvalidFieldDTO("id_house", "Id house must not be empty"));
        }

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }

    // Validate input of device for update device
    private void validateUpdateOwnDeviceInput(OwnDeviceDTO.ReqUpdate body) {
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

        if (!invalidFields.isEmpty()) {
            throw new FieldsException(invalidFields);
        }
    }

    public OwnDeviceDTO.Res convertOwnDevicetoOwnDeviceRes(OwnDevice ownDevice) {
        OwnDeviceDTO.Res resDevice = new OwnDeviceDTO.Res();
        resDevice.setId(ownDevice.getId());
        resDevice.setName(ownDevice.getName());
        resDevice.setDescription(ownDevice.getDescription());
        resDevice.setTopicSend(ownDevice.getTopicSend());
        resDevice.setTopicReceive(ownDevice.getTopicReceive());
        OwnDeviceDTO.ResOwnDeviceSetting ownDeviceSetting = new OwnDeviceDTO.ResOwnDeviceSetting();
        ownDeviceSetting.setIsSaveState(ownDevice.getOwnDeviceSetting().getIsSaveState());
        ownDeviceSetting.setIsResetConfirm(ownDevice.getOwnDeviceSetting().getIsResetConfirm());
        resDevice.setSetting(ownDeviceSetting);
        return resDevice;
    }

}
