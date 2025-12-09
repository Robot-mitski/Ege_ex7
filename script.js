// Константы
const CORRECT_ANSWER = 17;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик кнопки проверки
    document.getElementById('checkAnswer').addEventListener('click', checkAnswer);
    
    // Обработка нажатия Enter в поле ввода
    document.getElementById('userAnswer').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Фокусировка на поле ввода
    document.getElementById('userAnswer').focus();
});

// Функция проверки ответа
function checkAnswer() {
    const userAnswerInput = document.getElementById('userAnswer');
    const userAnswer = parseInt(userAnswerInput.value.trim());
    const resultMessage = document.getElementById('resultMessage');
    const solutionSection = document.getElementById('solutionSection');
    
    // Проверка, что введено число
    if (isNaN(userAnswer)) {
        resultMessage.textContent = 'Пожалуйста, введите число в поле ответа.';
        resultMessage.className = 'result-message incorrect';
        resultMessage.style.display = 'block';
        return;
    }
    
    // Проверка ответа
    if (userAnswer === CORRECT_ANSWER) {
        resultMessage.textContent = '✅ Правильно! Ответ верный: минимальное время выполнения всех процессов составляет 17 мс.';
        resultMessage.className = 'result-message correct';
        
        // Скрываем раздел с решением, если он был показан ранее
        solutionSection.style.display = 'none';
    } else {
        resultMessage.textContent = '❌ Ответ неверный. Правильный ответ: 17 мс. Ниже показано подробное решение.';
        resultMessage.className = 'result-message incorrect';
        
        // Показываем раздел с решением
        solutionSection.style.display = 'block';
        
        // Прокручиваем к решению
        solutionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Показываем сообщение с результатом
    resultMessage.style.display = 'block';
}
