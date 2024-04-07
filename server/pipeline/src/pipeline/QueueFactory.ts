import { BullQueueAdapter } from '../queues-providers/BullQueueAdapter';
import { RabbitMQQueueAdapter } from '../queues-providers/RabbitQueueAdapter';
import { IQueue } from '../queues-providers/IQueue';

export class QueueFactory {
    
    static getQueueFactory<T>(queueName: string): IQueue<T> {
        const queueType = process.env.QUEUE_TYPE;

        switch (queueType) {
            case 'BULL':
                // Asegúrate de tener una instancia de Redis corriendo o configurar la conexión de Bull según sea necesario.                
                return new BullQueueAdapter<T>(queueName);
            case 'RABBITMQ':                
                // Asegúrate de que tu instancia de RabbitMQ esté corriendo o configurar la conexión de RabbitMQ según sea necesario.
                return new RabbitMQQueueAdapter<T>(queueName);
            default:
                throw new Error(`Unsupported queue type: ${queueType}`);
        }
    }
}
