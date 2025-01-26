import { data, suspiciousSubstrings } from "./data.js"

function urlToFeatures(url) {
    const domain = url.replace(/^https?:\/\//, '').split('/')[0]; // Доменное имя
    const domainDashCount = (domain.match(/-/g) || []).length; // Количество дефисов в доменном имени
    const domainLength = url.replace(/^https?:\/\//, '').split('/')[0].length; // Длина доменного имени
    const lettersCount = (url.match(/[a-zA-Z]/g) || []).length; // Количество букв
    const digitsCount = (url.match(/\d/g) || []).length; // Количество цифр
    const lettersToDigitsRatio = digitsCount > 0 ? lettersCount / digitsCount : 0; // Соотношение букв к цифрам
    const hasSuspiciousSubstring = suspiciousSubstrings.some(substring => url.includes(substring)) ? 1 : 0; 
    // наличие подстроки из массива suspiciousSubstrings
  
    return [domainDashCount, domainLength, lettersToDigitsRatio, hasSuspiciousSubstring];
}

const TENSOR_1 = tf.tensor2d(data.map(d => urlToFeatures(d.url))); 
const TENSOR_2 = tf.tensor2d(data.map(d => [d.label])); 
  
const model = tf.sequential();
model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [4] })); 
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); 

model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
});


export function analyzeUrl(url) {
    
    model.fit(TENSOR_1, TENSOR_2, { epochs: 10 });

    const predictionTensor = model.predict(tf.tensor2d([urlToFeatures(url)]));
    const prediction = predictionTensor.dataSync();
    
    return prediction[0]; 
}