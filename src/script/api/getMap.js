export class MapClass {
    insertCoordinates(coordsArray, latText, lngText) {
        const lat = coordsArray[1].toFixed(2).toString();
        const lng = coordsArray[0].toFixed(2).toString();
        const template = `<p class="coords-container__coord-row">${latText}: ${lat.replace('.', '°')}'</p>
        <p class="coords-container__coord-row">${lngText}: ${lng.replace('.', '°')}'</p>`;
        document.getElementById('coordinates').innerHTML = template;
    }
    init(coordsArray) {
        mapboxgl.accessToken = 'pk.eyJ1Ijoia29wdG9oaGthIiwiYSI6ImNrYWN0YjU2cTFqdjkydG1rZWloeGFjaTYifQ.ePoZ9VznPV1BoZgMp8eSTA';
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: coordsArray,
            zoom: 13
        });
    }
    flyTo(coordsArr) {
        this.map.flyTo({
            center: coordsArr,
            zoom: 9,
            speed: 2,
            curve: 1,
            easing(t) {
                return t;
            },
        });
    }
}
