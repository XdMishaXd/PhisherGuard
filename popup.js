import { analyzeUrl } from "./model/model.js";

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM успешно загружен');

  predictButton.addEventListener('click', () => {
    const button = document.getElementById('predictButton');
    button.disabled = true;
    
    if(isURL(document.getElementById('urlInput').value))
    {
      document.getElementById('displayResult').innerText = "Анализ...";
      
      setTimeout(() => {

        const prediction = analyzeUrl(document.getElementById('urlInput').value);

        if(prediction < 0.5) {
          document.getElementById('displayResult').innerText = 'Ссылка абсолютно безопасна.';
        } else if (prediction >= 0.5) {
          document.getElementById('displayResult').innerText = 'Ссылка является вредоносной.';
        }
        
        button.disabled = false;

      }, 100)       
      
    } else {
      document.getElementById('displayResult').innerText = "Введите URL";
      
      button.disabled = false;
    }
  });
});

function isURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}