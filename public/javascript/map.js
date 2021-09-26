mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: tag.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl())
 
new mapboxgl.Marker()
    .setLngLat(tag.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${tag.title}</h3><p>${tag.location}</p>`
            )
    )
    .addTo(map);