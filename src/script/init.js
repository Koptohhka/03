import '../css/style.css';
import '../css/spiner.css';
import '../css/popup.css';

import clear from '../css/assets/img/weather/clear.svg';
import thunder from '../css/assets/img/weather/thunder.svg';
import rainy1 from '../css/assets/img/weather/rainy1.svg';
import rainy2 from '../css/assets/img/weather/rainy2.svg';
import snowy from '../css/assets/img/weather/snowy.svg';
import clouds2 from '../css/assets/img/weather/clouds2.svg';
import clouds1 from '../css/assets/img/weather/clouds1.svg';

const TEST = {
    clear: clear,
    thunder: thunder,
    rainy1: rainy1,
    rainy2: rainy2,
    snowy: snowy,
    clouds2: clouds2,
    clouds1: clouds1
}

import {
    DATE_OBJECT
} from '../script/data/date-data.js';

import {
    API_KEYS_OBJ
} from '../script/data/api-keys.js';

import {
    TRANSLATE_TEXT_OBJECT
} from '../script/data/translated-text.js';

import {
    MapClass
} from '../script/api/getMap.js';

import {
    changeCurrentImage
} from '../script/api/image-api.js';

import {
    currentDate,
    getDayOfWeek,
    setDynamicTime,
    toInsertSpinner,
    toInsertErrorPopup,
    getSvgIconNameByWeatherCode,
    changePlaceholderText
} from '../script/utils.js';

const languageSelect = document.getElementById('language-select');
const degreeConverter = document.getElementById('degree-converter');
const newMapClass = new MapClass();

let htmlMarckup = [];
let currentLanguage = 'en';
let currentPlace = '';
let initFlag = true;
let currentInterval;
let currentUnits = 'M';

async function getCurrentLocationInfo() {
    const responseLocationApi = await fetch(`https://ipinfo.io/json?token=228cc3bbcd9fa3`);
    const dataLocation = await responseLocationApi.json();

    currentPlace = dataLocation.city;
    getPlaceInfo(currentPlace);
    changeCurrentImage();
}

async function getPlaceInfo(city) {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=fd3b45d060af433e9287616c9130e020&q=${city}&pretty=1&no_annotations=1&language=${currentLanguage}`);
    const data = await response.json();
    let dataFirstResult;
    dataFirstResult = data.results[0];
    if (!dataFirstResult || dataFirstResult.components._type === 'country') {
        getPlaceInfo(currentPlace);
        toInsertErrorPopup(TRANSLATE_TEXT_OBJECT[currentLanguage]['error popup text']);
        return null;
    }

    const response2 = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=MCDDYFSLEOKU&format=json&by=position&lat=${dataFirstResult.geometry.lat}&lng=${dataFirstResult.geometry.lng}`);
    const data2 = await response2.json();

    renderCurrentUserInfo(dataFirstResult.formatted, data2.formatted);
    if (initFlag) {
        newMapClass.init([dataFirstResult.geometry.lng, dataFirstResult.geometry.lat]);
    } else {
        newMapClass.flyTo([dataFirstResult.geometry.lng, dataFirstResult.geometry.lat]);
    }
    newMapClass.insertCoordinates([dataFirstResult.geometry.lng, dataFirstResult.geometry.lat], TRANSLATE_TEXT_OBJECT[currentLanguage]['coordinates'][0], TRANSLATE_TEXT_OBJECT[currentLanguage]['coordinates'][1]);
    initFlag = false;
}

async function renderCurrentUserInfo(placeInfo, timeData) {
    const currentCity = placeInfo.slice(0, placeInfo.indexOf(','));
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${currentCity}&days=1&units=${currentUnits}&lang=${currentLanguage}&key=${API_KEYS_OBJ['weatherbit']}`);

    if (response.status === 204) {
        toInsertErrorPopup(TRANSLATE_TEXT_OBJECT[currentLanguage]['error popup text']);
        getPlaceInfo(currentPlace);
        return null;
    }
    currentPlace = currentCity;
    const data = await response.json();
    const dataObj = data.data[0];

    const template = `<div class="section-left__town-title">
        ${placeInfo}
        </div>
        <div class="section-left__day-info">
    ${DATE_OBJECT.DAY_NAMES[currentLanguage][currentDate.getDay()]} ${currentDate.getDate()}, ${DATE_OBJECT.MONTH_NAMES[currentLanguage][currentDate.getMonth()]}, <span id="timer"></span>
         </div>
         <div class="section-left__today-container">
    <div class="today-container__degree-number">
        <p class="today-container__degree-title">${Math.ceil(dataObj.temp)}</p>
        <p class="today-container__degree-round">°</p>
    </div> 



    <img class="today-container__cloud" src="${TEST[getSvgIconNameByWeatherCode(dataObj.weather.code)]}">

    <div class="today-container__weather-info">
        <p class="weather-info__weather-type">${dataObj.weather.description}</p>
        <p class="weather-info__feels-like">${TRANSLATE_TEXT_OBJECT[currentLanguage]['feels like expression']}: ${dataObj.app_temp}°</p>
        <p class="weather-info__wind">${TRANSLATE_TEXT_OBJECT[currentLanguage]['wind expression']}  ${Math.ceil(dataObj.wind_spd)}: m/s</p>
        <p class="weather-info__humidity">${TRANSLATE_TEXT_OBJECT[currentLanguage]['humidity expression']}: ${dataObj.rh}%</p>
    </div>
    </div>`;

    htmlMarckup.push(template);

    renderFutureWeatherInfo(currentCity);
    let timerClosure = setDynamicTime(timeData);
    currentInterval = setInterval(timerClosure, 1000);
}

async function renderFutureWeatherInfo(cityName) {
    const WEATHER_URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&days=4&units=${currentUnits}&lang=${currentLanguage}&key=${API_KEYS_OBJ['weatherbit']}`;
    const response = await fetch(WEATHER_URL);
    const data = await response.json();
    const template = `<ul class="section-left__another-days">
    <li class="another-days__another-day">
        <p class="another-day__title">${DATE_OBJECT.DAY_NAMES[currentLanguage][getDayOfWeek(data.data[1].datetime) + 1]}</p>
        <p class="another-day__degree">${Math.ceil(data.data[1].temp)}°</p>
        <img src="${TEST[getSvgIconNameByWeatherCode(data.data[1].weather.code)]}" alt="" class="another-day__icon">
    </li>
    <li class="another-days__another-day">
        <p class="another-day__title">${DATE_OBJECT.DAY_NAMES[currentLanguage][getDayOfWeek(data.data[2].datetime) + 1]}</p>
        <p class="another-day__degree">${Math.ceil(data.data[2].temp)}°</p>
        <img src="${TEST[getSvgIconNameByWeatherCode(data.data[2].weather.code)]}" alt="" class="another-day__icon">
    </li>
    <li class="another-days__another-day">
        <p class="another-day__title">${DATE_OBJECT.DAY_NAMES[currentLanguage][getDayOfWeek(data.data[3].datetime) + 1]}</p>
        <p class="another-day__degree">${Math.ceil(data.data[3].temp)}°</p>
        <img src="${TEST[getSvgIconNameByWeatherCode(data.data[3].weather.code)]}" alt="" class="another-day__icon">
    </li>
    </ul>`;

    //mainSectionLeft.insertAdjacentHTML('beforeend', template);
    htmlMarckup.push(template);
    insertHtmlMarckup()
}

function insertHtmlMarckup() {
    document.getElementById('weather-container').innerHTML = htmlMarckup.join('');
    htmlMarckup = [];
}

async function toInitNewRender(city) {
    getPlaceInfo(city);
    toInsertSpinner();
    clearInterval(currentInterval);
}



function renderSearchedWeatherInfo() {
    toInitNewRender(document.getElementById('serach-input').value);
}

function chanegCurrentLanguage(evt) {
    currentLanguage = evt.target.value;
    const optionsArray = evt.target.querySelectorAll('option');
    for (let i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].value === evt.target.value) {
            optionsArray[i].classList.add('language-option--active');
        } else {
            optionsArray[i].classList.remove('language-option--active')
        }
    }

    toInitNewRender(currentPlace);
    changePlaceholderText(TRANSLATE_TEXT_OBJECT[currentLanguage]['palceholder']);
}

function toChangeDegreeValue(evt) {
    const targetElement = evt.target;
    for (let i = 0; i < degreeConverter.children.length; i++) {
        degreeConverter.children[i].classList.remove('inputs__degree-button--active');
    }
    targetElement.classList.add('inputs__degree-button--active');

    if (targetElement.dataset.units !== currentUnits) {
        currentUnits = targetElement.dataset.units;
        toInitNewRender(currentPlace);
    }
}


document.getElementById('reboot').addEventListener('click', changeCurrentImage);
document.getElementById('search-button').addEventListener('click', renderSearchedWeatherInfo);
languageSelect.addEventListener('change', chanegCurrentLanguage);
degreeConverter.addEventListener('click', toChangeDegreeValue);

getCurrentLocationInfo();

