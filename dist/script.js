var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var worker = new Worker("worker.js", { type: "module" });
var amountQuestion = 10;
var category = 9;
var difficulty = "easy";
var result = document.querySelector(".detailed-question");
var possibleAns = document.querySelector(".answers");
var additonalInfo = document.querySelector(".info-for-answers");
var questionContainer = document.querySelector(".question-section");
var correctAnswerArr = [];
var correctAns = 0;
var wrongAns = 0;
var failedAnsr = [];
var correctedAns = [];
var index = 0;
var getData = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("https://opentdb.com/api.php?amount=".concat(amountQuestion, "&category=").concat(category, "&difficulty=").concat(difficulty, "&type=multiple"))];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("hhtp error ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                displayQuiz(data);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log("Not valid ".concat(error_1));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var form = document.querySelector(".main-form");
var startGame = function () {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var selectCat = document.getElementById("category").value;
        if (selectCat === "general-knowledge") {
            category = 9;
        }
        else if (selectCat === "history") {
            category = 23;
        }
        else if (selectCat === "politics") {
            category = 24;
        }
        var selectDif = document.getElementById("difficulty").value;
        if (selectDif === "easy") {
            difficulty = "easy";
        }
        else if (selectDif === "medium") {
            difficulty = "medium";
        }
        else if (selectDif === "hard") {
            difficulty = "hard";
        }
        var selectNumOfQ = document.getElementById("question-number").value;
        if (selectNumOfQ === "ten") {
            amountQuestion = 10;
        }
        else if (selectNumOfQ === "twenty") {
            amountQuestion = 20;
        }
        else if (selectNumOfQ === "thirty") {
            amountQuestion = 30;
        }
        localStorage.setItem("category", category);
        localStorage.setItem("difficulty", difficulty);
        localStorage.setItem("numberOfQ", amountQuestion);
        getData();
    });
};
var displayQuiz = function (data) {
    var currentQuestionIndex = 0;
    var showQuestion = function (index) {
        localStorage.setItem("allQuestions", JSON.stringify(data.results));
        var allQuestions = localStorage.getItem("allQuestions");
        var questionArr = JSON.parse(allQuestions);
        var currQ = questionArr[index];
        // const question = data.results[index];
        localStorage.setItem("question", currQ.question);
        // console.log(question)
        // object
        var answersContainer = document.createElement("div");
        answersContainer.id = "answers-container";
        var allAnswers = __spreadArray([currQ.correct_answer], currQ.incorrect_answers, true);
        // console.log(allAnswers)
        // array
        var messyAnswers = messyArr(allAnswers);
        // console.log(messyAnswers)
        //array
        messyAnswers.forEach(function (answer) {
            var label = document.createElement("label");
            var input = document.createElement("input");
            input.id = "choose-answer";
            var span = document.createElement("span");
            span.id = "options";
            input.type = "radio";
            input.name = "answer";
            input.value = answer;
            span.innerText = answer;
            label.appendChild(input);
            label.appendChild(span);
            answersContainer.appendChild(label);
        });
        result.innerHTML = "<span class=\"q-number\">".concat(index + 1, ".</span> ").concat(currQ.question);
        // console.log(result)
        possibleAns.innerHTML = "";
        possibleAns.appendChild(answersContainer);
        // console.log(possibleAns)
        questionContainer.appendChild(result);
        questionContainer.appendChild(possibleAns);
        questionContainer.appendChild(additonalInfo);
        // create chechAnswerBtn and addEventlistener
        var checkAnswerBtn = document.createElement("button");
        checkAnswerBtn.id = "check-answer-btn";
        checkAnswerBtn.innerText = "CHECK ANSWER";
        checkAnswerBtn.addEventListener("click", function () {
            var selectedAnswer = document.querySelector('input[name="answer"]:checked');
            // console.log(selectedAnswer)
            if (selectedAnswer) {
                var userAnswer = selectedAnswer.value;
                var isCorrect = userAnswer === currQ.correct_answer;
                if (isCorrect) {
                    correctAns++;
                    localStorage.setItem("numOfCorrectAns", correctAns);
                    correctAnswerArr.push(currQ.question);
                    localStorage.setItem("correctAnsQuestion", JSON.stringify(correctAnswerArr));
                }
                else {
                    wrongAns++;
                    localStorage.setItem("numOfWrongAns", wrongAns);
                    failedAnsr.push(currQ);
                    // correctedAns.push(currQ.correct_answer)
                }
                displayResult(isCorrect, questionArr);
            }
            else {
                alert("Please select one answer.");
            }
        });
        answersContainer.appendChild(checkAnswerBtn);
    };
    var displayResult = function (isCorrect, questionArr) {
        var resultMessage = document.createElement("p");
        resultMessage.id = "result-message";
        resultMessage.innerText = isCorrect ? "Correct!" : "Wrong!";
        possibleAns.appendChild(resultMessage);
        // create nextBtn and addEventlistener
        var nextBtn = document.createElement("button");
        nextBtn.innerText = "Next";
        nextBtn.id = "next-btn";
        nextBtn.addEventListener("click", function () {
            currentQuestionIndex++;
            if (currentQuestionIndex < questionArr.length) {
                showQuestion(currentQuestionIndex);
            }
            else {
                result.innerHTML = "Quiz completed! Number of correct answers: ".concat(correctAns, " ;Number of wrong answers ").concat(wrongAns);
                possibleAns.innerHTML = "";
                console.log(correctAnswerArr);
                console.log(failedAnsr);
                failedAnsr.forEach(function (q) {
                    additonalInfo.innerHTML += "<li>".concat(q.question, " </li> Correct answer:  ").concat(q.correct_answer);
                });
                additonalInfo.innerHTML += "<button class='new-game'>NEW GAME</button>";
                // const newGameB = document.querySelector('.new-game')
                additonalInfo.addEventListener("click", function (e) {
                    if (e.target.classList.contains("new-game")) {
                        newGame();
                    }
                });
                additonalInfo.innerHTML += "<button class='download-results'>DOWNLOAD RESULTS</button>";
                additonalInfo.addEventListener("click", function (e) {
                    if (e.target.classList.contains("download-results")) {
                        downloadResults();
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
var messyArr = function (array) {
    return array.sort(function () { return Math.random() - 0.5; });
};
var newGame = function () {
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
var downloadResults = function () {
    var numOfCorrectAns = JSON.parse(localStorage.getItem("numOfCorrectAns"));
    var numOfWrongAns = JSON.parse(localStorage.getItem("numOfWrongAns"));
    worker.onmessage = function (e) {
        var blob = e.data;
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "QuizScore.zip";
        link.click();
    };
    worker.postMessage({ numOfCorrectAns: numOfCorrectAns, numOfWrongAns: numOfWrongAns });
};
startGame();
