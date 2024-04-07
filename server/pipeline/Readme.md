# Pipes & Filters

El ejemplo trata de pipes and filters, para ello en el main.ts se generan un array con palabras
que será procesados por el Pipeline.

El Pipeline implementado trata de ser agnóstico a la teconología de colas, para ello demostraemos utilizando un adaptador para Bull y otro para RabbitMQ.

## Estructura de archivos
```bash
src\
----\data-structure #guarda el CustoData que va a ser la estructura del dato que ingresa a la Pipeline
----\filters #guarda el archivo en que se definen los filtros
----\pipeline #guarda el curpo del algoritmo de la clase Pipeline y la QueueFactory encargada de crear las Queues Bull o Rabbit
----\queues-providers #guarda los Adaptadores de Bull y Rabbit ademas de la IQueue que es la interface que van a implementar dichos adaptadores
```


## Docker compose 

Necesitamos tener Redis para utilizar bull y RabbitMQ
1ero verfica que tienes instalado Docker

2do debes tener un docker docker-compose.yml de este estilo:

```bash

version: "3.1"
services:  
  redis:
    image: redis:latest
    command: redis-server
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  rabbitmq:
    image: "rabbitmq:3-management"
    ports:
      - "5672:5672" # Puerto estándar de RabbitMQ
      - "15672:15672" # Puerto de la interfaz web de administración
    environment:
      RABBITMQ_DEFAULT_USER: "user"
      RABBITMQ_DEFAULT_PASS: "password"
    volumes:
      - "rabbitmq_data:/var/lib/rabbitmq"
      - "rabbitmq_log:/var/log/rabbitmq"

volumes: 
  redis-data:
  rabbitmq_data:
  rabbitmq_log:
```
luego levanta el docker compose de esta forma

```bash
docker-compose up -d
```


## Instalar modulos
```bash
npm i
```
## Ejecutar

ir a la carpeta src 

```bash
npx ts-node main.ts
```