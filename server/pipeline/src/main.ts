import { QueueFactory } from './pipeline/QueueFactory';
import { Pipeline } from './pipeline/Pipeline';
import { toLowercaseWithSpaces, toUppercase, replaceSpacesWithDots, filterWithRandomError, recordResults } from './filters/filters';
import { CustomData, CustomDataArray } from './data-structure/CustomData';
const { dataEmitter } = require('../../web-server');
require('dotenv').config();

dataEmitter.on('newData', (newData: CustomDataArray) => {
  console.log('Data received: ' + JSON.stringify(newData, null, 2));
  //para cada palabra se activa el pipeline con el dato
  for (const word of newData.words) {
    let dataToProcess: CustomData = { data: word };
    pipeline.processInput(dataToProcess);
  }
});

// construye una funcion de creacion de colas dependiendo de un parm se crea una funcion u otra (bull o rabbit)
const queueFactory = QueueFactory.getQueueFactory<CustomData>; //ojo que no la invoca aca si no dentro de la Pipeline

// Crear una nueva instancia de Pipeline usando Bull como backend de la cola
const pipeline = new Pipeline<CustomData>([toLowercaseWithSpaces, filterWithRandomError, toUppercase, replaceSpacesWithDots, recordResults], queueFactory);

//se crea el listener para cuando un job termina
pipeline.on('finalOutput', (output) => {
  console.log(`Salida final: ${output.data}`);
});

//se crea el listener para cuando un job da error
pipeline.on('errorInFilter', (error, data) => {
  console.error(`Error en el filtro: ${error}, Datos: ${data.data}`);
});

const main = () => {};

main();
