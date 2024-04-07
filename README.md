# Arquitectura de Software - Práctico 1

Integrantes:

- Carmela Sotuyo
- Fernando Spillere
- Ignacio Malamud

Ejercicio de práctica del patrón Pipes & Filters, con un componente generador de datos que utiliza faker y axios para enviar los datos al server.

## Arquitectura

[PEGAR CAPTURA DE DIAGRAMA ACA]

## Cómo ejecutar

1. Instalar node modules con `npm i` en cada uno de los componentes
2. Asegurarse de tener instalado Docker y levantar el docker compose con `docker-compose up -d`
3. Pararse sobre el Pipeline y levantarlo con `npm run start`
4. Pararse sobre el Data Generator y levantarlo en otra terminal con `npm run start` con lo que se enviarán las palabras generadas al server y se procesarán en la pipeline

Los resultados de la ejecución se guardan en el archivo results.json dentro del pipeline
