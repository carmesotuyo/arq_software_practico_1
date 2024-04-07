// Importa EventEmitter para permitir que nuestra clase emita eventos.
import { EventEmitter } from 'events';
// Importa la interfaz IQueue, que define los métodos que debe tener cualquier cola que usemos.
import { IQueue } from '../queues-providers/IQueue';

// Define el tipo FilterFunction, que es una función que toma cualquier entrada y devuelve cualquier salida.
type FilterFunction<T> = (input: T) => T;

// Declara la clase Pipeline, que extiende EventEmitter para poder emitir eventos.
export class Pipeline<T> extends EventEmitter {
    // filters almacena las funciones de filtro que se aplicarán a los datos de entrada.
    private filters: FilterFunction<T>[];
    // filterQueues es un arreglo que mantiene una correspondencia entre cada filtro y su cola asociada.
    private filterQueues: { filter: FilterFunction<T>, queue: IQueue<T> }[];

    // El constructor toma un arreglo de funciones de filtro y una función factory para crear colas.
    constructor(filters: FilterFunction<T>[], queueFactory: (name: string) => IQueue<T>) {
        super(); // Llama al constructor de EventEmitter.
        this.filters = filters; // Inicializa el arreglo de funciones de filtro.
        this.filterQueues = []; // Inicializa el arreglo de colas de filtros como vacío.
        this.setupQueues(queueFactory); // Configura las colas para cada filtro.
    }

    // setupQueues configura una cola para cada filtro utilizando la función factory proporcionada.
    private setupQueues(queueFactory: (name: string) => IQueue<T>): void {
        // Itera sobre cada filtro y su índice.
        this.filters.forEach((filter, index) => {
            // Crea un nombre único para la cola basado en el índice del filtro.
            const queueName = `filter-queue-${index}`;
            // Usa la función factory para crear una nueva cola.
            const filterQueue = queueFactory(queueName);
            // Añade el filtro y su cola al arreglo filterQueues.
            this.filterQueues.push({ filter, queue: filterQueue });

            // Configura la cola para procesar datos: cuando llegan datos a la cola...
            filterQueue.process(async (data: T) => {
                try {
                    // Aplica la función de filtro a los datos.
                    const filteredData = filter(data);
                    // Envia los datos filtrados al siguiente filtro en la cadena.
                    this.enqueueNextFilter(index, filteredData);
                } catch (err) {
                    // En caso de error en el filtro, emite un evento 'errorInFilter' con el error y los datos.
                    this.emit('errorInFilter', err, data);
                }
            });
        });
    }

    // enqueueNextFilter intenta añadir los datos filtrados a la cola del siguiente filtro.
    private enqueueNextFilter(currentFilterIndex: number, data: T): void {
        // Busca el siguiente filtro en la cadena.
        const nextFilter = this.filterQueues[currentFilterIndex + 1];
        // Si existe un siguiente filtro...
        if (nextFilter) {
            // Añade los datos a la cola del siguiente filtro.
            nextFilter.queue.add( data ); 
        } else {
            // Si no hay más filtros, emite un evento 'finalOutput' con los datos finales.
            this.emit('finalOutput', data);
        }
    }

    // processInput toma datos de entrada y los añade a la cola del primer filtro para comenzar el procesamiento.
    public async processInput(input: T): Promise<void> {
        // Si hay al menos un filtro...
        if (this.filterQueues.length > 0) {
            // Añade los datos de entrada a la cola del primer filtro.
            await this.filterQueues[0].queue.add(input);
        }
    }
}
