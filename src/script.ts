type CorrectAnswer = string[]; //correct answer is a string array?
type Index = number; // NO 
type Answer = string; // NO
type Div = HTMLDivElement | null;
type Form = HTMLFormElement | null;
type SelectOption = HTMLOptionElement | null;
type SelectedAnswer = HTMLInputElement | null;

type FailedAnswer = Results[];

interface Results {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface Data {
  results: Results[];
}

// Move interfaces to a different file

const worker = new Worker("dist/worker.js", { type: "module" });

const result = document.querySelector(".detailed-question") as Div;
const possibleAns = document.querySelector(".answers") as Div;
const additonalInfo = document.querySelector(".info-for-answers") as Div;
const questionContainer = document.querySelector(".question-section") as Div;

let amountQuestion: number = 10;
let category: string | number = 9;
let difficulty: string = "easy";

let correctAnswerArr: CorrectAnswer = [];
let correctAns: number = 0;
let wrongAns: number = 0;
let failedAnsr: FailedAnswer = [];
let correctedAns = [];
let index = 0;

const getData = async () => {
  try {
    const url = `https://opentdb.com/api.php?amount=${amountQuestion}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`hhtp error ${response.status}`);

    displayQuiz(await response.json());
  } catch (error) {
    console.log(`Not valid ${error}`);
  }
};

const form = document.querySelector(".main-form") as Form;
const startGame = () => {
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectCat = (document.getElementById("category") as SelectOption)?.value;

    if (selectCat === "general-knowledge") {
      category = 9;
    } else if (selectCat === "history") {
      category = 23;
    } else if (selectCat === "politics") {
      category = 24;
    }

    const selectDif = (document.getElementById("difficulty") as SelectOption)?.value;

    if (selectDif === "easy") {
      difficulty = "easy";
    } else if (selectDif === "medium") {
      difficulty = "medium";
    } else if (selectDif === "hard") {
      difficulty = "hard";
    }
    const selectNumOfQ = (document.getElementById("question-number") as SelectOption)?.value;

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

  // this is an awfuly long & unreadable function 
  // needs refactoring
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
    const messyAnswers = messyArr(allAnswers); // shuffleArr

    messyAnswers.forEach((answer: Answer) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const span = document.createElement("span");

      input.id = "choose-answer";
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

    if (result)
      result.innerHTML = `<span class="q-number">${index + 1}.</span> ${currQ.question
        }`;

    if (possibleAns) {
      possibleAns.innerHTML = "";
      possibleAns.appendChild(answersContainer);
    }

    if (questionContainer && result && possibleAns && additonalInfo) {
      questionContainer.appendChild(result);
      questionContainer.appendChild(possibleAns);
      questionContainer.appendChild(additonalInfo);
    }

    let answerChecked = false;
    // create chechAnswerBtn and addEventlistener
    const checkAnswerBtn = document.createElement("button");
    checkAnswerBtn.id = "check-answer-btn";
    checkAnswerBtn.innerText = "CHECK ANSWER";

    checkAnswerBtn.addEventListener("click", () => {
      if (!answerChecked) {
        const selectedAnswer = document.querySelector(
          'input[name="answer"]:checked'
        ) as SelectedAnswer;
        if (selectedAnswer) {
          const userAnswer = selectedAnswer.value;
          const isCorrect = userAnswer === currQ.correct_answer;
          answerChecked = true;
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
      }
    });

    answersContainer.appendChild(checkAnswerBtn);
  };

  const displayResult = (isCorrect: boolean, questionArr: Results[]) => {
    const resultMessage = document.createElement("p");
    resultMessage.id = "result-message";
    resultMessage.innerText = isCorrect ? "Correct!" : "Wrong!";

    possibleAns?.appendChild(resultMessage);

    // create nextBtn and addEventlistener
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.id = "next-btn";
    nextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questionArr.length) {
        showQuestion(currentQuestionIndex);
      } else if (result && possibleAns && additonalInfo) {
        result.innerHTML = `Quiz completed! Number of correct answers: ${correctAns} ;Number of wrong answers ${wrongAns}`;
        possibleAns.innerHTML = "";

        console.log(correctAnswerArr);
        console.log(failedAnsr);

        failedAnsr.forEach((q) => {
          // seems like a wrong HTML
          // open <li> => close </li> and then Correct asnwer?
          additonalInfo.innerHTML += `<li>${q.question} </li> Correct answer:  ${q.correct_answer}`;
        });

        displayDogFact();

        additonalInfo.innerHTML += "<button class='new-game'>NEW GAME</button>";
        additonalInfo.innerHTML +=
          "<button class='download-results'>DOWNLOAD RESULTS</button>";

        document.querySelector(".new-game")?.addEventListener("click", newGame);
        document.querySelector(".download-results")?.addEventListener("click", downloadResults);
      }
    });

    // add nextBtn to the parent-container
    possibleAns?.appendChild(nextBtn);
  };

  //show the first q
  showQuestion(currentQuestionIndex);
};

//mess the arr of answers
const messyArr = (array: Array<string>) => array.sort(() => Math.random() - 0.5);

const newGame = () => {
  console.log("New game clicked");
  index = 0;
  correctAns = 0;
  wrongAns = 0;
  correctAnswerArr = [];
  failedAnsr = [];

  for (const key of ['numOfCorrectAns', 'numOfWrongAns', 'allQuestions', 'correctAnsQuestion', 'question']) {
    localStorage.removeItem(key);
  }


  if (questionContainer)
    questionContainer.innerHTML = "";

  if (additonalInfo)
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


const fetchDogFact = async () => {
  const apiUrl = "https://dogapi.dog/api/v2/facts";
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (data?.data.length > 0) {
      return data.data[0].attributes.body;
    } else {
      throw new Error("Empty response from the API");
    }
  } catch (error) {
    console.error(`Error fetching dog fact: ${error}`);
    return "Failed to fetch a dog fact.";
  }
};

const displayDogFact = async () => {
  try {
    const dogFact = await fetchDogFact();
    const dogFactParagraph = document.createElement("p");

    dogFactParagraph.innerHTML = `Dog Fact: ${dogFact}`;
    additonalInfo?.appendChild(dogFactParagraph);
  } catch (error) {
    console.error("Error:", error);
  }
};

startGame();
