# ¿Cómo funciona la API SITNA?

## ¿Qué motor utiliza?
Internamente la API SITNA se basa en el motor de [OpenLayers](https://openlayers.org).

## ¿Qué datos geográficos muestra?
Datos raster y datos vectoriales, en 2D y en un globo 3D.

## ¿Cómo consume los datos?
La API SITNA se basa enteramente en estándares. Las fuentes de datos se dividen en dos tipos:
- Servicios OGC: raster (WMS, WMTS) y vectoriales (WFS).
- Archivos de datos: KML, KMZ, GeoJSON, GML, WKT, Shape, GeoPackage, JPEG, PNG

## ¿Cómo se configura?
Tres vías, por orden de prioridad:
- Parámetros del constructor `SITNA.Map`
- Maquetación
- Objeto de configuración global `SITNA.Cfg`
