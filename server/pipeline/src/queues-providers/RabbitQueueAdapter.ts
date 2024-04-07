// Importa los componentes necesarios de la biblioteca amqplib, que es un cliente de RabbitMQ para Node.js.
import { Channel, connect, Connection } from 'amqplib';
// Importa la interfaz IQueue, que define los métodos que cualquier adaptador de cola debe implementar.
import { IQueue } from './IQueue';

// Define la clase RabbitMQQueueAdapter que implementa la interfaz IQueue.
export class RabbitMQQueueAdapter<T> implements IQueue<T> {
    // Almacena la promesa de la conexión con RabbitMQ.
    private connection: Promise<Connection>;
    // Almacena la promesa del canal de comunicación con RabbitMQ.
    private channel: Promise<Channel>;
    // Nombre de la cola con la que este adaptador trabajará.
    private queueName: string;

    // El constructor toma el nombre de la cola como parámetro.
    constructor(queueName: string) {
        this.queueName = queueName;
        // Establece la conexión con RabbitMQ. Aquí se asume que RabbitMQ corre en localhost.
        // Modifica la URL según sea necesario, incluyendo credenciales si es necesario.
        this.connection = connect('amqp://user:password@localhost');
        // Crea un canal de comunicación sobre la conexión establecida.
        this.channel = this.connection.then(conn => conn.createChannel());
        // Asegura que la cola especificada exista en RabbitMQ.
        this.channel.then(ch => ch.assertQueue(queueName));
    }

    // Método para añadir un mensaje a la cola. Los datos del mensaje se pasan como parámetro.
    async add(data: T): Promise<void> {
        // Espera hasta que el canal esté disponible.
        const ch = await this.channel;
        // Envia el mensaje a la cola, convirtiendo los datos a un Buffer ya que RabbitMQ espera datos binarios.
        ch.sendToQueue(this.queueName, Buffer.from(JSON.stringify(data)));
    }

    // Método para procesar mensajes de la cola. Toma una función callback que define cómo se procesarán los mensajes.
    process(callback: (data: T) => Promise<void>): void {
        // Una vez que el canal esté disponible, configura el consumo de mensajes de la cola.
        this.channel.then(ch => {
            // Consume mensajes de la cola especificada.
            ch.consume(this.queueName, async msg => {
                // Verifica que el mensaje no sea nulo.
                if (msg !== null) {
                    try {
                        // Convierte el contenido del mensaje de Buffer a string, luego a JSON, y finalmente al tipo de datos T.
                        const data = JSON.parse(msg.content.toString()) as T;
                        // Llama a la función callback con los datos del mensaje.
                        await callback(data);
                        // Acusa la recepción del mensaje para que sea eliminado de la cola.
                        ch.ack(msg);
                    } catch (error) {
                        // En caso de error al procesar el mensaje, imprime el error y no acusa la recepción del mensaje.
                        console.error('Error processing message:', error);
                        ch.nack(msg);
                    }
                }
            });
        });
    }
}
