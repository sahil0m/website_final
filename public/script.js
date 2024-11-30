// PDF Download Functionality
function downloadPDF(filePath) {
    const link = document.createElement("a");
    link.href = filePath;
    link.setAttribute("download", filePath.split('/').pop());
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Quiz Functionality
document.addEventListener("DOMContentLoaded", function () {
    const departmentContainer = document.getElementById("department-container");
    const subjectContainer = document.getElementById("subject-container");
    const subjectsDiv = document.getElementById("subjects");
    const quizContent = document.getElementById("quiz-content");
    const questionContainer = document.getElementById("question-container");
    const answersContainer = document.getElementById("answers-container");
    const progressBar = document.getElementById("progress-bar");
    const nextButton = document.getElementById("next");
    const submitButton = document.getElementById("submit");
    const resultsDiv = document.getElementById("results");

    let quizData = {};
    let currentDepartment = '';
    let currentSubject = '';
    let currentQuiz = [];
    let currentQuestionIndex = 0;
    let score = 0;

    fetch("/quizData.json")
        .then(response => response.json())
        .then(data => {
            quizData = data;
            setupQuiz();
        })
        .catch(error => console.error("Error loading quiz data:", error));

    function setupQuiz() {
        document.querySelectorAll(".department-btn").forEach(button => {
            button.addEventListener("click", () => {
                currentDepartment = button.dataset.department;
                showSubjects();
            });
        });
    }

    function showSubjects() {
        departmentContainer.style.display = "none";
        subjectContainer.style.display = "block";
        subjectsDiv.innerHTML = '';

        Object.keys(quizData[currentDepartment]).forEach(subject => {
            const subjectButton = document.createElement("button");
            subjectButton.className = "btn";
            subjectButton.textContent = subject;
            subjectButton.addEventListener("click", () => {
                currentSubject = subject;
                startQuiz();
            });
            subjectsDiv.appendChild(subjectButton);
        });
    }

    function startQuiz() {
        subjectContainer.style.display = "none";
        quizContent.style.display = "block";
        currentQuiz = quizData[currentDepartment][currentSubject];
        currentQuestionIndex = 0;
        score = 0;
        showQuestion();
    }

    function showQuestion() {
        const questionData = currentQuiz[currentQuestionIndex];
        questionContainer.textContent = questionData.question;
        answersContainer.innerHTML = '';

        for (const [key, answer] of Object.entries(questionData.answers)) {
            const label = document.createElement("label");
            label.innerHTML = `<input type="radio" name="answer" value="${key}"> ${answer}`;
            answersContainer.appendChild(label);
        }

        progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
        submitButton.style.display = currentQuestionIndex === currentQuiz.length - 1 ? "block" : "none";
        nextButton.style.display = currentQuestionIndex < currentQuiz.length - 1 ? "block" : "none";
    }

    nextButton.addEventListener("click", () => {
        checkAnswer();
        currentQuestionIndex++;
        showQuestion();
    });

    submitButton.addEventListener("click", () => {
        checkAnswer();
        showResults();
    });

    function checkAnswer() {
        const selected = document.querySelector("input[name='answer']:checked");
        if (selected && selected.value === currentQuiz[currentQuestionIndex].correct) {
            score++;
        }
    }

    function showResults() {
        quizContent.style.display = "none";
        resultsDiv.style.display = "block";
        resultsDiv.innerHTML = `
            <h3>Your Score: ${score} / ${currentQuiz.length}</h3>
            <button class="btn" id="retry-btn">Retry Quiz</button>
        `;

        document.getElementById("retry-btn").addEventListener("click", retryQuiz);
    }

    function retryQuiz() {
        resultsDiv.style.display = "none";
        departmentContainer.style.display = "block";
        currentDepartment = '';
        currentSubject = '';
        currentQuestionIndex = 0;
        score = 0;
    }
});

// Toggle between login and signup forms
function toggleForm(formType) {
    document.getElementById('loginForm').style.display = formType === 'login' ? 'block' : 'none';
    document.getElementById('signupForm').style.display = formType === 'signup' ? 'block' : 'none';
}
toggleForm('login');  

// Validate login form
function validateLoginForm() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (username === "" || password === "") {
        alert("Please fill out all fields in the login form.");
        return false;
    }
    alert("Login successful!"); 
    return true;
}

function validateSignupForm() {
    const email = document.getElementById('signupEmail').value.trim();
    const fullName = document.getElementById('signupFullName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (email === "" || fullName === "" || username === "" || password === "") {
        alert("Please fill out all fields in the signup form.");
        return false;
    }
    alert("Signup successful!"); 
    return true;
}

