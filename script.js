document.getElementById('checkAnswer').addEventListener('click', checkAnswer);
document.getElementById('userAnswer').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.code-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
    });
});

function checkAnswer() {
    const userAnswerInput = document.getElementById('userAnswer');
    const userAnswer = parseInt(userAnswerInput.value.trim());
    const resultMessage = document.getElementById('resultMessage');
    
    if (isNaN(userAnswer)) {
        resultMessage.textContent = 'Пожалуйста, введите число в поле ответа.';
        resultMessage.className = 'result-message incorrect';
        return;
    }
    
    const correctAnswer = 17; 
    
    if (userAnswer === correctAnswer) {
        resultMessage.textContent = 'Правильно! Ответ верный: минимальное время выполнения всех процессов составляет 17 мс.';
        resultMessage.className = 'result-message correct';
    } else {
        resultMessage.innerHTML = `Ответ неверный. Правильный ответ: ${correctAnswer} мс.<br><br>
        <strong>Подсказка:</strong> Процессы 1, 2, 9 и 10 выполняются параллельно и независимо. 
        Процесс 8 завершается последним в момент времени 17 мс.`;
        resultMessage.className = 'result-message incorrect';
        resultMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    resultMessage.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.code-content').classList.add('active');
});
