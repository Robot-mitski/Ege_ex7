document.getElementById('checkBtn').onclick = function() {
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    const resultDiv = document.getElementById('result');
    const solutionDiv = document.getElementById('solution');
    
    resultDiv.style.display = 'block';
    solutionDiv.classList.add('hidden');
    
    if (isNaN(userAnswer)) {
        resultDiv.textContent = 'Введите число';
        resultDiv.style.background = '#ffebee';
        resultDiv.style.color = '#c62828';
        return;
    }
    
    if (userAnswer === 17) {
        resultDiv.textContent = '✓ Правильно! Ответ: 17 мс';
        resultDiv.style.background = '#e8f5e9';
        resultDiv.style.color = '#2e7d32';
    } else {
        resultDiv.textContent = '✗ Неверно. Правильный ответ: 17 мс';
        resultDiv.style.background = '#ffebee';
        resultDiv.style.color = '#c62828';
        solutionDiv.classList.remove('hidden');
        solutionDiv.scrollIntoView({behavior: 'smooth'});
    }
};

document.getElementById('answerInput').onkeyup = function(e) {
    if (e.key === 'Enter') document.getElementById('checkBtn').click();
};

window.onscroll = function() {
    const upBtn = document.getElementById('upBtn');
    if (window.pageYOffset > 200) {
        upBtn.classList.add('visible');
    } else {
        upBtn.classList.remove('visible');
    }
};

document.getElementById('upBtn').onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
};
