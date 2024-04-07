// Importa Bull y algunos tipos específicos de Bull para trabajar con colas y trabajos.
import Bull, { Job, Queue as BullQueue } from 'bull';
// Importa la interfaz IQueue que define los métodos que cualquier implementación de cola debe tener.
import { IQueue } from './IQueue';

// Define la clase BullQueueAdapter que implementa la interfaz genérica IQueue.
export class BullQueueAdapter<T> implements IQueue<T> {
    // Propiedad privada que almacena la instancia de la cola de Bull.
    private queue: BullQueue;

    // El constructor toma un nombre de cola y crea una nueva instancia de cola Bull con ese nombre.
    constructor(queueName: string) {
        this.queue = new Bull(queueName);
    }

    // Método async para añadir datos a la cola. 
    // 'data' es el dato de tipo genérico T que se quiere encolar.
    async add(data: T): Promise<void> {
        // Añade el dato a la cola usando el método 'add' de Bull.
        await this.queue.add(data);
    }

    // Método para procesar los datos en la cola. 
    // 'callback' es la función que se llamará con cada dato encolado para procesarlo.
    process(callback: (data: T) => Promise<void>): void {
        // Configura el procesador de la cola usando el método 'process' de Bull.
        // Para cada trabajo en la cola, Bull pasará el trabajo al callback.
        this.queue.process(async (job: Job) => {
            // Llama al callback proporcionado con los datos del trabajo.
            // 'job.data' contiene el dato encolado de tipo T.
            await callback(job.data);
        });
    }
}
