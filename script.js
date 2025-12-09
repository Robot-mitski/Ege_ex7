let processes = [];
let calculatedAnswer = null;

document.addEventListener('DOMContentLoaded', function() {
    initFileUpload();
    initTabs();
    initButtons();
});
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('odsFileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    selectFileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
}

function initTabs() {
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
}
function initButtons() {
    document.getElementById('checkAnswer').addEventListener('click', checkAnswer);
    document.getElementById('calculateBtn').addEventListener('click', calculateAutomatically);
    document.getElementById('userAnswer').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
}

function handleFileUpload(file) {
    if (!file.name.endsWith('.ods')) {
        alert('Пожалуйста, загрузите файл с расширением .ods');
        return;
    }
    
    const uploadArea = document.getElementById('uploadArea');
    const originalHTML = uploadArea.innerHTML;
    uploadArea.innerHTML = '<div class="loading"></div><p>Чтение файла...</p>';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            processFileData(jsonData);
            
            uploadArea.innerHTML = originalHTML;
            initFileUpload(); 
            
        } catch (error) {
            console.error('Ошибка при чтении файла:', error);
            alert('Ошибка при чтении файла. Убедитесь, что файл имеет правильный формат ODS.');
            uploadArea.innerHTML = originalHTML;
            initFileUpload();
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function processFileData(data) {
    processes = [];
    const rows = data.filter(row => row.length >= 3 && !isNaN(row[0]));
    rows.forEach(row => {
        const id = String(row[0]).trim();
        const time = parseInt(row[1]);
        let dependencies = [];
        
        if (row[2] !== undefined && row[2] !== null) {
            if (typeof row[2] === 'string') {
                dependencies = row[2].split(';').map(dep => dep.trim()).filter(dep => dep !== '');
            } else if (typeof row[2] === 'number') {
                dependencies = [String(row[2])];
            }
        }
        
        if (dependencies.length === 0) {
            dependencies = ["0"];
        }
        
        processes.push({
            id: id,
            time: time,
            dependencies: dependencies
        });
    });
    
    processes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    displayDataInTable();
    document.getElementById('fileInfo').style.display = 'block';
    calculatedAnswer = calculateMinTime(processes);
    updateExplanation();
}

function displayDataInTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    processes.forEach(proc => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        idCell.textContent = proc.id;
        const timeCell = document.createElement('td');
        timeCell.textContent = proc.time;
        const depsCell = document.createElement('td');
        depsCell.textContent = proc.dependencies.join('; ');
        row.appendChild(idCell);
        row.appendChild(timeCell);
        row.appendChild(depsCell);
        tableBody.appendChild(row);
    });
}

function calculateMinTime(processes) {
    const completionTime = {};
    processes.forEach(proc => {
        if (proc.dependencies.length === 0 || 
            (proc.dependencies.length === 1 && proc.dependencies[0] === "0")) {
            completionTime[proc.id] = proc.time;
        }
    });
    let changed = true;
    while (changed) {
        changed = false;
        processes.forEach(proc => {
            if (completionTime[proc.id] !== undefined) return;
            
            const deps = proc.dependencies.filter(dep => dep !== "0");
            if (deps.every(dep => completionTime[dep] !== undefined)) {
                const maxDepTime = Math.max(...deps.map(dep => completionTime[dep]));
                completionTime[proc.id] = proc.time + maxDepTime;
                changed = true;
            }
        });
    }
    
    return Math.max(...Object.values(completionTime));
}
function updateExplanation() {
    const explanationDiv = document.getElementById('dynamicExplanation');
    
    if (processes.length === 0) {
        explanationDiv.innerHTML = '<p>После загрузки файла с данными здесь появится пошаговое объяснение решения.</p>';
        return;
    }
    const completionTime = {};
    const steps = [];
    const independentProcs = processes.filter(proc => 
        proc.dependencies.length === 0 || 
        (proc.dependencies.length === 1 && proc.dependencies[0] === "0")
    );
    
    let step1 = '<p><strong>1. Независимые процессы:</strong></p><ul>';
    independentProcs.forEach(proc => {
        completionTime[proc.id] = proc.time;
        step1 += `<li>Процесс ${proc.id} независимый, поэтому его выполнение закончится на ${proc.time} мс</li>`;
    });
    step1 += '</ul>';
    steps.push(step1);
    
    let remainingProcs = processes.filter(proc => 
        proc.dependencies.length > 0 && proc.dependencies[0] !== "0"
    );
    
    let iteration = 2;
    while (remainingProcs.length > 0) {
        let step = `<p><strong>${iteration}. Вычисление времени для зависимых процессов:</strong></p><ul>`;
        let foundAny = false;
        
        const newRemaining = [];
        
        remainingProcs.forEach(proc => {
            const deps = proc.dependencies.filter(dep => dep !== "0");
            if (deps.every(dep => completionTime[dep] !== undefined)) {
                const maxDepTime = Math.max(...deps.map(dep => completionTime[dep]));
                completionTime[proc.id] = proc.time + maxDepTime;
                
                step += `<li>Процесс ${proc.id} зависит от процессов ${deps.join(', ')}, `;
                step += `поэтому он завершится через ${maxDepTime} + ${proc.time} = ${completionTime[proc.id]} мс</li>`;
                foundAny = true;
            } else {
                newRemaining.push(proc);
            }
        });
        
        step += '</ul>';
        if (foundAny) {
            steps.push(step);
            iteration++;
        }
        
        remainingProcs = newRemaining;
        if (iteration > 20) break;
    }
    
    const maxTime = Math.max(...Object.values(completionTime));
    const finalStep = `<p><strong>Итог:</strong> Максимальное время завершения среди всех процессов составляет ${maxTime} мс.</p>`;
    steps.push(finalStep);
    
    explanationDiv.innerHTML = steps.join('');
}

function checkAnswer() {
    const userAnswerInput = document.getElementById('userAnswer');
    const userAnswer = parseInt(userAnswerInput.value.trim());
    const resultMessage = document.getElementById('resultMessage');

    if (isNaN(userAnswer)) {
        resultMessage.textContent = 'Пожалуйста, введите число в поле ответа.';
        resultMessage.className = 'result-message incorrect';
        return;
    }
    
    const correctAnswer = calculatedAnswer !== null ? calculatedAnswer : 17;
    
    if (userAnswer === correctAnswer) {
        resultMessage.textContent = `Правильно! Ответ верный: минимальное время выполнения всех процессов составляет ${correctAnswer} мс.`;
        resultMessage.className = 'result-message correct';
    } else {
        resultMessage.innerHTML = `Ответ неверный. Правильный ответ: ${correctAnswer} мс.<br><br>
        <strong>Подсказка:</strong> Используйте кнопку "Рассчитать автоматически" для проверки ваших вычислений.`;
        resultMessage.className = 'result-message incorrect';
        resultMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    resultMessage.style.display = 'block';
}

function calculateAutomatically() {
    const userAnswerInput = document.getElementById('userAnswer');
    const resultMessage = document.getElementById('resultMessage');
    
    if (processes.length === 0) {
        resultMessage.textContent = 'Сначала загрузите файл с данными.';
        resultMessage.className = 'result-message info';
        resultMessage.style.display = 'block';
        return;
    }
    calculatedAnswer = calculateMinTime(processes);
    userAnswerInput.value = calculatedAnswer;
    resultMessage.textContent = `Автоматически рассчитано минимальное время выполнения: ${calculatedAnswer} мс. Теперь вы можете проверить ответ.`;
    resultMessage.className = 'result-message info';
    resultMessage.style.display = 'block';
    resultMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
