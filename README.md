# API SITNA
API JavaScript para la visualización de datos georreferenciados en aplicaciones web.

## Documentación
[https://sitna.navarra.es/api/doc/](https://sitna.navarra.es/api/doc/)

## Sobre la API SITNA
La API SITNA [es una API JavaScript](how-does-it-work) que permite incluir en páginas y aplicaciones web un visor de mapas interactivo y así representar información georreferenciada.

Es un producto SITNA desarrollado para su uso en aplicaciones web de Gobierno de Navarra, pero puede ser utilizado por cualquier usuario y organización en sus páginas web.

Entre otras capacidades, la API SITNA:
- Ofrece funciones habituales de navegación de los visores de mapas, como zoom, mapa de situación y herramientas de medición.
- Permite buscar un municipio de Navarra por su denominación, una dirección, una parcela catastral o un punto por sus coordenadas, entre otras opciones.
- Tiene una configuración por defecto que permite de manera fácil crear un mapa básico de Navarra, con herramientas de uso común y mapas de fondo procedentes de IDENA, como ortofotos, el mapa base, la cartografía topográfica o el catastro.
- Es posible añadir información geográfica mediante servicios WMS y WMTS.
- Permite crear marcadores puntuales con información asociada.
- También es posible cargar información geográfica desde un fichero en formato KML, GeoJSON u otros.

## Empezando a usar la API SITNA

Para incrustar un visor en una aplicación web, hacen falta tres elementos:
- Un elemento `script` con la dirección de la API SITNA. Normalmente esta será https://sitna.navarra.es/api/.
- Un elemento de bloque, por ejemplo un `div`, que haga de contenedor donde incrustar el visor.
- Un elemento `script` donde se instancie un objeto de la clase `SITNA.Map`. Como parámetro del constructor le pasaremos el identificador del elemento contenedor.

### 1. Visor por defecto
Como primer paso, creamos un documento HTML que incluya los tres elementos:

[[Editar código]](https://jsfiddle.net/bnq56tou/)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Empezando con la API SITNA</title>
</head>
<body>
    <script src="//sitna.navarra.es/api/"></script>
    <div id="mapa"></div>
    <script>
        // Mi primer visor
        const myMap = new SITNA.Map("mapa");
    </script>
</body>
</html>
```
Y así tenemos [nuestro primer visor](getting-started/01.html). Podemos observar que está centrado en Navarra y que el mapa de fondo es de un servicio WMTS de IDENA.

### 2. Cambiando el mapa de fondo
Vamos a empezar a modificar los valores por defecto del visor. El constructor de `SITNA.Map` acepta como segundo parámetro un objeto con el que se le pueden pasar opciones de configuración. Supongamos que queremos poner una ortofotografía como mapa de fondo. Para ello introduciremos la opción `baseLayers`:

[[Editar código]](https://jsfiddle.net/bsreLf6v/)
```javascript
const myMap = new SITNA.Map("mapa", {
    // Establecemos como única capa base la ortofotografía del IGN
    baseLayers: [SITNA.Consts.layer.IGN_ES_ORTHOPHOTO]
});
```
Aquí tenemos [el resultado](getting-started/02.html). `SITNA.Consts.layer.IGN_ES_ORTHOPHOTO` es una constante de la API que representa a la capa de ortofoto de uno de los servicios WMTS del IGN de España.

### 3. Cambiando la extensión inicial del mapa
Supongamos que queremos crear un visor centrado en la Unión Europea. Lo podemos hacer pasándole los valores adecuados a la opción `initialExtent`. Estos son cuatro coordenadas indicando los límites hacia el oeste, sur, este y norte de la extensión inicial del mapa. Dado que por defecto los mapas de la API SITNA utilizan el sistema de referencia de coordenadas EPSG:25830 (uno de los oficiales en la Península Ibérica), hay que introducir las coordenadas en ese sistema de referencia.

[[Editar código]](https://jsfiddle.net/ztvjrqgk/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [SITNA.Consts.layer.IGN_ES_ORTHOPHOTO],
    // Establecemos la extensión inicial [xmin, ymin, xmax, ymax]
    initialExtent: [-1300000, 2900000, 3500000, 8300000]
});
```
El visor tiene ahora [este aspecto](getting-started/03.html).

### 4. Cambiando el sistema de referencia de coordenadas
Podemos comprobar que el mapa de fondo que hemos elegido no es el más adecuado para mostrar un visor de la Unión Europea porque solamente cubre el territorio español, así que hay que elegir otra capa más adecuada para ello. Ya que estamos, vamos a añadir alguna más para dar al usuario la opción de tener distintos mapas de fondo. Vamos a incluir una capa de vista satélite de Mapbox y unos mapas base de Mapbox y Carto.

Pero antes de hacer el cambio, hay que tener en cuenta que esas capas solamente son compatibles con el sistema de referencia de coordenadas EPSG:3857, típico de capas que tienen cobertura mundial. Por tanto, hay que utilizar la opción `crs` para establecerlo. No hay que olvidar establecer las coordenadas de `initialExtent` en el nuevo sistema de referencia de coordenadas.

[[Editar código]](https://jsfiddle.net/kn6w54L0/)
```javascript
const myMap = new SITNA.Map("mapa", {
    // Establecemos cuatro capas para el fondo, por defecto la imagen satélite ofrecida por Mapbox
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    // Establecemos el sistema de referencia de coordenadas (CRS)
    crs: "EPSG:3857",
    // Las coordenadas deben estar en EPSG:3857
    initialExtent: [-8916022, 3179736, 9869141, 11789603]
});
```
Obtenemos [este resultado](getting-started/04.html). Comprueba que si abrimos la pestaña de herramientas, podemos cambiar el mapa de fondo que estamos viendo.

### 5. Añadiendo capas de trabajo
El visor hasta ahora es poco interesante, porque no tenemos más que un fondo. Vamos a añadir alguna capa sobre la que trabajar. Por ejemplo, vamos a añadir una capa que muestra los países de la Unión Europea desde un servicio WMS de la Agencia Europea de Medio Ambiente:

[[Editar código]](https://jsfiddle.net/4dstumx0/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    crs: "EPSG:3857",
    initialExtent: [-8916022, 3179736, 9869141, 11789603],
    // Añadimos una capa de trabajo de tipo WMS
    workLayers: [
        {
            id: "paises",
            type: SITNA.Consts.layerType.WMS,
            url: "https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer",
            layerNames: ["2", "4"]
        }
    ]
});
```
Y ya tenemos [los países en el mapa](getting-started/05.html). Si pulsas sobre un país, enviarás una consulta `GetFeatureInfo` al servicio WMS y obtendrás información relevante.
Los valores de la opción `layerNames` se han obtenido del [documento de capacidades del servicio WMS](https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities).

### 6. Ajustando las capas de trabajo
Tal como está el visor ahora, tenemos información de los países, pero ya no se ve la ortofotografía. Además, si miramos en las herramientas vemos que la capa cargada tiene un nombre poco amigable. Vamos a dejar solo las fronteras y vamos a poner un título a la capa:

[[Editar código]](https://jsfiddle.net/9o83dh2m/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    crs: "EPSG:3857",
    initialExtent: [-8916022, 3179736, 9869141, 11789603],
    workLayers: [
        {
            id: "paises",
            type: SITNA.Consts.layerType.WMS,
            url: "https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer",
            // Dejamos solamente la capa de fronteras del servicio
            layerNames: ["4"],
            // Le ponemos un título a la capa
            title: "Países del mundo"
        }
    ]
});
```
El resultado [es este](getting-started/06.html).

### 7. Añadiendo entidades vectoriales en archivos geográficos
Además de datos raster, es posible añadir datos vectoriales desde un servicio WFS o desde archivos geográficos en formato KML, GeoJSON, etc. Vamos a añadir un par de archivos:

[[Editar código]](https://jsfiddle.net/5qsd7kmz/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    crs: "EPSG:3857",
    initialExtent: [-8916022, 3179736, 9869141, 11789603],
    workLayers: [
        {
            id: "paises",
            type: SITNA.Consts.layerType.WMS,
            url: "https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer",
            layerNames: ["4"],
            title: "Países del mundo"
        },
        // Añadimos una capa con un archivo KML de ríos
        {
            id: "rios",
            type: SITNA.Consts.layerType.VECTOR,
            url: "//sitna.github.io/getting-started/data/rivers.kml",
            title: "Ríos"
        },
        // Añadimos una capa con un archivo GeoJSON de capitales
        {
            id: "capitales",
            type: SITNA.Consts.layerType.VECTOR,
            format: SITNA.Consts.mimeType.GEOJSON,
            url: "//sitna.github.io/getting-started/data/capitals.json",
            title: "Capitales del mundo"
        }
    ]
});
```
Y ya tenemos [dos capas de trabajo más](getting-started/07.html). La API SITNA intenta inferir el formato de archivo geográfico por su extensión en el nombre, por eso la fuente de datos de la capa de ríos es reconocida como un archivo KML. No obstante, el formato se puede especificar mediante la propiedad `format`, como en la capa de capitales.

### 8. Cambiando los controles de usuario
Por defecto, la API SITNA carga con el visor una serie de controles de usuario, como la galería de mapas de fondo o un árbol de capas de trabajo. Los controles que se cargan se pueden cambiar mediante la propiedad `controls` de las opciones de configuración. Por ejemplo, vamos a quitar el árbol de capas de trabajo y en su lugar vamos a poner una tabla de contenidos como la que tiene el visor de IDENA:

[[Editar código]](https://jsfiddle.net/2brn0kL9/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    crs: "EPSG:3857",
    initialExtent: [-8916022, 3179736, 9869141, 11789603],
    workLayers: [
        {
            id: "paises",
            type: SITNA.Consts.layerType.WMS,
            url: "https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer",
            layerNames: ["4"],
            title: "Países del mundo"
        },
        {
            id: "rios",
            type: SITNA.Consts.layerType.VECTOR,
            url: "//sitna.github.io/getting-started/data/rivers.kml",
            title: "Ríos"
        },
        {
            id: "capitales",
            type: SITNA.Consts.layerType.VECTOR,
            format: SITNA.Consts.mimeType.GEOJSON,
            url: "//sitna.github.io/getting-started/data/capitals.json",
            title: "Capitales del mundo"
        }
    ],
    // Quitamos el control TOC y añadimos el control workLayerManager dentro del elemento con identificador "toc"
    controls: {
        TOC: false,
        workLayerManager: {
            div: "toc"
        }
    }
});
```
Si abrimos ahora [el visor](getting-started/08.html), veremos que en "capas cargadas" tendremos una lista ordenada y ordenable de las capas de trabajo.

### 9. Añadiendo marcadores
Una vez configurado el visor, vamos a añadir lógica. Supongamos que queremos añadir al mapa una colección de puntos de interés. Podemos hacerlo añadiendo marcadores geográficos. Para ello, usamos el método `addMarker`, pasándole como parámetro las coordenadas del punto (en el sistema de referencia de coordenadas del mapa, en este caso, EPSG:3857). 

Por otro lado, cuando se introduce lógica que afecta a elementos del mapa, es necesario meterla dentro de una función de callback que pasará como parámetro al método `loaded` del objeto de mapa. De esta forma nos aseguramos de que no se ejecuta hasta que el mapa está cargado correctamente.

[[Editar código]](https://jsfiddle.net/wtrhc1xk/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    crs: "EPSG:3857",
    initialExtent: [-8916022, 3179736, 9869141, 11789603],
    workLayers: [
        {
            id: "paises",
            type: SITNA.Consts.layerType.WMS,
            url: "https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer",
            layerNames: ["4"],
            title: "Países del mundo"
        },
        {
            id: "rios",
            type: SITNA.Consts.layerType.VECTOR,
            url: "//sitna.github.io/getting-started/data/rivers.kml",
            title: "Ríos"
        },
        {
            id: "capitales",
            type: SITNA.Consts.layerType.VECTOR,
            format: SITNA.Consts.mimeType.GEOJSON,
            url: "//sitna.github.io/getting-started/data/capitals.json",
            title: "Capitales del mundo"
        }
    ],
    controls: {
        TOC: false,
        workLayerManager: {
            div: "toc"
        }
    }
});

// Esperamos a que el mapa se cargue
myMap.loaded(() => {
    // Añadimos marcadores
    myMap.addMarker([-203288, 6652999]);
    myMap.addMarker([1390641, 5144550]);
    myMap.addMarker([677254, 6581543]);
    myMap.addMarker([-399432, 4463713]);
    myMap.addMarker([-720856, 7112550]);
    myMap.addMarker([2641252, 4575413]);
    myMap.addMarker([236074, 6241789]);
});
```
Así se ha añadido [un conjunto de marcadores](getting-started/09.html) representando puntos de interés.

### 10. Creando la capa para los marcadores
Si no se especifica nada más que las coordenadas en la llamada la método `addMarker`, la API SITNA crea una capa de tipo `SITNA.Consts.layerType.VECTOR` para añadir a ella los marcadores. Por eso, si revisamos cómo está el visor actualmente, veremos que en "capas cargadas" hay una nueva capa con título "Vectores" que contiene los marcadores que hemos añadido. 

Pero generalmente nos interesa añadir los marcadores a una capa concreta, así que vamos a hacer eso: añadiremos una capa al mapa y cuando esté lista añadiremos los marcadores a ella.

[[Editar código]](https://jsfiddle.net/k2zm1cq8/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    crs: "EPSG:3857",
    initialExtent: [-8916022, 3179736, 9869141, 11789603],
    workLayers: [
        {
            id: "paises",
            type: SITNA.Consts.layerType.WMS,
            url: "https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer",
            layerNames: ["4"],
            title: "Países del mundo"
        },
        {
            id: "rios",
            type: SITNA.Consts.layerType.VECTOR,
            url: "//sitna.github.io/getting-started/data/rivers.kml",
            title: "Ríos"
        },
        {
            id: "capitales",
            type: SITNA.Consts.layerType.VECTOR,
            format: SITNA.Consts.mimeType.GEOJSON,
            url: "//sitna.github.io/getting-started/data/capitals.json",
            title: "Capitales del mundo"
        }
    ],
    controls: {
        TOC: false,
        workLayerManager: {
            div: "toc"
        }
    }
});

myMap.loaded(() => {
    // Creamos una capa de tipo vectorial para los marcadores
    myMap.addLayer({
        id: "poi",
        type: SITNA.Consts.layerType.VECTOR,
        title: "Puntos de interés"
    }, () => {
        // Creamos los marcadores en la capa creada
        myMap.addMarker([-203288, 6652999], { layer: "poi" });
        myMap.addMarker([1390641, 5144550], { layer: "poi" });
        myMap.addMarker([677254, 6581543], { layer: "poi" });
        myMap.addMarker([-399432, 4463713], { layer: "poi" });
        myMap.addMarker([-720856, 7112550], { layer: "poi" });
        myMap.addMarker([2641252, 4575413], { layer: "poi" });
        myMap.addMarker([236074, 6241789], { layer: "poi" });
    });
});
```
Ahora [los marcadores están en la capa "Puntos de interés"](getting-started/10.html).

### 11. Enriqueciendo los marcadores.
Por ahora los marcadores no dicen mucho. Vamos a añadirles información. Por un lado, vamos a meterlos en grupos. Si metemos un marcador en un grupo, tendrá un icono diferenciado que se mostrará en la leyenda. Eso se hace con la propiedad `group`. Por otro lado, vamos a meter atributos al marcador. Esto se hace asignando un diccionario de pares clave-valor a la propiedad `data`.

[[Editar código]](https://jsfiddle.net/kx91nwjr/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [
        SITNA.Consts.layer.MAPBOX_SATELLITE,
        SITNA.Consts.layer.MAPBOX_STREETS,
        SITNA.Consts.layer.CARTO_LIGHT,
        SITNA.Consts.layer.CARTO_DARK
    ],
    crs: "EPSG:3857",
    initialExtent: [-8916022, 3179736, 9869141, 11789603],
    workLayers: [
        {
            id: "paises",
            type: SITNA.Consts.layerType.WMS,
            url: "https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer",
            layerNames: ["4"],
            title: "Países del mundo"
        },
        {
            id: "rios",
            type: SITNA.Consts.layerType.VECTOR,
            url: "//sitna.github.io/getting-started/data/rivers.kml",
            title: "Ríos"
        },
        {
            id: "capitales",
            type: SITNA.Consts.layerType.VECTOR,
            format: SITNA.Consts.mimeType.GEOJSON,
            url: "//sitna.github.io/getting-started/data/capitals.json",
            title: "Capitales del mundo"
        }
    ],
    controls: {
        TOC: false,
        workLayerManager: {
            div: "toc"
        }
    }
});

myMap.loaded(() => {
    myMap.addLayer({
        id: "poi",
        type: SITNA.Consts.layerType.VECTOR,
        title: "Puntos de interés"
    }, () => {
        myMap.addMarker([-203288, 6652999], {
            layer: "poi",
            // Establecemos un grupo para este marcador
            group: "Prehistoria",
            // Añadimos atributos a este marcador
            data: {
                "Nombre": "Stonehenge",
                "Fecha de inicio de construcción": "2400-2200 a.e.c.",
                "Uso": "Desconocido"
            }
        });
        myMap.addMarker([1390641, 5144550], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Coliseo",
                "Fecha de inicio de construcción": "72 e.c.",
                "Uso": "Anfiteatro"
            }
        });
        myMap.addMarker([677254, 6581543], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Catedral de Aquisgrán",
                "Fecha de inicio de construcción": "796",
                "Uso": "Templo"
            }
        });
        myMap.addMarker([-399432, 4463713], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Alhambra",
                "Fecha de inicio de construcción": "c. 1238",
                "Uso": "Residencia"
            }
        });
        myMap.addMarker([-720856, 7112550], {
            layer: "poi",
            group: "Prehistoria",
            data: {
                "Nombre": "Newgrange",
                "Fecha de inicio de construcción": "3300-2900 a.e.c.",
                "Uso": "Funerario"
            }
        });
        myMap.addMarker([2641252, 4575413], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Partenón",
                "Fecha de inicio de construcción": "447 a.e.c.",
                "Uso": "Templo"
            }
        });
        myMap.addMarker([236074, 6241789], {
            layer: "poi",
            group: "Edad Moderna",
            data: {
                "Nombre": "Palacio de Versalles",
                "Fecha de inicio de construcción": "1661",
                "Uso": "Residencia"
            }
        });
    });
});
```
Con estos cambios, los marcadores [están clasificados y tienen información asociada](getting-started/11.html).

### 12. Estableciendo una maquetación
Aunque en base a parámetros del constructor de `SITNA.Map` es posible un gran grado de personalización, puede no ser suficiente. Por ejemplo, puede interesar que el visor tenga una imagen corporativa, o que incluya controles de usuario en lugares distintos a los ofrecidos por defecto. Para esos casos existe el mecanismo de maquetación. Una maquetación, o `layout` es una carpeta donde habrá uno o más de los siguientes archivos:
- Un [documento JSON](getting-started/layout/my-layout/config.json) con la configuración a pasar al objeto de mapa.
- Un [documento de texto con HTML](getting-started/layout/my-layout/markup.html) representando el marcado que deseamos que se incruste en el contenedor del mapa. Este marcado será el andamiaje donde se colocarán los controles de usuario.
- Una [hoja CSS](getting-started/layout/my-layout/style.css).
- Un [archivo JavaScript](getting-started/layout/my-layout/script.js) donde meter la lógica concerniente a los elementos del marcado.

Vamos a quitar de los parámetros del constructor la configuración del visor que hemos creado y la vamos a añadir a una maquetación:

[[Editar código]](https://jsfiddle.net/9xc3shob/)
```javascript
const myMap = new SITNA.Map("mapa", {
    // Instanciamos el mapa con una maquetación personalizada
    layout: "layout/my-layout"
});

myMap.loaded(() => {
    myMap.addLayer({
        id: "poi",
        type: SITNA.Consts.layerType.VECTOR,
        title: "Puntos de interés"
    }, () => {
        myMap.addMarker([-203288, 6652999], {
            layer: "poi",
            group: "Prehistoria",
            data: {
                "Nombre": "Stonehenge",
                "Fecha de inicio de construcción": "2400-2200 a.e.c.",
                "Uso": "Desconocido"
            }
        });
        myMap.addMarker([1390641, 5144550], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Coliseo",
                "Fecha de inicio de construcción": "72 e.c.",
                "Uso": "Anfiteatro"
            }
        });
        myMap.addMarker([677254, 6581543], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Catedral de Aquisgrán",
                "Fecha de inicio de construcción": "796",
                "Uso": "Templo"
            }
        });
        myMap.addMarker([-399432, 4463713], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Alhambra",
                "Fecha de inicio de construcción": "c. 1238",
                "Uso": "Residencia"
            }
        });
        myMap.addMarker([-720856, 7112550], {
            layer: "poi",
            group: "Prehistoria",
            data: {
                "Nombre": "Newgrange",
                "Fecha de inicio de construcción": "3300-2900 a.e.c.",
                "Uso": "Funerario"
            }
        });
        myMap.addMarker([2641252, 4575413], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Partenón",
                "Fecha de inicio de construcción": "447 a.e.c.",
                "Uso": "Templo"
            }
        });
        myMap.addMarker([236074, 6241789], {
            layer: "poi",
            group: "Edad Moderna",
            data: {
                "Nombre": "Palacio de Versalles",
                "Fecha de inicio de construcción": "1661",
                "Uso": "Residencia"
            }
        });
    });
});
```
Ahora tenemos un [visor con una maquetación personalizada](getting-started/12.html). Hemos eliminado controles superfluos y hemos colocado los que nos interesan en otro contenedor.
