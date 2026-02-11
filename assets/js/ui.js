'use strict';

let rightOptionIndex;
//let isLearnMode;
let isHistorySave = true;
let isAnswerDone = false;
let defaultRank;

let state = {
  currentIndex: 0,
  currentTestLength : 0,
  wrongAnswers: [],
  isMistakes: false,  
};

const divNavigation = document.getElementById('navigation-block');
const divLevels = document.getElementById('levels-buttons-block');
const divTestButtons = document.getElementById('test-buttons-block');
const btnMenu = document.getElementById('button-menu');
const divList = document.getElementById('list-block');
const tglLearnMode = document.getElementById('learn-mode-toggle');
const btnQuestion = document.getElementById('question-button');
const pQuestionsCounter = document.getElementById('questions-counter');
const divQuestionsCounter = document.getElementById('questions-counter-block');
const divTestResult = document.getElementById('test-result-block');
const tglLevel5 = document.getElementById('level-5-toggle');
const tglLevel6 = document.getElementById('level-6-toggle');
const divDropdownMenu = document.getElementById("dropdown-menu-block");
const divMenuButton = document.getElementById("menu-button-block");
const divNext = document.getElementById("button-next-block");
const divHome = document.getElementById('button-home-block');
const btnNext = document.getElementById("button-next");
const btnHome = document.getElementById('button-home');
const divHelp = document.getElementById("help-block");
const btnIncreaseFontSize = document.getElementById('font-increase');
const btnDecreaseFontSize = document.getElementById('font-decrease');
const btnDefaultFontSize = document.getElementById('font-default');
const lbFontSizeSample = document.getElementById('font-size-sample');
const tglTheme =  document.getElementById('theme-toggle'); 
const pTestTitle = document.getElementById('test-title');
const docBody = document.body;

const btnHideList = document.getElementById('btn-hide-list');
btnHideList.addEventListener("click", hideListBlock);

class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}

const currentTest = new CurrentTest();



//навешиваем на кнопки вариантов событие клик
document.querySelectorAll('.option_button').forEach(button => {
    button.addEventListener('click', handleClick);
});


let newFailedQuestions = []

//клик по кнопке варианта ответа
function handleClick(event) { 

  const id = event.target.id;   

  const element = document.getElementById(id); 

  const userAnswerStatus = element.dataset.status;  

  const userAnswerIndex = parseInt(element.dataset.answerId);  

  const isFailedQuestions = state.isMistakes;

  let nextQuestionIndex;


  if(isFailedQuestions) {   

    correctFailedQuestion(userAnswerStatus, userAnswerIndex);

    if (state.wrongAnswers.length <= 0) {    
      
      if(newFailedQuestions.length > 0) {

        state.wrongAnswers = newFailedQuestions;

        newFailedQuestions = [];

        saveTestHistory(state);

        return;
      }

      handleTestCompletion(true);

      return;
      
    } 
   

    nextQuestionIndex = state.wrongAnswers[state.currentIndex][0];


  } else {

    answerQuestion(userAnswerStatus, userAnswerIndex);    

    nextQuestionIndex = ++state.currentIndex;    

    if (state.currentTestLength === state.currentIndex) {      

      handleTestCompletion(true);      

      return;
      
    } 

  }  

  
  navigateToNextQuestion(nextQuestionIndex);  

  isAnswerDone = true;
}


function answerQuestion(userAnswerStatus, selectedAnswerIndex){

  if(userAnswerStatus === "false"){       
    
    state.wrongAnswers.push([state.currentIndex, selectedAnswerIndex]);   
      
  } 

  saveTestHistory(state);  

}

function correctFailedQuestion(userAnswerStatus, selectedAnswerIndex){  
     
  
    //не прав
  if(userAnswerStatus === "false"){     
      
    const questionIndex = state.wrongAnswers[0][0];

    newFailedQuestions.push([questionIndex, selectedAnswerIndex]);    

    state.wrongAnswers.splice(0, 1);  

    saveTestHistory(state);
   
   
  }else{//прав  

    state.wrongAnswers.splice(0, 1);  
    
    state.currentTestLength = state.wrongAnswers.length;    

    saveTestHistory(state);          

  }

}


function navigateToNextQuestion(nextQuestionIndex) {  

  let questionBlock = getCurrentQuestionBlock(nextQuestionIndex);

  fillQuestionBlock(questionBlock, true);
  
}

function handleTestCompletion(isCompleted) {

    showResultsPage();
    showTestResult(isCompleted);

    const failedQuestionCount = state.wrongAnswers.length;    
    
    if (failedQuestionCount <= 0) {
      clearTestState();
    } else {
        state.isMistakes = true;        
        state.currentIndex = 0;
        state.currentTestLength = failedQuestionCount;
        saveTestHistory(state);
    }
}





function fillQuestionBlock(questionBlock, isShuffle) {   
  
  const REQUIRED_OPTIONS = 4;

  // 1. Безопасное получение и копирование массива ответов
  let answers = Array.isArray(questionBlock?.answers)
    ? [...questionBlock.answers]
    : [];

  // 2. Дополнение до требуемого количества вариантов
  while (answers.length < REQUIRED_OPTIONS) {
    answers.push('Нет варианта ответа (*)');  }

  
  // 3. Перемешивание массива при прохождении теста ( при показе ошибок должен быть "false")
  if(isShuffle) {
    //const shuffled = shuffleArray(answers);
    answers = shuffleArray(answers);   

  }

  //alert(answers[0].text)

  //4. Заполнение кнопок ответов
  for (let i = 0; i < REQUIRED_OPTIONS; i++) {
    const qBtn = document.getElementById(`option${i}`);

    if (qBtn) {
      //qBtn.textContent = shuffled[i];
      qBtn.textContent = answers[i].text; 
      qBtn.dataset.status = answers[i].correct;
      qBtn.dataset.answerId = answers[i].id;
      qBtn.style.border = 'none';
      qBtn.disabled = false;
    } else {
      console.warn(`Элемент #option${i} не найден в DOM. Проверьте разметку.`);
    }
  }

  

   // 6. Обновление текста вопроса
  if (btnQuestion) {
    btnQuestion.textContent = questionBlock.question || 'Вопрос не указан';
  } else {
    console.error('Элемент btnQuestion не найден в DOM.');
  }

  // 7. Обновление счётчика вопросов
  //updateTeststatistics(); 

 // alert(state.currentTestLength)

  pQuestionsCounter.textContent = `Вопрос: ${state.currentIndex + 1}/${state.currentTestLength}`;  

}



function shuffleArray(array) {
  const arr = [...array]; // создаём копию, чтобы не мутировать оригинал
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // обмен через деструктуризацию
  }
  return arr;
}


function setTrainingMode(optionIndex) {

  document.getElementById('button_next').style.display = "inline-block";

  let borderColor = '';

  if (currentTest.test[currentIndex][1][optionIndex][1] == 1) {

    borderColor = "var(--right-answer-border)";

  } else {

    borderColor = "var(--wrong-answer-border)";

    document.getElementById('option' + rightOptionIndex).style.border = "var(--right-answer-border)";
  }

    document.getElementById('option' + optionIndex).style.border = borderColor;  

  for (let element of divTest.children) {

    element.disabled = true;

  }

}



function calcRightAnswers(questionsQuantity, errorsQuantity ) {  
  const rightAnswersQuantity = questionsQuantity - errorsQuantity;
  const percent = Math.round(rightAnswersQuantity * 100 / questionsQuantity); 
  return { rightAnswers: rightAnswersQuantity, errorsPercent: percent };
}

function getTestHistory(testId) {
  const testHistory = localStorage.getItem(testId);
  if(!testHistory) return;
  return JSON.parse(testHistory);
}


function createTestReport(isMistakes, isComplite, statistic){

  let textArray = [];
  let testState = isComplite ? "завершен" : "остановлен";

  if(isMistakes){
    textArray.push(
      `Тест ${testState}`,
      `Пройдено вопросов: ${statistic.completedQuestions} из ${state.currentTestLength}`,
      `Правильных ответов: ${statistic.rightAnswers} из ${statistic.completedQuestions} (${statistic.errorsPercent}%)`,
      'Ваши ошибки:'
    );
    
  }else{
    textArray.push(
      'Тест успешно пройден!',
      'Результат — 100%'
    );     
  }
  return textArray;
}

////////////////////////////////////////////////////////

function showTestResult(isTestCompleted) {

  const history = getTestHistory(currentTest.id); 

  if (!history) {
    console.error('История теста не найдена');
    return;
  } 

  



  const completedQuestions = state.currentIndex;


  let textArray = [];

  let buttons = [];

  //alert(state.currentIndex)

  if(history.wrongAnswers.length > 0){      
    const mistakesQuantity = history.wrongAnswers.length;
    const { rightAnswers, errorsPercent } = calcRightAnswers(completedQuestions, mistakesQuantity);   

    textArray = createTestReport(true, isTestCompleted, {      
      completedQuestions : completedQuestions,
      rightAnswers : rightAnswers,
      errorsPercent : errorsPercent,      
    });   

    buttons = createMistakesButtons(mistakesQuantity, history.wrongAnswers);

  }else{
   
    //state.isMistakes = false;  
   

    clearTestState();
    textArray = createTestReport(false, isTestCompleted, {});     
    localStorage.removeItem(currentTest.id); 
  } 

  renderResult(textArray, buttons);   
}


function renderResult(textArray, buttons) {
  divTestResult.innerHTML = '';
  printTestResult(textArray);  
  if(buttons.length <= 0) return;
  divTestResult.appendChild(buttons);  
}


function printTestResult(arrayText){    
  arrayText.forEach(text => {
    const line = document.createElement('p');
    line.textContent = text;
    line.className = "p-result";     
    divTestResult.appendChild(line);
  })    
}


function createMistakesButtons(mistakesQuantity, mistakes) {    
  
  const mistakeButtons = document.createElement('p');   
  for (let i = 0; i < mistakesQuantity; i++) {    
    const btn = document.createElement('button');
    btn.id = `erBtn${i}`;
    btn.value = i;
    btn.dataset.questionIndex = mistakes[i][0];
    btn.dataset.userOption = mistakes[i][1];
    btn.className = 'error_button';   
    btn.textContent = i + 1;      

    btn.addEventListener('click', function() {      
      showSelectedMistake(this.id);
    });

    mistakeButtons.appendChild(btn);
  }  
 return mistakeButtons;
}



function showSelectedMistake(btnId) {   

  const targetBtn = document.getElementById(btnId);

  const btns = document.querySelectorAll(".error_button");

  btns.forEach(btn => {
    
    btn.style.background = "var(--main-bg-color)";

  });

  targetBtn.style.background = "var(--error-btn-color)"; 

  const questionIndex = targetBtn.dataset.questionIndex;   

  const questionBlock = testBases[currentTest.id].testBody[questionIndex];   

  divTestResult.classList.remove('hidden');

  divTestButtons.classList.remove('hidden');

  fillQuestionBlock(questionBlock, false);  

  highlightOptions(targetBtn);  

  lockOptionButtons(".option_button");
 
}

function highlightOptions(targetBtn) {

  const userAnswer = targetBtn.dataset.userOption;

  document.getElementById('option0').style.border = 'var(--right-answer-border)';

  document.getElementById('option' + userAnswer).style.border = 'var(--wrong-answer-border)';

}




function lockOptionButtons(selector) {

  document.querySelectorAll(selector).forEach(node => {
    node.disabled = true;
  });
}


function getCurrentQuestionBlock(questionIndex) {  
  const questionBlock = testBases[currentTest.id].testBody[questionIndex];
  return questionBlock;
}

btnHome.addEventListener("click", function(event) {    
  const btnText = event.target.textContent;
  
  if (btnText === "Завершить") {
    handleFinishButtonClick();
  } else if (btnText === "На главную") {
    handleMainPageButtonClick();
  }
});

function handleFinishButtonClick() {

  saveTestHistory(state);

  const history = getTestHistory(currentTest.id);
  if (!history || history.wrongAnswers.length < 1 || !isAnswerDone) {
    showMainPage();
    return;
  }    

 // clearTestState();

  showResultsPage();
  const isCompleted = isTestCompleted();
  showTestResult(isCompleted);
}

function handleMainPageButtonClick() {
  isAnswerDone = false;
  showMainPage();
}



btnNext.addEventListener("click", function() {

  const questionBlock = getCurrentQuestionBlock(state.currentIndex);

  fillQuestionBlock(questionBlock, true)

  btnNext.classList.add('hidden');

})



function saveTestHistory(testInfo) {     

  localStorage.setItem(currentTest.id, JSON.stringify(testInfo));   

}

function clearTestState() {

  state.currentIndex = 0;
  state.wrongAnswers = [];
  state.isMistakes = false;

};

function isTestCompleted() {

  return state.currentTestLength === state.currentIndex;
}

// function isIncorrectAnswers(){

//   return state.wrongAnswers.length > 0 ? true : false;

// }



// function checkAnswer(btnId) {   
  
//   // const isCompleted = isTestCompleted();  

//   //alert(state.currentIndex)
//   //alert(isCompleted)

//   // if (isCompleted) {

//     // alert('DONE')
//   //   handleTestCompletion(isCompleted);

//   //   return;
//   // }   
  
//   const userAnswerIndex = document.getElementById(btnId).value;

  
//   let questionBlock = getCurrentQuestionBlock(state.currentIndex);  
  
//   //alert(state.isMistakes)
  
//   if(state.isMistakes){
//      correctMistakes(userAnswerIndex);  
//      return; 
//   }
//   //if(!state.isMistakes) doTest(questionBlock, btnId);

//   //alert("state")

//   if(!state.isMistakes) doTest(userAnswerIndex);
  

  
//   //if (tglLearnMode.checked === true && optionIndex != rightOptionIndex) { 
//   // if (tglLearnMode.checked === true) { 

//   //   runLernMode();

//   // } 

  
//   const isCompleted = isTestCompleted();  
  

//   // if (isCompleted) {

//   //   alert('DONE')
//   //   handleTestCompletion(isCompleted);

//   //   return;
//   // } 

//   //alert(state.currentIndex)

//   questionBlock = getCurrentQuestionBlock(state.currentIndex);

//   fillQuestionBlock(questionBlock, true,);
 
// }

// function handleTestCompletion(isCompleted) {

//     showResultsPage();
//     showTestResult(isCompleted);

//     const failedQuestionCount = state.wrongAnswers.length;    
    
//     if (failedQuestionCount <= 0) {
//       clearTestState();
//     } else {
//         state.isMistakes = true;        
//         state.currentIndex = 0;
//         state.currentTestLength = failedQuestionCount;
//         saveTestHistory(state);
//     }
// }


// function correctMistakes(userAnswerIndex){  

//   alert(userAnswerIndex);

//   const questionIndex = state.wrongAnswers[state.currentIndex][0];

//   //const userAnswerIndex = document.getElementById(btnId).value; 

//   while(state.wrongAnswers.length > 0){

//     let questionBlock = getCurrentQuestionBlock(state.currentIndex);

//     fillQuestionBlock(questionBlock, true,);

//   }
  

  

//  // let el = [questionIndex, userAnswerIndex]; 

//   // alert('correct')

//  // let idx = state.wrongAnswers.findIndex(item => item[0] == state.currentIndex);    

//     //не прав
//   if(userAnswerIndex !== "0"){    
      

//    //alert('WR')
    
//    // state.wrongAnswers.splice(idx, 1, el);   

//     let el = [questionIndex, userAnswerIndex]; 

//    // alert(state.currentIndex)

//    // alert(state.wrongAnswers[state.currentIndex])

//     state.wrongAnswers.splice(state.currentIndex, 1, el);

//     saveTestHistory(state);

//     //alert(state.wrongAnswers.length);  


//     state.currentIndex++;
   
//   }else{//прав  
    
//     alert('ri')

//     //alert()

//     state.wrongAnswers.splice(0, 1);  
    
//    //saveTestHistory(state);

    


//     state.currentIndex = state.wrongAnswers[0][0];

//     saveTestHistory(state);
    
//     //state.currentTestLength--;

//     if(state.wrongAnswers.length <= 0) {  

//       saveTestHistory(state);    
  
//       showResultsPage();

//       const isCompleted = isTestCompleted();

//       showTestResult(isCompleted);   
      
//       return;

//     }


//        // state.currentIndex = 0;


//   }

//       //state.currentIndex++;

   


// }


// function doTest(userAnswerIndex){  

//   alert('test');
//   //const userAnswerIndex = document.getElementById(btnId).value;  

//   //alert(userAnswerIndex);

//   if(userAnswerIndex !== "0"){     
//     const el = [state.currentIndex, userAnswerIndex];


//     state.wrongAnswers.push(el);   
//   };    

//   state.currentIndex++;
//   saveTestHistory(state);  
// }

// function doTest(btnId){

//   //const correctAnswer = questionBlock.answers[0];

//   const userAnswerIndex = document.getElementById(btnId).value; 

//   //const userAnswer = document.getElementById(btnId).textContent; 
  
//   alert(userAnswerIndex)

//   // if(userAnswer !== correctAnswer){  

//   if(userAnswerIndex !== 0){
      
//    // const userAnswerIndex = questionBlock.answers.indexOf(userAnswer);

//     //const el = [state.currentIndex, userAnswerIndex];

//     const el = [state.currentIndex, userAnswerIndex];

//     state.wrongAnswers.push(el); 
  
//   };    

//   state.currentIndex++;

//   saveTestHistory(state);  

// }

function runLernMode(){

  if(optionIndex != rightOptionIndex){
    setTrainingMode(optionIndex);
    currentIndex++;
    return;
  }
}


function showMainPage() {

  const elementsToHide = [
    
    divTestButtons,
    divNavigation,
    divTestResult,
    divQuestionsCounter,
    divHelp,
    divList,
    divDropdownMenu    
      
  ];

  const elementsToShow = [
    
    divMenuButton,
    divLevels
    
  ];

  hideElements(elementsToHide);

  showElements(elementsToShow); 

  removeButtons();

  createLevelsButtons(); 

  pTestTitle.textContent = "";

}

function testButtonClick(event) { 
  
  const target = event.target;
  currentTest.id = target.id;  
  chooseTest(currentTest.id, target.textContent);   
 
}

// document.addEventListener("click", function(event) {

//   const id = event.target.id;

//   const classNamed = event.target.className;

//   if(classNamed == "test_button") {   
    
  
//     if(id == "tempRemove") {

//       clearHistory();

//     } else {      

//       // alert()

//      // currentTest.id = id;

//      // chooseTest(id, event.target.textContent);          
      
//     }

//   } 

  // if (classNamed == "error_button") {   
    
  //   //alert()

  //  // showSelectedMistake(id);

  // }

  // if (classNamed == "option_button") {



  //   check(id);

  //   isAnswerDone = true;

  // }


//})





// function getNextIndex(history) {
  
//   if (!history) return 0;

//   // if (history.isMistakes) {
//   //   return history.wrongAnswers[0][0];
//   // }
  
//   return history.currentIndex;   
// }

function getCurrentTestLength(testId, history){   

  if (!history || !history.isMistakes) {
    return testBases[testId].testBody.length;
  }

  if (history.isMistakes && history.wrongAnswers) {
    return history.wrongAnswers.length;
  }
}



function chooseTest(testId, testName) {  
  
  const history = getTestHistory(testId);

  clearTestState();

  state.currentTestLength = getCurrentTestLength(testId, history);

  //alert(state.currentTestLength)

  let currentIndex = 0;
  let questionIndex = 0;
  
  if (history) {

    state = history;    

    if (history.isMistakes) {
      //currentIndex = 0;     

      questionIndex = history.wrongAnswers[0][0];
    } else {
      currentIndex = history.currentIndex;
      questionIndex = currentIndex;
    }
  }



  state.currentIndex = currentIndex;

  //alert(state.currentTestLength)


  showChosenTest(testName);  

  const questionBlock = getCurrentQuestionBlock(questionIndex);
  fillQuestionBlock(questionBlock, true);

  //alert(state.currentTestLength)


}



function showResultsPage() {  

  const elementsToHide =[
    divTestButtons,
    pQuestionsCounter
  ]

  const elementsToShow =[   
    divHome,
    divTestResult
  ]


  hideElements(elementsToHide);
  showElements(elementsToShow);

  btnHome.textContent = "На главную";
  btnHome.value = "mainpage";

}


function hideElements(elementsArray){
  elementsArray.forEach(element => {
      element.classList.add('hidden');
  });

   
}

function showElements(elementsArray){  
  elementsArray.forEach(element => {
    element.classList.remove('hidden');
  });

}



function showChosenTest(testName) {
  const elementsToHide = [
    divLevels,
    divMenuButton,    
    divNext
  ]

  const elementsToShow = [ 
    divTestButtons,
    pQuestionsCounter,
    divQuestionsCounter,
    divNavigation,
    divHome   
  ]

  hideElements(elementsToHide);
  showElements(elementsToShow);
  pQuestionsCounter.textContent = `Вопрос: 1/"${state.currentTestLength}`;
  pTestTitle.textContent = testName;
  btnHome.textContent = "Завершить";
  btnHome.value = "complite";
}

//////////////////////////////////////////////////////////////////////list///////////////////

pTestTitle.addEventListener("click", list)

function list() {

  const parrentBlock = document.getElementById('q-list');

  let questions = testsList[defaultRank][currentTest.id][0]

  let i = 0;

  questions.forEach((question) => {
   
    const line = document.createElement('p');
    line.textContent = `${i + 1}) ${question[0]}`;
    line.id = i.toString();
    line.className = "q-line"
    parrentBlock.appendChild(line);
    i++;


  })  
 
  divList.classList.remove('hidden');

  questions = []

}  
  
function hideListBlock() {  
  divList.classList.add('hidden');
}


document.addEventListener("click", function (event) { 

  if(event.target.className !== 'q-line') return;

 // let questions = testsList[defaultRank][currentTest.id][0]  

  const parrentBlock = document.getElementById('mod-content'); 

  const question = document.createElement('p');

  const line = document.createElement('hr');

  line.className = 'line'

  let questions = testsList[defaultRank][currentTest.id][0]

  question.textContent = questions[event.target.id][0];  

  let text = questions[event.target.id][1];   
  
  while (parrentBlock.hasChildNodes()) {

    parrentBlock.removeChild(parrentBlock.firstChild);

  }

  parrentBlock.appendChild(question);

  parrentBlock.appendChild(line);

    let i = 0;
  
    text.forEach((answer) => {
    
      
      const paragraph = document.createElement('p');
      
      paragraph .id = i.toString();
      

      paragraph .innerHTML = '   ' + `${i + 1}) ${answer[0]}`;
      
      if(answer[1].toString() === "1")
      {        
        

        paragraph .className = 'right-option';

        
      }

      parrentBlock.appendChild(paragraph );

      i++;
  
  
    })
    
    modal.style.display = "block";


});



// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
 var span = document.getElementsByClassName("close")[0];



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
  
