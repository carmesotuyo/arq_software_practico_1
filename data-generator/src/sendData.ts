// src/sendData.ts
import axios from 'axios';
import { CustomData } from './data-structure/CustomData';
const faker = require('faker'); // o import faker from 'faker';

const sendData = async () => {
  const data: CustomData = {
    words: Array.from({ length: 10 }, () => faker.random.word()),
  };

  try {
    const response = await axios.post('http://localhost:3000/words', data);
    console.log('Data sent successfully:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // La solicitud se realizó y el servidor respondió con un código de estado
        // que cae fuera del rango de 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        console.error('Error request:', error.request);
      } else {
        // Algo más causó el error
        console.error('Error message:', error.message);
      }
    } else {
      // Error no relacionado con Axios
      console.error('Error:', error);
    }
  }
};

sendData();
