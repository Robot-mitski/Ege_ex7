document.getElementById('checkBtn').onclick = function() {
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    const resultDiv = document.getElementById('result');
    const solutionDiv = document.getElementById('solution');
    
    resultDiv.style.display = 'block';
    solutionDiv.classList.add('hidden');
    
    if (isNaN(userAnswer)) {
        resultDiv.textContent = 'Введите число';
        resultDiv.style.background = 'rgb(255, 235, 238)';
        resultDiv.style.color = 'rgb(198, 40, 40)';
        return;
    }
    
    if (userAnswer === 17) {
        resultDiv.textContent = 'Правильно! Ответ: 17 мс';
        resultDiv.style.color = 'rgb(46, 125, 50)';
    } else {
        resultDiv.textContent = 'Неверно. Правильный ответ: 17 мс';
        resultDiv.style.color = 'rgb(198, 40, 40)';
        solutionDiv.classList.remove('hidden');
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
