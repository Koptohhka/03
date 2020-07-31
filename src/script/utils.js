export let currentDate = new Date();

export function getDayOfWeek(datetime) {
    const dateObj = new Date(datetime);
    return dateObj.getDay() - 1;
}

export function setDynamicTime(timeData) {
    let currentDateString = new Date(timeData);
    return function () {
        const timer = document.getElementById('timer');
        if (!timer) {
            return null;
        }

        let currentMins = currentDateString.getMinutes();
        let currentSecs = currentDateString.getSeconds();
        if (currentMins < 10) {
            currentMins = `0${currentDateString.getMinutes()}`;
        }
        if (currentSecs < 10) {
            currentSecs = `0${currentDateString.getSeconds()}`;
        }
        timer.textContent = `${currentDateString.getHours()}:${currentMins}:${currentSecs}`;
        currentDateString.setSeconds(currentDateString.getSeconds() + 1);
        currentDateString = new Date(currentDateString);
    }
}

export function toInsertSpinner() {
    document.getElementById('weather-container').innerHTML = `<div class="loader-container loader-container--start-mode">
    <div class="loader"></div>
    </div>`;
}

export function toClearInfoHtmlMarckup() {
    document.getElementById('weather-container').innerHTML = '';
}

export function toInsertErrorPopup(errorMessage) {
    document.querySelector('body').insertAdjacentHTML('afterbegin', `<div id="error-popup" class="error-popup">
    <svg class="error-popup__icon" fill="" aria-hidden="true" focusable="false" data-prefix="far"
        data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16" role="img"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z">
        </path>
    </svg>
    <p class="error-popup__error-message">${errorMessage}</p>
    </div>`);

    function insertErrorPopup (evt) {
        if (!evt.target.classList.contains('error-popup') && !evt.target.classList.contains('error-popup__error-message')) {
            document.getElementById('error-popup').remove();
            document.removeEventListener('click', insertErrorPopup)
        }
        document.removeEventListener('click', insertErrorPopup);
    }

    document.addEventListener('click', insertErrorPopup);
}

export function getSvgIconNameByWeatherCode(code) {
    let picName = 'clear';
    if (code < 300) picName = 'thunder';
    else if (code >= 300 && code < 501) picName = 'rainy1';
    else if (code >= 501 && code < 600) picName = 'rainy2';
    else if (code >= 600 && code < 700) picName = 'snowy';
    else if (code >= 700 && code < 800) picName = 'clouds2';
    else if (code === 800) picName = 'clear';
    else if (code === 802 || code === 804) picName = 'clouds2';
    else picName = 'clouds1';
  
    return picName;
}

export function changePlaceholderText(placeholderText) {
    document.getElementById('serach-input').placeholder = placeholderText;
}
