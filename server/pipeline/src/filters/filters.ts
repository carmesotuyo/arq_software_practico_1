import { CustomData, CustomDataArray } from '../data-structure/CustomData';
require('dotenv').config();
const fs = require('fs');

// Primer filtro: Convierte el input a minúsculas y añade un espacio entre cada letra.
export const toLowercaseWithSpaces = (input: CustomData): CustomData => {
  let result: string = input.data
    .toLowerCase() // Convierte el string a minúsculas.
    .split('') // Separa el string en un array de caracteres.
    .join(' '); // Une los caracteres con un espacio entre ellos.
  console.log(`Filtro toLowercaseWithSpaces,  input${JSON.stringify(input)}, output ${result} }`);
  return { data: result };
};

// Segundo filtro: Convierte el input a mayúsculas.
export const toUppercase = (input: CustomData): CustomData => {
  let result: string = input.data.toUpperCase(); // Convierte el string a mayúsculas.
  console.log(`Filtro toUppercase,  input${JSON.stringify(input)}, output ${result} }`);
  return { data: result };
};

// Tercer filtro: Reemplaza cada espacio en el input por un punto.
export const replaceSpacesWithDots = (input: CustomData): CustomData => {
  let result = input.data.replace(/ /g, '.'); // Reemplaza cada espacio (' ') por un punto ('.').
  console.log(`Filtro replaceSpacesWithDots,  input${JSON.stringify(input)}, output ${result} }`);
  return { data: result };
};

export const filterWithRandomError = (input: CustomData): CustomData => {
  if (Math.random() < 0.5) {
    // Probabilidad de 50% para generar un error
    throw new Error('Error aleatorio');
  }
  return { data: input.data.trim() };
};

export const recordResults = (input: CustomData): CustomData => {
  const filename = process.env.RESULTS_FILE;

  if (fs.existsSync(filename)) {
    const fileContent = fs.readFileSync(filename, 'utf8');
    try {
      let jsonData: CustomDataArray = JSON.parse(fileContent);
      jsonData.words.push(input.data);
      const updatedData = JSON.stringify(jsonData, null, 2);
      fs.writeFileSync(filename, updatedData);
      console.log(`Results appended to ${filename}`);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return input;
    }
  } else {
    let dataToWrite: CustomDataArray = { words: [] };
    dataToWrite.words.push(input.data);
    const formatted = JSON.stringify(dataToWrite, null, 2);
    console.log('Data to write: ' + formatted);
    fs.writeFileSync(filename, formatted);
    console.log(`Results recorded to ${filename}`);
  }
  return input;
};
