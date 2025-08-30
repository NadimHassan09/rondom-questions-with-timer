    let questions = [];       // Array coming from API
    let availableQuestions = [];
    let timer = 60; // seconds
    let timerInterval;
    let score = 0;
    let currentQuestion = null;
    let answered = false;

    const timerEl = document.getElementById("timer");
    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const feedbackEl = document.getElementById("feedback");
    const scoreEl = document.getElementById("score");
    const nextBtn = document.getElementById("nextBtn");

    // -------- Fetch Questions from API --------
    async function loadQuestions() {
      try {
        // Get 10 multiple-choice questions about Computers
        const res = await fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple");
        const data = await res.json();

        // Convert API format to our format
        questions = data.results.map(q => {
          const allOptions = [...q.incorrect_answers, q.correct_answer];
          // shuffle answers
          allOptions.sort(() => 0.5 - Math.random());
          return {
            question: q.question,
            options: allOptions,
            answer: allOptions.indexOf(q.correct_answer)
          };
        });

        availableQuestions = [...questions];
        startTimer();
        getRandomQuestion();
        nextBtn.disabled = false;
      } catch (err) {
        questionEl.textContent = "Failed to load questions!";
        console.error(err);
      }
    }

    // -------- Timer --------
    function startTimer() {
      timerInterval = setInterval(() => {
        timer--;
        timerEl.textContent = `Time left: ${timer}s`;
        if (timer <= 0) {
          clearInterval(timerInterval);
          endExam();
        }
      }, 1000);
    }

    // -------- Get Random Question --------
    function getRandomQuestion() {
      feedbackEl.textContent = "";
      answered = false;
      optionsEl.innerHTML = "";

      if (availableQuestions.length === 0) {
        endExam();
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      currentQuestion = availableQuestions[randomIndex];
      availableQuestions.splice(randomIndex, 1);

      // show question
      questionEl.innerHTML = currentQuestion.question;

      currentQuestion.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerHTML = opt;
        btn.classList.add("option");
        btn.addEventListener("click", () => selectAnswer(i));
        optionsEl.appendChild(btn);
      });
    }

    // -------- Select Answer --------
    function selectAnswer(selectedIndex) {
      if (answered) return; // block multiple clicks
      answered = true;

      if (selectedIndex === currentQuestion.answer) {
        feedbackEl.textContent = "✅ Correct!";
        score++;
        scoreEl.textContent = `Score: ${score}`;
      } else {
        feedbackEl.textContent = `❌ Wrong! Correct: ${currentQuestion.options[currentQuestion.answer]}`;
      }
    }

    // -------- End Exam --------
    function endExam() {
      clearInterval(timerInterval);
      questionEl.textContent = "Exam finished!";
      optionsEl.innerHTML = "";
      feedbackEl.textContent = `Final Score: ${score}/${questions.length}`;
      nextBtn.disabled = true;
      timerEl.textContent = "Time is up!";
    }

    // -------- Button Event --------
    nextBtn.addEventListener("click", getRandomQuestion);

    // -------- Start --------
    loadQuestions();