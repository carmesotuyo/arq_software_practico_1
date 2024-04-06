# Arquitectura de Software - Práctico 1

Integrantes:

- Carmela Sotuyo
- Fernando Spillere
- Ignacio Malamud

Ejercicio de práctica del patrón Pipes & Filters, con un componente generador de datos que utiliza faker y axios para enviar los datos al server.

## Cómo ejecutar

1. Instalar node modules con `npm i` en cada uno de los componentes
2. Pararse sobre el Server y levantarlo con `npx ts-node src/server.ts`
3. Pararse sobre el DataGenerator y levantarlo en otra terminal con `npx ts-node src/sendData.ts` con lo que se comenzarán a enviar las palabras generadas al server, el mismo las irá procesando dentro del pipeline
