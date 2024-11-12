// Import các đường dẫn ảnh, mỗi đường dẫn sẽ được coi là chuỗi (string)
import eyeSlash from "../assets/icons/app/eye-slash.png";
import eye from "../assets/icons/app/eye.png";
import google from "../assets/icons/app/google.png";
import microsoft from "../assets/icons/app/microsoft.png";
import locationDot from "../assets/icons/app/location-dot.png";
import locationDotSolid from "../assets/icons/app/location-dot-solid.png";
import locationArrowSolid from "../assets/icons/app/location-arrow-solid.png";
import locationArrowRegular from "../assets/icons/app/location-arrow-regular.png";
import mapSolid from "../assets/icons/app/map-solid.png";
import mapRegular from "../assets/icons/app/map-regular.png";
import list from "../assets/icons/app/list.png";
import listActive from "../assets/icons/app/list-active.png";
import calendar from "../assets/icons/app/calendar.png";
import droplet from "../assets/icons/app/droplet.png";
import gauge from "../assets/icons/app/gauge.png";
import lungs from "../assets/icons/app/lungs.png";
import wind from "../assets/icons/app/wind.png";
import sunrise from "../assets/icons/app/sunrise.png";
import circleXmarkSolid from "../assets/icons/app/circle-xmark-solid.png";
import magnifyingGlass from "../assets/icons/app/magnifying-glass.png";
import circleEllipsis from "../assets/icons/app/circle-ellipsis.png";
import arrowUpRightFromSquareSolid from "../assets/icons/app/arrow-up-right-from-square-solid.png";
import check from "../assets/icons/app/check.png";
import pen from "../assets/icons/app/pen.png";
import gripDotsSolid from "../assets/icons/app/grip-dots-solid.png";
import circleMinusSolid from "../assets/icons/app/circle-minus-solid.png";
import messageExclamationRegular from "../assets/icons/app/message-exclamation-regular.png";
import messageExclamation from "../assets/icons/app/message-exclamation.png";
import homeSolid from "../assets/icons/app/home-solid.png";
import homeRegular from "../assets/icons/app/home-regular.png";
import badgeCheckRegular from "../assets/icons/app/badge-check-regular.png";
import badgeCheckSolid from "../assets/icons/app/badge-check-solid.png";
import bellSolid from "../assets/icons/app/bell-solid.png";
import bellRegular from "../assets/icons/app/bell-regular.png";
import userSolid from "../assets/icons/app/user-solid.png";
import userRegular from "../assets/icons/app/user-regular.png";
import circlePlusRegular from "../assets/icons/app/circle-plus-regular.png";
import caretUpSolid from "../assets/icons/app/caret-up-solid.png";
import caretDownSolid from "../assets/icons/app/caret-down-solid.png";
import slidersSolid from "../assets/icons/app/sliders-solid.png";
import plusRegular from "../assets/icons/app/plus-regular.png";
import plusSolid from "../assets/icons/app/plus-solid.png";
import lightbulbSolid from "../assets/icons/app/lightbulb-solid.png";
import lightbulbOnSolid from "../assets/icons/app/lightbulb-on-solid.png";
import timerRegular from "../assets/icons/app/timer-regular.png";
import temperatureListRegular from "../assets/icons/app/temperature-list-regular.png";
import lightSwitchOnSolid from "../assets/icons/app/light-switch-on-solid.png";
import lightSwitchOffSolid from "../assets/icons/app/light-switch-off-solid.png";
import gearSolid from "../assets/icons/app/gear-solid.png";
import gearRegular from "../assets/icons/app/gear-regular.png";
import doorOpenRegular from "../assets/icons/app/door-open-regular.png";
import lampRegular from "../assets/icons/app/lamp-regular.png";
import angleLeftRegular from "../assets/icons/app/angle-left-regular.png";
import openweathermap01n from "../assets/icons/openweathermap/01n.png";
import openweathermap02n from "../assets/icons/openweathermap/02n.png";
import openweathermap03n from "../assets/icons/openweathermap/03n.png";
import openweathermap04n from "../assets/icons/openweathermap/04n.png";
import openweathermap09n from "../assets/icons/openweathermap/09n.png";
import openweathermap10n from "../assets/icons/openweathermap/10n.png";
import openweathermap11n from "../assets/icons/openweathermap/11n.png";
import openweathermap13n from "../assets/icons/openweathermap/13n.png";
import openweathermap50n from "../assets/icons/openweathermap/50n.png";
import openweathermap01d from "../assets/icons/openweathermap/01d.png";
import openweathermap02d from "../assets/icons/openweathermap/02d.png";
import openweathermap03d from "../assets/icons/openweathermap/03d.png";
import openweathermap04d from "../assets/icons/openweathermap/04d.png";
import openweathermap09d from "../assets/icons/openweathermap/09d.png";
import openweathermap10d from "../assets/icons/openweathermap/10d.png";
import openweathermap11d from "../assets/icons/openweathermap/11d.png";
import openweathermap13d from "../assets/icons/openweathermap/13d.png";
import openweathermap50d from "../assets/icons/openweathermap/50d.png";

// Xác định kiểu của đối tượng chứa các icon
const iconsGlobal: Record<string, string> = {
    eyeSlash,
    eye,
    google,
    microsoft,
    locationDot,
    locationDotSolid,
    locationArrowSolid,
    locationArrowRegular,
    mapSolid,
    mapRegular,
    list,
    listActive,
    calendar,
    droplet,
    gauge,
    lungs,
    wind,
    sunrise,
    circleXmarkSolid,
    magnifyingGlass,
    circleEllipsis,
    arrowUpRightFromSquareSolid,
    check,
    pen,
    gripDotsSolid,
    circleMinusSolid,
    messageExclamationRegular,
    messageExclamation,
    homeSolid,
    homeRegular,
    badgeCheckRegular,
    badgeCheckSolid,
    bellSolid,
    bellRegular,
    userSolid,
    userRegular,
    circlePlusRegular,
    caretUpSolid,
    caretDownSolid,
    slidersSolid,
    plusRegular,
    plusSolid,
    lightbulbSolid,
    lightbulbOnSolid,
    timerRegular,
    temperatureListRegular,
    lightSwitchOnSolid,
    lightSwitchOffSolid,
    gearSolid,
    gearRegular,
    doorOpenRegular,
    lampRegular,
    angleLeftRegular,
    openweathermap01n,
    openweathermap02n,
    openweathermap03n,
    openweathermap04n,
    openweathermap09n,
    openweathermap10n,
    openweathermap11n,
    openweathermap13n,
    openweathermap50n,
    openweathermap01d,
    openweathermap02d,
    openweathermap03d,
    openweathermap04d,
    openweathermap09d,
    openweathermap10d,
    openweathermap11d,
    openweathermap13d,
    openweathermap50d,
};

// Xuất đối tượng chứa các icon
export default iconsGlobal;
