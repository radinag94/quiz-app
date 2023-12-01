const myWorker = new Worker("worker.js");
let amountQuestion = 10;
let category = 9;
let difficulty = "easy";
const result = document.querySelector(".detailed-question");
const possibleAns = document.querySelector(".answers");
const additonalInfo = document.querySelector(".info-for-answers");
const questionContainer = document.querySelector(".question-section");
let correctAnswerArr = [];
let correctAns = 0;
let wrongAns = 0;
let failedAnsr = [];
let correctedAns = [];
let index = 0;
const getData = async () => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amountQuestion}&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    if (!response.ok) {
      throw new Error(`hhtp error ${response.status}`);
    }
    const data = await response.json();
    displayQuiz(data);
  } catch (error) {
    console.log(`Not valid ${error}`);
  }
};
const form = document.querySelector(".main-form");
const startGame = () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectCat = document.getElementById("category").value;

    if (selectCat === "general-knowledge") {
      category = 9;
    } else if (selectCat === "history") {
      category = 23;
    } else if (selectCat === "politics") {
      category = 24;
    }

    const selectDif = document.getElementById("difficulty").value;
    if (selectDif === "easy") {
      difficulty = "easy";
    } else if (selectDif === "medium") {
      difficulty = "medium";
    } else if (selectDif === "hard") {
      difficulty = "hard";
    }
    const selectNumOfQ = document.getElementById("question-number").value;
    if (selectNumOfQ === "ten") {
      amountQuestion = 10;
    } else if (selectNumOfQ === "twenty") {
      amountQuestion = 20;
    } else if (selectNumOfQ === "thirty") {
      amountQuestion = 30;
    }
    localStorage.setItem("category", category);
    localStorage.setItem("difficulty", difficulty);
    localStorage.setItem("numberOfQ", amountQuestion);
    getData();
  });
};

const displayQuiz = (data) => {
  let currentQuestionIndex = 0;
  const showQuestion = (index) => {
    localStorage.setItem("allQuestions", JSON.stringify(data.results));
    const allQuestions = localStorage.getItem("allQuestions");
    const question = JSON.parse(allQuestions);
    const currQ = question[index];
    // const question = data.results[index];
    localStorage.setItem("question", currQ.question);

    // console.log(question)
    // object
    const answersContainer = document.createElement("div");
    answersContainer.id = "answers-container";
    const allAnswers = [currQ.correct_answer, ...currQ.incorrect_answers];
    // console.log(allAnswers)
    // array
    const messyAnswers = messyArr(allAnswers);

    // console.log(messyAnswers)
    //array
    messyAnswers.forEach((answer) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.id = "choose-answer";
      const span = document.createElement("span");
      span.id = "options";
      input.type = "radio";
      input.name = "answer";
      input.value = answer;

      span.innerText = answer;

      label.appendChild(input);
      label.appendChild(span);

      answersContainer.appendChild(label);
    });

    result.innerHTML = `<span class="q-number">${index + 1}.</span> ${
      currQ.question
    }`;
    // console.log(result)
    possibleAns.innerHTML = "";

    possibleAns.appendChild(answersContainer);
    // console.log(possibleAns)
    questionContainer.appendChild(result);
    questionContainer.appendChild(possibleAns);
    questionContainer.appendChild(additonalInfo);
    // create chechAnswerBtn and addEventlistener
    const checkAnswerBtn = document.createElement("button");
    checkAnswerBtn.id = "check-answer-btn";
    checkAnswerBtn.innerText = "CHECK ANSWER";
    checkAnswerBtn.addEventListener("click", () => {
      const selectedAnswer = document.querySelector(
        'input[name="answer"]:checked'
      );
      // console.log(selectedAnswer)

      if (selectedAnswer) {
        const userAnswer = selectedAnswer.value;
        const isCorrect = userAnswer === currQ.correct_answer;
        if (isCorrect) {
          correctAns++;
          localStorage.setItem("numOfCorrectAns", correctAns);
          correctAnswerArr.push(currQ.question);
          localStorage.setItem(
            "correctAnsQuestion",
            JSON.stringify(correctAnswerArr)
          );
        } else {
          wrongAns++;
          localStorage.setItem("numOfWrongAns", wrongAns);
          failedAnsr.push(currQ);
          // correctedAns.push(currQ.correct_answer)
        }

        displayResult(isCorrect, allQuestions);
      } else {
        alert("Please select one answer.");
      }
    });

    answersContainer.appendChild(checkAnswerBtn);
  };

  const displayResult = (isCorrect, allQuestions) => {
    const resultMessage = document.createElement("p");
    resultMessage.id = "result-message";
    resultMessage.innerText = isCorrect ? "Correct!" : "Wrong!";

    possibleAns.appendChild(resultMessage);

    // create nextBtn and addEventlistener
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.id = "next-btn";
    nextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < data.results.length) {
        showQuestion(currentQuestionIndex);
      } else {
        result.innerHTML = `Quiz completed! Number of correct answers: ${correctAns} ;Number of wrong answers ${wrongAns}`;
        possibleAns.innerHTML = "";
        console.log(correctAnswerArr);
        console.log(failedAnsr);
        failedAnsr.forEach((q) => {
          additonalInfo.innerHTML += `Wrong Question/s :\n <li>${q.question} </li>\n   Correct answer:  ${q.correct_answer}\n`;
        });
        additonalInfo.innerHTML += `<button class='new-game'>NEW GAME</button>`;
        // const newGameB = document.querySelector('.new-game')
        additonalInfo.addEventListener("click", (e) => {
          if (e.target.classList.contains("new-game")) {
            newGame();
          }
        });
      }
    });

    // add nextBtn to the parent-container
    possibleAns.appendChild(nextBtn);
  };

  //show the first q
  showQuestion(currentQuestionIndex);
};

//mess the arr of answers
const messyArr = (array) => {
  return array.sort(() => Math.random() - 0.5);
};
const newGame = () => {
  console.log("New game clicked");
  index = 0;
  correctAns = 0;
  wrongAns = 0;
  correctAnswerArr = [];
  failedAnsr = [];
  localStorage.removeItem("numOfCorrectAns");
  localStorage.removeItem("numOfWrongAns");
  localStorage.removeItem("allQuestions");
  localStorage.removeItem("correctAnsQuestion");
  localStorage.removeItem("question");
  questionContainer.innerHTML = "";
  additonalInfo.innerHTML = "";
};
startGame();
