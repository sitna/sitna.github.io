# API SITNA
API JavaScript para la visualización de datos georreferenciados en aplicaciones web.

## Documentación
[https://sitna.navarra.es/api/doc/](https://sitna.navarra.es/api/doc/)

## Sobre la API SITNA
La API SITNA es una API JavaScript que permite incluir en páginas y aplicaciones web un visor de mapas interactivo y así representar información georreferenciada.

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
        const myMap = new SITNA.Map("mapa");
    </script>
</body>
</html>
```
Y así tenemos [nuestro primer visor](getting-started/01.html). Podemos observar que está centrado en Navarra y que el mapa de fondo es de un servicio WMTS de IDENA.

### 2. Cambiando el mapa de fondo
Vamos a empezar a modificar los valores por defecto del visor. El constructor de `SITNA.Map` acepta como segundo parámetro un objeto con el que se le pueden pasar opciones de configuración. Supongamos que queremos poner una ortofotografía como mapa de fondo. Para ello introduciremos la opción `baseLayers`:

```javascript
const myMap = new SITNA.Map("mapa", {
    baseLayers: [SITNA.Consts.layer.IGN_ES_ORTHOPHOTO]
});
```
Aquí tenemos [el resultado](getting-started/02.html).
