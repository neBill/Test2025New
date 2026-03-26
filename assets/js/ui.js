'use strict';

let rightOptionIndex;
//let isLearnMode;
let isHistorySave = true;
let defaultRank;

let state = {
  currentIndex: 0,
  currentTestLength : 0,  
  isMistakes: false,
  isTestCompleted : false,
  wrongAnswers: [],
  retryQuestions : []
};



const answerButtons = document.querySelectorAll('.option-button');
const navigationContainer = document.getElementById('navigation-block');
const divLevels = document.getElementById('levels-buttons-block');
const testButtonsContainer = document.getElementById('test-buttons-block');
const btnMenu = document.getElementById('button-menu');
const listPageContainer = document.getElementById('questions-list-page');
const tglLearnMode = document.getElementById('learn-mode-toggle');
const btnQuestion = document.getElementById('question-button');
const pQuestionsCounter = document.getElementById('questions-counter');
const questionsCounter = document.getElementById('questions-counter-block');
const testResultsContainer = document.getElementById('test-result-block');
const tglLevel5 = document.getElementById('level-5-toggle');
const tglLevel6 = document.getElementById('level-6-toggle');
const divDropdownMenu = document.getElementById('dropdown-menu-block');
const divMenuButton = document.getElementById('menu-button-block');
const divNext = document.getElementById('button-next-block');
const divHome = document.getElementById('button-home-block');
const btnNext = document.getElementById('button-next');
const btnHome = document.getElementById('button-home');
const helpSection = document.getElementById('help-block');
const btnIncreaseFontSize = document.getElementById('font-increase');
const btnDecreaseFontSize = document.getElementById('font-decrease');
const btnDefaultFontSize = document.getElementById('font-default');
const lbFontSizeSample = document.getElementById('font-size-sample');
const tglTheme =  document.getElementById('theme-toggle'); 
const pTestTitle = document.getElementById('test-title');
const docBody = document.body;

const modalListContainer = document.getElementById('mod-content');
const col1 = document.getElementById('col1');
const col2 = document.getElementById('col2');
const answerListContainer = document.getElementById('answer-list-block');

const divListBlock = document.getElementById('questions-list-block');////

const btnHideList = document.getElementById('btn-hide-list');

btnHideList.addEventListener('click', hideListBlock);

class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}

const currentTest = new CurrentTest();


//навешиваем на кнопки вариантов событие клик
document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', handleClick);
});


//клик по кнопке варианта ответа
function handleClick(event) { 
  
  const button = event.target; 
  //const isMistakeMode = state.isMistakes;        
  const userAnswerId = Number(button.dataset.answerId);  
  let isAnswerCorrect = false;

  if(userAnswerId === 0){

    isAnswerCorrect = true; 

  } 

  state.isMistakes ? runMistakeMod(isAnswerCorrect, userAnswerId) : runNormalMod(isAnswerCorrect, userAnswerId);
  
}

function runNormalMod(isAnswerCorrect, userAnswerId){

  if(!isAnswerCorrect) {     

    state.wrongAnswers.push([state.currentIndex, userAnswerId]);   

  }   

  state.currentIndex++;

  saveTestHistory(state);  

  renderQuestionCounter(`Вопрос: ${state.currentIndex + 1}/${state.currentTestLength}`);
  
  if (state.currentIndex === state.currentTestLength) {
    
    return handleTestCompletion(); 
  } 

  navigateToNextQuestion(state.currentIndex);

}



function runMistakeMod(isAnswerCorrect, userAnswerId){ 

  if(!isAnswerCorrect) { 

   state.wrongAnswers.push([state.currentIndex, userAnswerId]);   

  } 
  
  state.currentIndex++;

  saveTestHistory(state);  

  renderQuestionCounter(`Работа над ошибками\n\nВопрос: ${state.currentIndex + 1}/${state.currentTestLength}`);    

  if (state.currentIndex === state.retryQuestions.length) {   
    
    return handleTestCompletion();

  }     

  return navigateToNextQuestion(state.retryQuestions[state.currentIndex][0]);

}


function handleTestCompletion() {  

  state.isTestCompleted = true;

  if(state.wrongAnswers.length > 0){

    state.isMistakes = true;      

    state.retryQuestions = JSON.parse(JSON.stringify(state.wrongAnswers));

    state.wrongAnswers.length = 0;   
    
    //state.currentIndex = 0;

    //state.isTestCompleted = true;

    saveTestHistory(state);


  }else{

    //state.isMistakes = false; 


    localStorage.removeItem(currentTest.id);

  }

  //saveTestHistory(state);
  
  showResultsPage(); 

  showTestResult(state);

  // state.currentIndex = 0;

  //  saveTestHistory(state);

  //localStorage.removeItem(currentTest.id);
  
}




function navigateToNextQuestion(index) {  
  const questionBlock = getCurrentQuestionBlock(index);
  fillQuestionBlock(questionBlock); 
  
}




function renderQuestionCounter(text){  

  pQuestionsCounter.textContent  =  text;

}


// function fillQuestionBlock(questionBlock, isShuffle) {   
function fillQuestionBlock(questionBlock) {  
  
  const REQUIRED_OPTIONS = 4;

  let answers = Array.isArray(questionBlock.answers)
    ? questionBlock.answers.map(a => ({ ...a }))
    : [];

    
  for (let i = REQUIRED_OPTIONS - 1; i >= answers.length; i--) {
    answers.push({
      text: 'Нет варианта ответа (*)',
      correct: false,
      id: i
    });
  }
  
  // if(isShuffle) {    
    answers = shuffleArray(answers);   
  // }

  clearOptionsHighlight(answerButtons);  

  answerButtons.forEach((button, index) => {        
    const a = answers[index];     
    button.textContent = a.text; 
    button.dataset.success = a.success;
    button.dataset.answerId = a.id;
    button.disabled = false;     
  }); 
   
  btnQuestion.textContent = questionBlock.question;
 
  
}




function shuffleArray(array) {
  const arr = array.map(item => ({ ...item }));

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
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


function calcRightAnswers(testParams) {  
  
  let totalQ = 1;
  let incorrectQ = 0;

  if(testParams.isTestCompleted){

    totalQ = testParams.currentTestLength; 
    incorrectQ = testParams.retryQuestions.length;

  }else{

    totalQ = testParams.currentIndex; 
    incorrectQ = testParams.wrongAnswers.length;

  }
  
  const correctAnswers = totalQ - incorrectQ;  
  const percent = Math.round(correctAnswers * 100 / totalQ); 
  return { correctAnswers: correctAnswers, errorsPercent: percent };

}


const createSuccessReport = (testParams) => [
  'Тест успешно пройден!',
  `Пройдено вопросов: ${testParams.currentIndex} из ${testParams.currentTestLength}`,
  'Результат — 100%'
];

const createUnSuccessReport = (testState, testParams) => {

  const { correctAnswers, errorsPercent } = calcRightAnswers(testParams);
  
  const array = [
    `Тест ${testState}`,
    `Пройдено вопросов: ${testParams.currentIndex} из ${testParams.currentTestLength}`,
    `Правильных ответов: ${correctAnswers} из ${testParams.currentIndex} (${errorsPercent}%)`,
    'Ваши ошибки:'
  ]
  return array

};




function showTestResult(testParams){  

  let testReport;
  let buttons = []; 

  let testState = testParams.isTestCompleted ? "завершен" : "остановлен";

  if(testParams.isTestCompleted){   

    //alert(state.isMistakes)
  
    if(!state.isMistakes){   

      

     
      
      testReport = createSuccessReport(testParams)

      
      // localStorage.removeItem(currentTest.id);
      

      clearTestState();  

    }else{

      

      testReport = createUnSuccessReport(testState, testParams);

      buttons = createMistakesButtons(testParams.retryQuestions);


    }
    
  

  }else{

   
    
    if(testParams.wrongAnswers.length > 0){

    

      testReport = createUnSuccessReport(testState, testParams);

      buttons = createMistakesButtons(testParams.wrongAnswers);

      //testResultsContainer.appendChild(buttons);  



    } else{

      //isMistakes = false;
    }


  }

 
  //renderResult(testReport, buttons);

  printTestResult(testReport, buttons); 

}







// function renderResult(testReport, buttons) {

//   //testResultsContainer.innerHTML = '';

  
//   //printTestResult(testReport);    

//   //if(!state.isMistakes) return;

//   // const buttons = createMistakesButtons(state.retryQuestions);

//    //testResultsContainer.appendChild(buttons);  
// }

function printTestResult(arrayText, buttons){      

  testResultsContainer.innerHTML = '';

  arrayText.forEach(text => {
    const line = document.createElement('p');
    line.textContent = text;
    line.className = 'p-result';     
    testResultsContainer.appendChild(line);
  })     

  if(buttons.length === 0) return;

  testResultsContainer.appendChild(buttons);
}


function createMistakesButtons(mistakesArray) {  
      
  const mistakes = mistakesArray.length;
  const mistakeButtons = document.createElement('p');   
  for (let i = 0; i < mistakes; i++) {    
    const btn = document.createElement('button');
    btn.id = `erBtn${i}`;
    btn.value = i;
    btn.dataset.questionIndex = mistakesArray[i][0];
    btn.dataset.userOption = mistakesArray[i][1];
    btn.className = 'error-button';   
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
  const btns = document.querySelectorAll('.error-button');
  
  btns.forEach(btn => btn.classList.toggle('active-button', btn === targetBtn));
    
  const questionIndex = targetBtn.dataset.questionIndex;   
  const questionBlock = testBases[currentTest.id].testBody[questionIndex];    
  
  [testResultsContainer, testButtonsContainer].forEach(container => 
    container.classList.remove('hidden')
  );
  
  fillQuestionBlock(questionBlock);  
  highlightOptions(targetBtn); 
  lockOptionButtons('.option-button'); 
}

function highlightOptions(targetBtn) {
  const selectedAnswer = targetBtn.dataset.userOption;  
  // const answerButtons = document.querySelectorAll('.option-button');
  const correctAnswerId = 'option0';
  clearOptionsHighlight(answerButtons)
  answerButtons.forEach(button => {
    // button.classList.remove('correct', 'incorrect');    
    if (button.id === correctAnswerId) {    
      button.classList.add('correct');      
    }    
    if (button.id === `option${selectedAnswer}`) {
      button.classList.add('incorrect');
    }
  }); 
}

function clearOptionsHighlight(buttons){
  buttons.forEach(button => {
    button.classList.remove('correct', 'incorrect'); 
  })
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
   
    handleStopTest();

  } else if (btnText === "На главную") {
    
    showMainPage();
  }
});

function handleStopTest() {        
 
  if (state.wrongAnswers.length === 0) {     
    showMainPage();     
    return;
  }else{

    //state.currentIndex = 0;
  }
   
  state.isTestCompleted = false;
  
  showResultsPage();

  showTestResult(state); 

  saveTestHistory(state);
}


btnNext.addEventListener("click", function() {

  const questionBlock = getCurrentQuestionBlock(state.currentIndex);
  fillQuestionBlock(questionBlock);
  btnNext.classList.add('hidden');

})



function saveTestHistory(testInfo) {     

  localStorage.setItem(currentTest.id, JSON.stringify(testInfo));   

}



function runLernMode(){

  if(optionIndex != rightOptionIndex){
    setTrainingMode(optionIndex);
    currentIndex++;
    return;
  }
}


function showMainPage() {

  const elementsToHide = [
    
    testButtonsContainer,
    navigationContainer,
    testResultsContainer,
    questionsCounter,
    helpSection,
    listPageContainer,
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
  
  const testTitle = event.target.textContent;
  currentTest.id = event.target.id;  
  chooseTest(currentTest.id, testTitle);   
 
}

function clearTestState() {
  
  state.currentIndex = 0,
  state.currentTestLength = 0,  
  state.isMistakes = false,
  state.isTestCompleted = false,
  state.wrongAnswers = [],
  state.retryQuestions = []  

};


// function getCurrentTestLength(testId, history){   

//   // if (!history || !history.isMistakes) {
//   //   return testBases[testId].testBody.length;
//   // }

//   // if (history.isMistakes && history.wrongAnswers) {
//   //   return history.wrongAnswers.length;
//   // }


// }

function getTestState(testId) {
  if(localStorage.getItem(testId)) {
    return JSON.parse(localStorage.getItem(testId));    
  }else{
    return state;
  }
}



function chooseTest(testId, testTitle) {  

  clearTestState();

  let questionCounterText;
  let questionIndex;

  state = getTestState(testId);  

  if(state.currentTestLength === 0)
  {
    state.currentTestLength = testBases[testId].testBody.length;
  }

  if(state.isMistakes){

    state.currentTestLength = state.retryQuestions.length;

    //state.currentIndex = 0;

    questionIndex = state.retryQuestions[state.currentIndex][0];   

    questionCounterText = `Работа над ошибками\n\nВопрос: ${state.currentIndex + 1}/${state.currentTestLength}`;

  }else{

    questionCounterText = `Вопрос: ${state.currentIndex + 1}/${state.currentTestLength}`;
    questionIndex = state.currentIndex;

  }

  showChosenTest(testTitle, questionCounterText);  

  const questionBlock = getCurrentQuestionBlock(questionIndex);


  fillQuestionBlock(questionBlock);
 
}


function showResultsPage() {  

  const elementsToHide =[
    testButtonsContainer,
    pQuestionsCounter
  ]

  const elementsToShow =[   
    divHome,
    testResultsContainer
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



function showChosenTest(testName, counterText) {
  const elementsToHide = [
    divLevels,
    divMenuButton,    
    divNext
  ]

  const elementsToShow = [ 
    testButtonsContainer,
    pQuestionsCounter,
    questionsCounter,
    navigationContainer,
    divHome   
  ]

  hideElements(elementsToHide);
  showElements(elementsToShow);  

 

  renderQuestionCounter(counterText);

  pTestTitle.textContent = testName;
  btnHome.textContent = "Завершить";
  btnHome.value = "complite";
}

//////////////////////////////////////////////////////////////////////list///////////////////

pTestTitle.addEventListener("click", showQuestionsList)

function showQuestionsList() {

  const questions = testBases[currentTest.id].testBody;    
  
  questions.forEach((question, index) => {
    const p = document.createElement('p');
    p.id = index;
    p.className = 'question-in-list';
    p.textContent = `${index + 1}) ${question.question}`;
    divListBlock.appendChild(p);
    
  });

   listPageContainer.classList.remove('hidden');
 

}  
  
function hideListBlock() {    
  divListBlock.innerHTML = ""; 
  listPageContainer.classList.add('hidden'); 
}


// Функция для очистки DOM-элемента
const clearNode = (node) => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

// Функция для создания параграфа с ответом
const createAnswerParagraph = (answer) => {
    const p = document.createElement('p');
    p.id = answer.id;
    p.innerHTML = `${answer.id + 1}) ${answer.text}`;
    return p;
};

// Функция для создания параграфа с меткой
const createLabelParagraph = (answer) => {
    const p = document.createElement('p');
    if (answer.success) {
        p.innerHTML = '&#10004;';
    }
    return p;
};

// Основная функция обработки клика
const handleQuestionsListClick = (event) => {
  const target = event.target;  
  if (!target.classList.contains('question-in-list')) return;  
  // Получаем данные
  const answers = testBases[currentTest.id].testBody[target.id].answers;  
  // Очищаем блоки
  clearNode(col1);
  clearNode(col2);
  // Заполняем ответы
  answers.forEach((answer) => {
      col1.appendChild(createLabelParagraph(answer));
      col2.appendChild(createAnswerParagraph(answer));
  });    
    
  modalListContainer.appendChild(answerListContainer);
  modal.style.display = 'block';      
  
};

// Добавляем обработчик
document.addEventListener('click', handleQuestionsListClick);

// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.querySelector(".close-modal");

// Добавляем обработчики событий
span.addEventListener('click', closeModal);

// Функция для открытия модального окна
function openModal() {
  modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
  modal.style.display = 'none';
}

// Закрываем модальное окно при клике вне его
window.addEventListener('click', (event) => {
  if (event.target === modal) {
      closeModal();
  }
});
  
