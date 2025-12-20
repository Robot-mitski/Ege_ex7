const checkBtn = document.getElementById('checkBtn');
const answerInput = document.getElementById('answerInput');
const resultBox = document.getElementById('resultBox');
const solutionBox = document.getElementById('solutionBox');
const scrollBtn = document.getElementById('scrollTop');

checkBtn.addEventListener('click', checkAnswer);

answerInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    resultBox.style.display = 'block';
    solutionBox.classList.add('hidden');
    
    if (isNaN(userAnswer)) {
        resultBox.textContent = 'Введите число';
        resultBox.style.backgroundColor = '#fff3cd';
        resultBox.style.color = '#856404';
        return;
    }
    
    if (userAnswer === 17) {
        resultBox.textContent = 'Верно! Ответ: 17 мс';
        resultBox.style.backgroundColor = '#d4edda';
        resultBox.style.color = '#155724';
    } else {
        resultBox.textContent = 'Неверно. Правильный ответ: 17 мс';
        resultBox.style.backgroundColor = '#f8d7da';
        resultBox.style.color = '#721c24';
        solutionBox.classList.remove('hidden');
        solutionBox.scrollIntoView({behavior: 'smooth'});
    }
}

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
});

scrollBtn.addEventListener('click', function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
});
