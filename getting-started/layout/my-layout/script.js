myMap.loaded(() => {
    const basemapsControlContainer = document.getElementById('basemaps');
    const layersControlContainer = document.getElementById('layers');
    const basemapsToggle = document.getElementById('basemaps-toggle');
    const layersToggle = document.getElementById('layers-toggle');

    basemapsToggle.addEventListener('click', function (e) {
        layersControlContainer.classList.add('lo-hidden');
        basemapsControlContainer.classList.toggle('lo-hidden');
    });

    layersToggle.addEventListener('click', function (e) {
        basemapsControlContainer.classList.add('lo-hidden');
        layersControlContainer.classList.toggle('lo-hidden');
    });
});
