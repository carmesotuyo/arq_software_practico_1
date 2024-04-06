import { QueueFactory } from './pipeline/QueueFactory';
import { Pipeline } from './pipeline/Pipeline';
import { toLowercaseWithSpaces, toUppercase, replaceSpacesWithDots, filterWithRandomError } from './filters/filters';
import { CustomData } from './data-structure/CustomData';
import { data } from '../web-server/server';
require('dotenv').config();

// construye una funcion de creacion de colas dependiendo de un parm se crea una funcion u otra (bull o rabbit)
const queueFactory = QueueFactory.getQueueFactory<CustomData>; //ojo que no la invoca aca si no dentro de la Pipeline

// Crear una nueva instancia de Pipeline usando Bull como backend de la cola
const pipeline = new Pipeline<CustomData>([toLowercaseWithSpaces, filterWithRandomError, toUppercase, replaceSpacesWithDots], queueFactory);

//se crea el listener para cuando un job termina
pipeline.on('finalOutput', (output) => {
  console.log(`Salida final: ${output.data}`);
});

//se crea el listener para cuando un job da error
pipeline.on('errorInFilter', (error, data) => {
  console.error(`Error en el filtro: ${error}, Datos: ${data.data}`);
});

const main = () => {
  //para cada palabra se activa el pipeline con el dato
  for (const word of data.words) {
    let dataToProcess: CustomData = { data: word };
    pipeline.processInput(dataToProcess);
  }
  // publicar los datos en un archivo TODO
};

main();
