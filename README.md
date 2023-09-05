# Introducción a la API SITNA

## Documentación y repositorio
- [https://sitna.navarra.es/api/doc/](https://sitna.navarra.es/api/doc/)
- [https://github.com/sitna/api-sitna](https://github.com/sitna/api-sitna)

## Sobre la API SITNA
La API SITNA [es una API JavaScript](how-does-it-work) que permite incluir en páginas y aplicaciones web un visor de mapas interactivo y así representar información georreferenciada.

Es un producto SITNA desarrollado para su uso en aplicaciones web de Gobierno de Navarra, pero puede ser utilizado por cualquier usuario y organización en sus páginas web.

Entre otras capacidades, la API SITNA:
- Ofrece funciones habituales de navegación de los visores de mapas, como zoom, mapa de situación y herramientas de medición.
- Permite buscar un municipio de Navarra por su denominación, una dirección, una parcela catastral o un punto por sus coordenadas, entre otras opciones.
- Tiene una configuración por defecto que permite de manera fácil crear un mapa básico de Navarra, con herramientas de uso común y mapas de fondo procedentes de IDENA, como ortofotos, el mapa base, la cartografía topográfica o el catastro.
- Es posible añadir información geográfica mediante servicios [WMS](https://es.wikipedia.org/wiki/Web_Map_Service), [WMTS](https://en.wikipedia.org/wiki/Web_Map_Tile_Service) y [WFS](https://es.wikipedia.org/wiki/Web_Feature_Service).
- Permite crear marcadores puntuales con información asociada.
- También es posible cargar información geográfica desde un fichero en formato KML, GeoJSON u otros.

## Componentes de un mapa

Un mapa típico desde el punto de vista de información geográfica está compuesto de capas, que son imágenes que cubren el área de visualización del mapa y que se superponen unas sobre otras al estilo de las hojas de un cuaderno. Cada capa representa un tipo de información geográfica. De este modo, lo habitual es que haya una capa de fondo y una o varias capas de trabajo. Las capas de fondo sirven para tener una referencia geográfica que haga de marco de la información que queremos representar, las capas de trabajo contienen la información geográfica que queremos transmitir con nuestro mapa.

Por ejemplo, supongamos que queremos crear un mapa de nuestro pueblo en el que se muestren las zonas con más riesgo de ser anegadas en una hipotética inundación. Como capa de fondo podemos poner una cartografía que muestre la zona del pueblo. Por encima podemos colocar la capa de zonas de riesgo de inundabilidad, ([disponible públicamente a través de la Infraestructura de Datos Espaciales de Navarra](https://tinyurl.com/3udbnb88)). También sería útil superponer la capa de [parcelas rústicas](https://tinyurl.com/ywvpcvsx) para poder contactar con los posibles afectados.

![Superposición de capas en un mapa](/img/layers.png)

Desde el punto de vista de la representación de los datos, las capas pueden ser de dos tipos: pueden ser una matriz de pixels (una capa raster) o representar los elementos como entidades geométricas (una capa vectorial).

Por cierto, el resultado de esta superposición de capas que hemos confeccionado como ejemplo es [este](getting-started/layers-example.html).

## Empezando a usar la API SITNA

Para incrustar un visor en una aplicación web, hacen falta tres elementos:
- Un elemento `script` con la dirección de la API SITNA. Normalmente esta será **https://sitna.navarra.es/api/**.
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
Vamos a empezar a modificar los valores por defecto del visor. El [constructor](https://sitna.navarra.es/api/doc/SITNA.Map.html) de `SITNA.Map` acepta como segundo parámetro un objeto con el que se le pueden pasar opciones de configuración para modificar su aspecto y comportamiento. 

Supongamos que queremos poner una ortofotografía como mapa de fondo. Para ello introduciremos la opción `baseLayers`. Hay varias maneras de usar esta opción, pero empezaremos por la mas sencilla: En la [documentación](https://sitna.navarra.es/api/doc/SITNA.Consts.layer.html) tenemos una lista de capas predeterminadas que podemos instanciar mediante una constante del espacio de nombres `SITNA.Consts.layer`. Basta con asignarle a la opción `baseLayers` un array con un elemento cuyo valor es la constante correspondiente a la capa deseada:

[[Editar código]](https://jsfiddle.net/bsreLf6v/)
```javascript
const myMap = new SITNA.Map("mapa", {
    // Establecemos como única capa base la ortofotografía del IGN
    baseLayers: [SITNA.Consts.layer.IGN_ES_ORTHOPHOTO]
});
```
Aquí tenemos [el resultado](getting-started/02.html). `SITNA.Consts.layer.IGN_ES_ORTHOPHOTO` es una constante de la API que representa a la capa de ortofoto de uno de los servicios WMTS del IGN de España.

### 3. Cambiando la extensión inicial del mapa
Supongamos que queremos crear un visor centrado en la Unión Europea. Lo podemos hacer pasándole los valores adecuados a la opción `initialExtent`. Estos son cuatro coordenadas indicando los límites hacia el oeste, sur, este y norte de la extensión inicial del mapa. Dado que por defecto los mapas de la API SITNA utilizan el sistema de referencia de coordenadas EPSG:25830 (uno de los oficiales en la Península Ibérica), hay que introducir las coordenadas en ese sistema de referencia. De momento no te preocupes sobre qué es un sistema de referencia de coordenadas o el valor de los límites de los cuatro puntos cardinales, los explicaremos en el siguiente punto.

[[Editar código]](https://jsfiddle.net/v3yxdhbj/)
```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [SITNA.Consts.layer.IGN_ES_ORTHOPHOTO],
    // Establecemos la extensión inicial [xmin, ymin, xmax, ymax]
    initialExtent: [-130000, 3850000, 1100000, 4850000]
});
```
El visor tiene ahora [este aspecto](getting-started/03.html).

### ¿Qué es un sistema de referencia de coordenadas?
Para abordar el problema de identificar las distintas posiciones en la superficie de la tierra una aproximación válida sería asignar a cada punto de esta superficie un par de coordenadas. De este modo un mapa no sería más que un gráfico con su eje de abscisas (x) y su eje de ordenadas (y), en el que la representación de cada punto de la superficie de la tierra estaría situada en su coordenada correspondiente.

Pero esto no es un problema sencillo porque es imposible proyectar la superficie de la esfera sobre un plano sin que quede distorsionada. El resultado es que cualquier mapa falsea formas, áreas, direcciones y/o distancias. La cuestión se agrava si tenemos en cuenta que el planeta Tierra no es exactamente esférico, introduciendo distorsiones adicionales. Si ajustamos el modelo geodésico del planeta y las transformaciones matemáticas para asignar coordenadas, podemos minimizar la distorsión generada en una región del planeta, pero a costa de agravarla en el resto de las regiones. Es por eso que existen cientos de "recetas" para definir las coordenadas de los puntos del planeta, cada una de ellas o bien está optimizada para una región de la Tierra o bien es una solución de compromiso para su uso a nivel global. Cada una de estas recetas es un sistema de referencia de coordenadas (también llamado CRS por sus siglas en inglés).

De pendiendo de la magnitud que se utiliza como coordenada, los CRS se pueden clasificar en sistemas de referencia geográficos (que utilizan una unidad de ángulo en las coordenadas, generalmente el grado) y sistemas de referencia proyectados (que utilizan una unidad de distancia en sus coordenadas, generalmente el metro).

Con el propósito de identificar los CRS, el European Petroleum Survey Group confeccionó una lista y les asignó un código numérico este código se conoce actualmente como EPSG. El CRS oficial en la zona de Navarra es el **EPSG:25830** por lo que es el CRS por defecto de la API SITNA. Otros CRS de interés son **EPSG:3857**, CRS de carácter global utilizado por los servicios de mapas más conocidos, como Google Maps u OpenStreetMaps, y **EPSG:4326**, sistema de referencia geográfico global.

El ejemplo anterior, los valores de la opción `initialExtent` son coordenadas de una región que cubre aproximadamente la Península Ibérica en el CRS EPSG:25830.

### 4. Cambiando el sistema de referencia de coordenadas
Podemos comprobar que el mapa de fondo que hemos elegido no es el más adecuado para mostrar un visor de la Unión Europea porque solamente cubre el territorio español, así que hay que elegir otra capa más adecuada para ello.

Pero antes de hacer el cambio, hay que tener en cuenta que esta capa solamente es compatible con el sistema de referencia de coordenadas EPSG:3857, típico de capas que tienen cobertura mundial. Por tanto, hay que utilizar la opción `crs` para establecerlo. No hay que olvidar establecer las coordenadas de `initialExtent` en el nuevo sistema de referencia de coordenadas.

[[Editar código]](https://jsfiddle.net/5u7nj6xk/)
```javascript
const myMap = new SITNA.Map("mapa", {
    // Establecemos como capa de fondo la imagen satélite ofrecida por Mapbox
    baseLayers: [SITNA.Consts.layer.MAPBOX_SATELLITE],
    // Establecemos el sistema de referencia de coordenadas (CRS)
    crs: "EPSG:3857",
    // Las coordenadas deben estar en EPSG:3857
    initialExtent: [-8916022, 3179736, 9869141, 11789603]
});
```
Obtenemos [este resultado](getting-started/04.html).

### 5. Añadiendo capas de fondo
Tenemos una capa de imagen satélite como fondo, pero el visor tiene incorporado un control para seleccionar la capa de fondo, así que le podemos poner más de una. Vamos a incluir una capa de vista satélite de Mapbox y unos mapas base de Mapbox y Carto.

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
Ahora [puedes comprobar](getting-started/05.html) que si abrimos la pestaña de herramientas, podemos cambiar el mapa de fondo que estamos viendo.

### 6. Añadiendo capas de trabajo
El visor hasta ahora es poco interesante, porque no tenemos más que un fondo. Vamos a añadir alguna capa sobre la que trabajar. Para visualizar mapas por internet existe el estándar [WMS](https://es.wikipedia.org/wiki/Web_Map_Service). Las infraestructuras de 
datos espaciales suelen disponer de catálogos de servicios WMS públicos que se pueden explotar, Por ejemplo, este es el [catálogo de la Infraestructura de Datos Espaciales de España](https://idee.es/web/idee/segun-tipo-de-servicio).

Vamos a añadir una capa que muestra los países de la Unión Europea desde un servicio ofrecido por la Agencia Europea de Medio Ambiente:

[[Editar código]](https://jsfiddle.net/jbqntxcr/)
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
            layerNames: ["1", "3"]
        }
    ]
});
```
Y ya tenemos [los países en el mapa](getting-started/06.html). Si pulsas sobre un país, enviarás una consulta `GetFeatureInfo` al servicio WMS y obtendrás información relevante.
Los valores de la opción `layerNames` se han obtenido del [documento de capacidades del servicio WMS](https://bio.discomap.eea.europa.eu/arcgis/services/Internal/Basemap_EEA38_WM/MapServer/WMSServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities).

Las infraestructuras de datos espaciales ofrecen catálogos de servicios WMS públicos

### 7. Ajustando las capas de trabajo
Tal como está el visor ahora, tenemos información de los países, pero ya no se ve la ortofotografía. Además, si miramos en las herramientas vemos que la capa cargada tiene un nombre poco amigable. Vamos a dejar solo las fronteras y vamos a poner un título a la capa:

[[Editar código]](https://jsfiddle.net/h9q7fnrd/)
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
            layerNames: ["3"],
            // Le ponemos un título a la capa
            title: "Países del mundo"
        }
    ]
});
```
El resultado [es este](getting-started/07.html).

### 8. Añadiendo entidades vectoriales en archivos geográficos
Además de datos raster, es posible añadir datos vectoriales desde un servicio WFS o desde archivos geográficos en formato KML, GeoJSON, etc. Vamos a añadir un par de archivos:

[[Editar código]](https://jsfiddle.net/2p4Lvnbr/)
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
            layerNames: ["3"],
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
Y ya tenemos [dos capas de trabajo más](getting-started/08.html). La API SITNA intenta inferir el formato de archivo geográfico por su extensión en el nombre, por eso la fuente de datos de la capa de ríos es reconocida como un archivo KML. No obstante, el formato se puede especificar mediante la propiedad `format`, como en la capa de capitales.

### 9. Cambiando los controles de usuario
Por defecto, la API SITNA carga con el visor una serie de controles de usuario, como la galería de mapas de fondo o un árbol de capas de trabajo. En la [documentación](https://sitna.navarra.es/api/doc/global.html#MapControlOptions) hay una lista con ejemplos de los controles que se pueden utilizar. Los controles que se cargan se pueden cambiar mediante la propiedad `controls` de las opciones de configuración. Por ejemplo, vamos a quitar el árbol de capas de trabajo y en su lugar vamos a poner una tabla de contenidos como la que tiene el visor de IDENA:

[[Editar código]](https://jsfiddle.net/4q5snat3/)
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
            layerNames: ["3"],
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
Si abrimos ahora [el visor](getting-started/09.html), veremos que en "capas cargadas" tendremos una lista ordenada y ordenable de las capas de trabajo.

### 10. Añadiendo marcadores
Una vez configurado el visor, vamos a añadir lógica. Supongamos que queremos añadir al mapa una colección de puntos de interés. Podemos hacerlo añadiendo marcadores geográficos. Para ello, usamos el método `addMarker`, pasándole como parámetro las coordenadas del punto (en el sistema de referencia de coordenadas del mapa, en este caso, EPSG:3857). 

Por otro lado, cuando se introduce lógica que afecta a elementos del mapa, es necesario meterla dentro de una función de callback que pasará como parámetro al método `loaded` del objeto de mapa. De esta forma nos aseguramos de que no se ejecuta hasta que el mapa está cargado correctamente.

[[Editar código]](https://jsfiddle.net/nb9gzfk4/)
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
            layerNames: ["3"],
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
Así se ha añadido [un conjunto de marcadores](getting-started/10.html) representando puntos de interés.

### 11. Creando la capa para los marcadores
Si no se especifica nada más que las coordenadas en la llamada la método `addMarker`, la API SITNA crea una capa de tipo `SITNA.Consts.layerType.VECTOR` para añadir a ella los marcadores. Por eso, si revisamos cómo está el visor actualmente, veremos que en "capas cargadas" hay una nueva capa con título "Vectores" que contiene los marcadores que hemos añadido. 

Pero generalmente nos interesa añadir los marcadores a una capa concreta, así que vamos a hacer eso: añadiremos una capa al mapa y cuando esté lista añadiremos los marcadores a ella.

[[Editar código]](https://jsfiddle.net/wyfzd5ka/)
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
            layerNames: ["3"],
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
Ahora [los marcadores están en la capa "Puntos de interés"](getting-started/11.html).

### 12. Enriqueciendo los marcadores.
Por ahora los marcadores no dicen mucho. Vamos a añadirles información. Por un lado, vamos a meterlos en grupos. Si metemos un marcador en un grupo, tendrá un icono diferenciado que se mostrará en la leyenda. Eso se hace con la propiedad `group`. Por otro lado, vamos a meter atributos al marcador. Esto se hace asignando un diccionario de pares clave-valor a la propiedad `data`.

[[Editar código]](https://jsfiddle.net/9yv4zLob/)
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
            layerNames: ["3"],
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
Con estos cambios, los marcadores [están clasificados y tienen información asociada](getting-started/12.html).

### 13. Añadiendo atributos de imagen.
Ahora tenemos información asociada a cada marcador, pero es exclusivamente textual, y sería interesante añadir una fotografía ilustrativa. Afortunadamente la API SITNA ofrece [un mecanismo](https://sitna.navarra.es/api/doc/tutorial-4-embedding.html) para insertar atributos de imagen a un marcador.

[[Editar código]](https://jsfiddle.net/m86kjvwq/)
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
            layerNames: ["3"],
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
            group: "Prehistoria",
            data: {
                "Nombre": "Stonehenge",
                "Fecha de inicio de construcción": "2400-2200 a.e.c.",
                "Uso": "Desconocido",
                // Añadimos un atributo con nombre en un formato específico para identificarlo como imagen
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/stonehenge.jpg"
            }
        });
        myMap.addMarker([1390641, 5144550], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Coliseo",
                "Fecha de inicio de construcción": "72 e.c.",
                "Uso": "Anfiteatro",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/colosseum.jpg"
            }
        });
        myMap.addMarker([677254, 6581543], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Catedral de Aquisgrán",
                "Fecha de inicio de construcción": "796",
                "Uso": "Templo",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/aachen.jpg"
            }
        });
        myMap.addMarker([-399432, 4463713], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Alhambra",
                "Fecha de inicio de construcción": "c. 1238",
                "Uso": "Residencia",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/alhambra.jpg"
            }
        });
        myMap.addMarker([-720856, 7112550], {
            layer: "poi",
            group: "Prehistoria",
            data: {
                "Nombre": "Newgrange",
                "Fecha de inicio de construcción": "3300-2900 a.e.c.",
                "Uso": "Funerario",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/newgrange.jpg"
            }
        });
        myMap.addMarker([2641252, 4575413], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Partenón",
                "Fecha de inicio de construcción": "447 a.e.c.",
                "Uso": "Templo",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/parthenon.jpg"
            }
        });
        myMap.addMarker([236074, 6241789], {
            layer: "poi",
            group: "Edad Moderna",
            data: {
                "Nombre": "Palacio de Versalles",
                "Fecha de inicio de construcción": "1661",
                "Uso": "Residencia",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/versailles.jpg"
            }
        });
    });
});
```
Los marcadores [ahora tienen un atributo de imagen](getting-started/13.html).

### 14. Estableciendo una maquetación
Aunque en base a parámetros del constructor de `SITNA.Map` es posible un gran grado de personalización, puede no ser suficiente. Por ejemplo, puede interesar que el visor tenga una imagen corporativa, o que incluya controles de usuario en lugares distintos a los ofrecidos por defecto. Para esos casos existe el mecanismo de maquetación. Una maquetación, o `layout` es una carpeta donde habrá uno o más de los siguientes archivos:
- Un [documento JSON](getting-started/layout/my-layout/config.json) con la configuración a pasar al objeto de mapa.
- Un [documento de texto con HTML](getting-started/layout/my-layout/markup.html) representando el marcado que deseamos que se incruste en el contenedor del mapa. Este marcado será el andamiaje donde se colocarán los controles de usuario.
- Una [hoja CSS](getting-started/layout/my-layout/style.css).
- Un [archivo JavaScript](getting-started/layout/my-layout/script.js) donde meter la lógica concerniente a los elementos del marcado.

Vamos a quitar de los parámetros del constructor la configuración del visor que hemos creado y la vamos a añadir a una maquetación:

[[Editar código]](https://jsfiddle.net/fven64wj/)
```javascript
const myMap = new SITNA.Map("mapa", {
    // Instanciamos el mapa con una maquetación personalizada
    layout: "//sitna.github.io/getting-started/layout/my-layout"
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
                "Uso": "Desconocido",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/stonehenge.jpg"
            }
        });
        myMap.addMarker([1390641, 5144550], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Coliseo",
                "Fecha de inicio de construcción": "72 e.c.",
                "Uso": "Anfiteatro",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/colosseum.jpg"
            }
        });
        myMap.addMarker([677254, 6581543], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Catedral de Aquisgrán",
                "Fecha de inicio de construcción": "796",
                "Uso": "Templo",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/aachen.jpg"
            }
        });
        myMap.addMarker([-399432, 4463713], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Alhambra",
                "Fecha de inicio de construcción": "c. 1238",
                "Uso": "Residencia",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/alhambra.jpg"
            }
        });
        myMap.addMarker([-720856, 7112550], {
            layer: "poi",
            group: "Prehistoria",
            data: {
                "Nombre": "Newgrange",
                "Fecha de inicio de construcción": "3300-2900 a.e.c.",
                "Uso": "Funerario",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/newgrange.jpg"
            }
        });
        myMap.addMarker([2641252, 4575413], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Partenón",
                "Fecha de inicio de construcción": "447 a.e.c.",
                "Uso": "Templo",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/parthenon.jpg"
            }
        });
        myMap.addMarker([236074, 6241789], {
            layer: "poi",
            group: "Edad Moderna",
            data: {
                "Nombre": "Palacio de Versalles",
                "Fecha de inicio de construcción": "1661",
                "Uso": "Residencia",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/versailles.jpg"
            }
        });
    });
});
```
Ahora tenemos un [visor con una maquetación personalizada](getting-started/14.html). Hemos eliminado controles superfluos y hemos colocado los que nos interesan en otro contenedor.

### 15. Trabajando con entidades geográficas
Los objetos del mapa son instancias de clases que tienen métodos y propiedades para poder ser manipuladas. Vamos a añadir un botón de búsqueda de ciudades. Para ello vamos a obtener la instancia de capa de ciudades y vamos a recorrer la colección de instancias de entidades geográficas hasta encontrar una cuyo nombre encaja con el patrón de búsqueda.

[[Editar código]](https://jsfiddle.net/zb4jsoy1/)
```javascript
const myMap = new SITNA.Map("mapa", {
    // Instanciamos el mapa con una maquetación personalizada
    layout: "//sitna.github.io/getting-started/layout/my-layout"
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
                "Uso": "Desconocido",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/stonehenge.jpg"
            }
        });
        myMap.addMarker([1390641, 5144550], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Coliseo",
                "Fecha de inicio de construcción": "72 e.c.",
                "Uso": "Anfiteatro",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/colosseum.jpg"
            }
        });
        myMap.addMarker([677254, 6581543], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Catedral de Aquisgrán",
                "Fecha de inicio de construcción": "796",
                "Uso": "Templo",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/aachen.jpg"
            }
        });
        myMap.addMarker([-399432, 4463713], {
            layer: "poi",
            group: "Edad Media",
            data: {
                "Nombre": "Alhambra",
                "Fecha de inicio de construcción": "c. 1238",
                "Uso": "Residencia",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/alhambra.jpg"
            }
        });
        myMap.addMarker([-720856, 7112550], {
            layer: "poi",
            group: "Prehistoria",
            data: {
                "Nombre": "Newgrange",
                "Fecha de inicio de construcción": "3300-2900 a.e.c.",
                "Uso": "Funerario",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/newgrange.jpg"
            }
        });
        myMap.addMarker([2641252, 4575413], {
            layer: "poi",
            group: "Edad Antigua",
            data: {
                "Nombre": "Partenón",
                "Fecha de inicio de construcción": "447 a.e.c.",
                "Uso": "Templo",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/parthenon.jpg"
            }
        });
        myMap.addMarker([236074, 6241789], {
            layer: "poi",
            group: "Edad Moderna",
            data: {
                "Nombre": "Palacio de Versalles",
                "Fecha de inicio de construcción": "1661",
                "Uso": "Residencia",
                "Fotografía__image_auto_200": "//sitna.github.io/getting-started/img/versailles.jpg"
            }
        });

        // Añadimos un botón de búsqueda de ciudades
        const searchButton = document.createElement("button");
        searchButton.setAttribute("id", "search-button");
        searchButton.addEventListener("click", function (e) {
            const pattern = prompt("Nombre de ciudad");
            const patternRegExp = new RegExp(pattern, "i");
            const capitalsLayer = myMap.getLayer("capitales");
            const foundFeature = capitalsLayer.features
                .find(feature => patternRegExp.test(feature.getData().name));
            if (foundFeature) {
                // Resaltamos la entidad encontrada
                foundFeature.setStyle({
                    strokeColor: "#009900"
                });
                // Centramos el mapa en la entidad geográfica y con un radio de 10 km
                const center = foundFeature.getCoordinates();
                const radius = 10000;
                myMap.setExtent([
                    center[0] - radius,
                    center[1] - radius,
                    center[0] + radius, 
                    center[1] + radius
                ], { 
                    animate: true 
                });
            }
        });
        document.getElementById("toggles").appendChild(searchButton);
    });
});
```
[Este es el resultado.](getting-started/15.html)
