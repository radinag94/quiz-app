"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const worker = new Worker("dist/worker.js", { type: "module" });
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
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://opentdb.com/api.php?amount=${amountQuestion}&category=${category}&difficulty=${difficulty}&type=multiple`);
        if (!response.ok) {
            throw new Error(`hhtp error ${response.status}`);
        }
        const data = yield response.json();
        displayQuiz(data);
    }
    catch (error) {
        console.log(`Not valid ${error}`);
    }
});
const form = document.querySelector(".main-form");
const startGame = () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectCat = document.getElementById("category")
            .value;
        if (selectCat === "general-knowledge") {
            category = 9;
        }
        else if (selectCat === "history") {
            category = 23;
        }
        else if (selectCat === "politics") {
            category = 24;
        }
        const selectDif = document.getElementById("difficulty")
            .value;
        if (selectDif === "easy") {
            difficulty = "easy";
        }
        else if (selectDif === "medium") {
            difficulty = "medium";
        }
        else if (selectDif === "hard") {
            difficulty = "hard";
        }
        const selectNumOfQ = document.getElementById("question-number").value;
        if (selectNumOfQ === "ten") {
            amountQuestion = 10;
        }
        else if (selectNumOfQ === "twenty") {
            amountQuestion = 20;
        }
        else if (selectNumOfQ === "thirty") {
            amountQuestion = 30;
        }
        localStorage.setItem("category", category.toString());
        localStorage.setItem("difficulty", difficulty);
        localStorage.setItem("numberOfQ", amountQuestion.toString());
        getData();
    });
};
const displayQuiz = (data) => {
    let currentQuestionIndex = 0;
    const showQuestion = (index) => {
        var _a;
        localStorage.setItem("allQuestions", JSON.stringify(data.results));
        const allQuestions = (_a = localStorage.getItem("allQuestions")) !== null && _a !== void 0 ? _a : "";
        const questionArr = JSON.parse(allQuestions);
        const currQ = questionArr[index];
        // const question = data.results[index];
        localStorage.setItem("question", currQ.question);
        const answersContainer = document.createElement("div");
        answersContainer.id = "answers-container";
        const allAnswers = [currQ.correct_answer, ...currQ.incorrect_answers];
        const messyAnswers = messyArr(allAnswers);
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
            input.addEventListener("change", () => {
                const radioButtons = document.querySelectorAll('input[name="answer"]');
                radioButtons.forEach((radio) => {
                    radio.disabled = true;
                });
            });
        });
        result.innerHTML = `<span class="q-number">${index + 1}.</span> ${currQ.question}`;
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
            if (!answerChecked) {
                const selectedAnswer = document.querySelector('input[name="answer"]:checked');
                if (selectedAnswer) {
                    const userAnswer = selectedAnswer.value;
                    const isCorrect = userAnswer === currQ.correct_answer;
                    answerChecked = true;
                    if (isCorrect) {
                        correctAns++;
                        localStorage.setItem("numOfCorrectAns", correctAns.toString());
                        correctAnswerArr.push(currQ.question);
                        localStorage.setItem("correctAnsQuestion", JSON.stringify(correctAnswerArr));
                    }
                    else {
                        wrongAns++;
                        localStorage.setItem("numOfWrongAns", wrongAns.toString());
                        failedAnsr.push(currQ);
                        // correctedAns.push(currQ.correct_answer)
                    }
                    displayResult(isCorrect, questionArr);
                }
                else {
                    alert("Please select one answer.");
                }
            }
        });
        answersContainer.appendChild(checkAnswerBtn);
    };
    const displayResult = (isCorrect, questionArr) => {
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
            }
            else {
                result.innerHTML = `Quiz completed! Number of correct answers: ${correctAns} ;Number of wrong answers ${wrongAns}`;
                possibleAns.innerHTML = "";
                console.log(correctAnswerArr);
                console.log(failedAnsr);
                failedAnsr.forEach((q) => {
                    additonalInfo.innerHTML += `<li>${q.question} </li> Correct answer:  ${q.correct_answer}`;
                });
                displayDogFact();
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
    }
    else {
        console.error("Error: Unable to retrieve correct or wrong answer counts from local storage");
    }
};
const fetchDogFact = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl = "https://dogapi.dog/api/v2/facts";
    try {
        const response = yield fetch(apiUrl, {
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
        const data = yield response.json();
        if (data.data && data.data.length > 0) {
            return data.data[0].attributes.body;
        }
        else {
            throw new Error("Empty response from the API");
        }
    }
    catch (error) {
        console.error(`Error fetching dog fact: ${error}`);
        return "Failed to fetch a dog fact.";
    }
});
const displayDogFact = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dogFact = yield fetchDogFact();
        const dogFactParagraph = document.createElement("p");
        dogFactParagraph.innerHTML = `Dog Fact: ${dogFact}`;
        additonalInfo.appendChild(dogFactParagraph);
    }
    catch (error) {
        console.error("Error:", error);
    }
});
startGame();
