const CORRECT_ANSWER = 17;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkAnswer').addEventListener('click', checkAnswer);
    document.getElementById('userAnswer').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
    
    document.getElementById('userAnswer').focus();
});

function checkAnswer() {
    const userAnswerInput = document.getElementById('userAnswer');
    const userAnswer = parseInt(userAnswerInput.value.trim());
    const resultMessage = document.getElementById('resultMessage');
    const solutionSection = document.getElementById('solutionSection');
    
    if (isNaN(userAnswer)) {
        resultMessage.textContent = 'Пожалуйста, введите число в поле ответа.';
        resultMessage.className = 'result-message incorrect';
        resultMessage.style.display = 'block';
        return;
    }
    
    if (userAnswer === CORRECT_ANSWER) {
        resultMessage.textContent = '✅ Правильно! Ответ верный: минимальное время выполнения всех процессов составляет 17 мс.';
        resultMessage.className = 'result-message correct';
        solutionSection.style.display = 'none';
    } else {
        resultMessage.textContent = '❌ Ответ неверный. Правильный ответ: 17 мс. Ниже показано подробное решение.';
        resultMessage.className = 'result-message incorrect';
        solutionSection.style.display = 'block';
        solutionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    resultMessage.style.display = 'block';
}
