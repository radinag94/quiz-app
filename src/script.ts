type CorrectAnswer = string[];
type Index = number;
type Div = HTMLDivElement;
type Form = HTMLFormElement;
type SelectOption = HTMLOptionElement;
type Answer = string;
type SelectedAnswer = HTMLInputElement;
type FailedAnswer = Results[];
interface Data {
  results: Results[];
}

interface Results {
  type: string;
  difficulty: string;
  category: string;
  question: string;

  correct_answer: string;
  incorrect_answers: string[];
}
const worker = new Worker("dist/worker.js", { type: "module" });
let amountQuestion: number = 10;
let category: string | number = 9;
let difficulty: string = "easy";

const result = document.querySelector(".detailed-question") as Div;
const possibleAns = document.querySelector(".answers") as Div;
const additonalInfo = document.querySelector(".info-for-answers") as Div;
const questionContainer = document.querySelector(".question-section") as Div;
let correctAnswerArr: CorrectAnswer = [];
let correctAns: number = 0;
let wrongAns: number = 0;
let failedAnsr: FailedAnswer = [];
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
    const data: Data = await response.json();
    displayQuiz(data);
  } catch (error) {
    console.log(`Not valid ${error}`);
  }
};

const form = document.querySelector(".main-form") as Form;
const startGame = () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectCat = (document.getElementById("category") as SelectOption)
      .value;
    if (selectCat === "general-knowledge") {
      category = 9;
    } else if (selectCat === "history") {
      category = 23;
    } else if (selectCat === "politics") {
      category = 24;
    }

    const selectDif = (document.getElementById("difficulty") as SelectOption)
      .value;
    if (selectDif === "easy") {
      difficulty = "easy";
    } else if (selectDif === "medium") {
      difficulty = "medium";
    } else if (selectDif === "hard") {
      difficulty = "hard";
    }
    const selectNumOfQ = (
      document.getElementById("question-number") as SelectOption
    ).value;
    if (selectNumOfQ === "ten") {
      amountQuestion = 10;
    } else if (selectNumOfQ === "twenty") {
      amountQuestion = 20;
    } else if (selectNumOfQ === "thirty") {
      amountQuestion = 30;
    }
    localStorage.setItem("category", category.toString());
    localStorage.setItem("difficulty", difficulty);
    localStorage.setItem("numberOfQ", amountQuestion.toString());
    getData();
  });
};

const displayQuiz = (data: Data) => {
  let currentQuestionIndex = 0;
  const showQuestion = (index: Index) => {
    localStorage.setItem("allQuestions", JSON.stringify(data.results));
    const allQuestions = localStorage.getItem("allQuestions") ?? "";
    const questionArr = JSON.parse(allQuestions) as Results[];
    const currQ = questionArr[index];
    // const question = data.results[index];
    localStorage.setItem("question", currQ.question);

    const answersContainer = document.createElement("div");
    answersContainer.id = "answers-container";
    const allAnswers = [currQ.correct_answer, ...currQ.incorrect_answers];
    const messyAnswers = messyArr(allAnswers);

    messyAnswers.forEach((answer: Answer) => {
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
      input.addEventListener("change", () => {
        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach((radio) => {
          (radio as HTMLInputElement).disabled = true;
        });
      });
    });

    result.innerHTML = `<span class="q-number">${index + 1}.</span> ${
      currQ.question
    }`;
    possibleAns.innerHTML = "";

    possibleAns.appendChild(answersContainer);
    questionContainer.appendChild(result);
    questionContainer.appendChild(possibleAns);
    questionContainer.appendChild(additonalInfo);
    let answerChecked = false;
    // create chechAnswerBtn and addEventlistener
    const checkAnswerBtn = document.createElement("button");
    checkAnswerBtn.id = "check-answer-btn";
    checkAnswerBtn.innerText = "CHECK ANSWER";

    checkAnswerBtn.addEventListener("click", () => {
      if(!answerChecked) {
      const selectedAnswer = document.querySelector(
        'input[name="answer"]:checked'
      ) as SelectedAnswer;
      if (selectedAnswer) {
        const userAnswer = selectedAnswer.value;
        const isCorrect = userAnswer === currQ.correct_answer;
        answerChecked=true
        if (isCorrect) {
          correctAns++;
          localStorage.setItem("numOfCorrectAns", correctAns.toString());
          correctAnswerArr.push(currQ.question);
          localStorage.setItem(
            "correctAnsQuestion",
            JSON.stringify(correctAnswerArr)
          );
        } else {
          wrongAns++;
          localStorage.setItem("numOfWrongAns", wrongAns.toString());
          failedAnsr.push(currQ);
          // correctedAns.push(currQ.correct_answer)
        }

        displayResult(isCorrect, questionArr);
      } else {
        alert("Please select one answer.");
      }
  }});

    answersContainer.appendChild(checkAnswerBtn);
  };

  const displayResult = (isCorrect: boolean, questionArr: Results[]) => {
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
      if (currentQuestionIndex < questionArr.length) {
        showQuestion(currentQuestionIndex);
      } else {
        result.innerHTML = `Quiz completed! Number of correct answers: ${correctAns} ;Number of wrong answers ${wrongAns}`;
        possibleAns.innerHTML = "";
        console.log(correctAnswerArr);
        console.log(failedAnsr);
        failedAnsr.forEach((q) => {
          additonalInfo.innerHTML += `<li>${q.question} </li> Correct answer:  ${q.correct_answer}`;
        });
        additonalInfo.innerHTML += "<button class='new-game'>NEW GAME</button>";
        additonalInfo.innerHTML +=
          "<button class='download-results'>DOWNLOAD RESULTS</button>";

        const newGameBtn = document.querySelector(".new-game");
        if (newGameBtn) {
          newGameBtn.addEventListener("click", () => {
            newGame();
          });
        }

        const downloadResultsBtn = document.querySelector(".download-results");
        if (downloadResultsBtn) {
          downloadResultsBtn.addEventListener("click", () => {
            downloadResults();
          });
        }
      }
    });

    // add nextBtn to the parent-container
    possibleAns.appendChild(nextBtn);
  };

  //show the first q
  showQuestion(currentQuestionIndex);
};

//mess the arr of answers
const messyArr = (array: Array<string>) => {
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

const downloadResults = () => {
  const numOfCorrectAnsString = localStorage.getItem("numOfCorrectAns");
  const numOfWrongAnsString = localStorage.getItem("numOfWrongAns");

  if (numOfCorrectAnsString !== null && numOfWrongAnsString !== null) {
    const numOfCorrectAns = JSON.parse(numOfCorrectAnsString);
    const numOfWrongAns = JSON.parse(numOfWrongAnsString);

    worker.onmessage = (e) => {
      const blob = e.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "QuizScore.zip";
      link.click();
    };
    worker.postMessage({ numOfCorrectAns, numOfWrongAns });
  } else {
    console.error(
      "Error: Unable to retrieve correct or wrong answer counts from local storage"
    );
  }
};

startGame();
