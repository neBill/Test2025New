'use strict';

let rightOptionIndex;
//let isLearnMode;
let isHistorySave = true;
//let isShuffle;
let isAnswerDone = false;
let defaultRank;
// let isDefaultSettings = false;

let isMistakes = false;

const testSuccess = "<br>Тест успешно пройден!<br>Результат - 100%";
let mistakes = {};
let currentTestLength;
let curQuestionNumber;
const btnHome = document.getElementById('button_home');
const navBlock = document.getElementById('nav_block');
const divLavels = document.getElementById('levels');
const divTest = document.getElementById('test');
const btnMenu = document.getElementById('button_menu');
const headerBlock = document.getElementById('header_block');
const listBlock = document.getElementById('list-block');
const tglLearnMode = document.getElementById('learn_mode');
const tglShuffle = document.getElementById('shuffle');





class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}

class Counter {
  constructor(index) {    
    this.index = index
  }
}

// class WrongAnswers {
//    constructor(answer) {
//      this.answer = answer
//    }
// }


// class Errors {  
//   errors = []  
//   addError(error) {   
//     this.errors.push(error)
//   }
// }

// const wrongAnswers = new Errors();
const currentIndex = new Counter(0);
const currentTest = new CurrentTest();


function putToCache(elem, cache) {
  if (cache.indexOf(elem) !== -1) {
    return;
  }
  let i = Math.floor(Math.random() * (cache.length + 1));
  cache.splice(i, 0, elem);
}


function madness() {
  let cache = [];
  return function(a, b) {
    putToCache(a, cache);
    putToCache(b, cache);
    return cache.indexOf(b) - cache.indexOf(a);
  };
}


function shuffle(arr) {  

    let compare = madness();
    return arr.sort(compare);

}

function showErrors(questionNumber) {
  
  divTest.style.display = 'block';
 
  const history = getTestHistory(currentTest.id) 

  const mistakes = Object.values(history)[0];  


  //проверить есть ли ошибки
  const chosenOption = mistakes[questionNumber]; 

  //alert(chosenOption)

  // Loop through options to display correct and wrong answers
  for (let i = 0; i < 4; ++i) {

    const optionElement = document.getElementById('option' + i);

    //alert(currentTest.test.length)

    const answer = testsList[defaultRank][currentTest.id][0][questionNumber - 1][1][i];
    // Check if the option is correct
    const isCorrect = answer[1] === 1; 

    optionElement.style.border = isCorrect ? 'var(--right-answer-border)' : 'none';

    optionElement.innerHTML = answer[0];
  // Disable the options after showing the error
    optionElement.disabled = true; 

  }

  // Highlight the incorrect answer chosen by the user
  document.getElementById('option' + chosenOption).style.border = 'var(--wrong-answer-border)';


}


function updateQuestionBlock() { 

  let currentQuestionBlock = testsList[defaultRank][currentTest.id][0][currentIndex.index - 1];

  let optionsCount = currentQuestionBlock[1].length;  

  if(optionsCount < 4) {

    while(optionsCount < 4) {

      currentQuestionBlock[1].push(["Нет варианта ответа (*)", 0]);

      optionsCount++;

    }

  }   


  shuffle(currentQuestionBlock[1]);  

  for (var i = 0; i < 4; ++i) {

    if (currentQuestionBlock[1][i][1] == 1) {

      rightOptionIndex = i;

    }

    document.getElementById('option' + i).innerHTML = currentQuestionBlock[1][i][0];

    document.getElementById('option' + i).style.border = 'none';

    document.getElementById('option' + i).disabled = false;
  }

  document.getElementById('question').innerHTML = currentQuestionBlock[0];

  // alert(`Вопрос: ${curQuestionNumber}/${currentTestLength}`)
  
  document.getElementById('counter').innerHTML = `Вопрос: ${curQuestionNumber}/${currentTestLength}`;

}


function setTrainingMode(optionIndex) {

  document.getElementById('button_next').style.display = "inline-block";

  let borderColor = '';

  if (currentTest.test[currentIndex.index][1][optionIndex][1] == 1) {

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

  let rightAnswersQuantity = Math.round(questionsQuantity - errorsQuantity);

  let percent = Math.round(rightAnswersQuantity * 100 / (questionsQuantity));

  return { rightAnswers: rightAnswersQuantity, errorsPercent: percent };
}



function getTestHistory(testId) {

  const testHistory = localStorage.getItem(testId);

  if(!testHistory) return;

  return JSON.parse(testHistory);

}


function showTestResult() {  

  // const history = getTestHistory(currentTest.id) 

  // const mistakes = Object.values(history)[0];  
  
  // const questionQuantity = Number(Object.keys(history)[0]);

  // const testState = questionQuantity === currentTestLength ? 'завершен' : 'остановлен';

   
  
  // const mistakesQuantity = Object.keys(mistakes).length;

  // const mistakesHeader = mistakesQuantity === 0 ? '' : '<br>Ваши ошибки:<br>'; 

  // if (mistakesQuantity === 0 && testState === 'завершен') {

  //   document.getElementById('result').innerHTML = testSuccess;      

  //   localStorage.removeItem(currentTest.id);

  //   return;      

  // }else{      


  //   const testInfo = `<br>Тест ${testState}<br>Пройдено вопросов: ${questionQuantity} из ${currentTestLength}<br>`;

  //   const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, mistakesQuantity);         
  
  //   const result = `${testInfo}Правильных ответов:  ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)${mistakesHeader}`;        
  
  //   document.getElementById('result').innerHTML = result;
  
  //   let c = 1;

  //   const btn = document.getElementById('errors');
  
  //   Object.keys(mistakes).forEach((key) => {  

  //     btn.innerHTML += `<button id="${key}" class="error_button">${c}</button>`;

  //     c++;    
  
  //   })    

  // }

   
    const history = getTestHistory(currentTest.id);
    
    if (!history || typeof history !== 'object') {
        console.error("Invalid test history");
        return;
    }

    const questionQuantity = Number(Object.keys(history)[0]);
    const mistakes = Object.values(history)[0];

    if (!mistakes || typeof mistakes !== 'object') {
        console.error("Mistakes data is invalid");
        return;
    }

    const mistakesQuantity = Object.keys(mistakes).length;
    const testState = questionQuantity === currentTestLength ? 'завершен' : 'остановлен';

    if (mistakesQuantity === 0 && testState === 'завершен') {
        document.getElementById('result').innerHTML = testSuccess;

        isMistakes = false;


        localStorage.removeItem(currentTest.id);
        return;
    }

   // alert( `<br>Тест ${testState}<br>Пройдено вопросов: ${questionQuantity} из ${currentTestLength}<br>`)

    const testInfo = `<br>Тест ${testState}<br>Пройдено вопросов: ${questionQuantity} из ${currentTestLength}<br>`;
    const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, mistakesQuantity);

    const mistakesHeader = mistakesQuantity > 0 ? '<br>Ваши ошибки:<br>' : '';

    const resultHTML = `${testInfo}Правильных ответов: ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)${mistakesHeader}`;
    document.getElementById('result').innerHTML = resultHTML;

    // Clear previous buttons before adding new ones
    const btnContainer = document.getElementById('errors');
    btnContainer.innerHTML = ''; 

    let count = 1;

    Object.keys(mistakes).forEach((key) => {
        const button = document.createElement('button');
        button.id = key;
        button.className = 'error_button';
        button.textContent = count++;
        btnContainer.appendChild(button);
    });
}
 
    


function showSelectedMistake(id) {

  // const buttonClass = event.target.className;

  // const buttonId = event.target.id;

  // if (buttonClass == "error_button") {

    const links = document.querySelectorAll(".error_button");

    showErrors(id);

    links.forEach(link => {

      link.setAttribute("style", "background:`:root { --main-bg-color}`");

    });

    document.getElementById(id).style.background = "var(--error-btn-color)";

  //}



 


}



document.addEventListener("click", function(event) {

  // const buttonClass = event.target.className;

  // const buttonId = event.target.id;

  // if (buttonClass == "error_button") {

  //   const links = document.querySelectorAll(".error_button");

  //   showErrors(buttonId);

  //   links.forEach(link => {

  //     link.setAttribute("style", "background:`:root { --main-bg-color}`");

  //   });

  //   document.getElementById(buttonId).style.background = "var(--error-btn-color)";

  // }



  // if (buttonClass == "font-size-change") {

  //    chageFontSize(buttonId);
  // }


});


//переход на главную страницу,нажата кнопка На главную или Завершить
btnHome.addEventListener("click", function(event) {

    //showLevels();


  const buttonText = event.target.textContent

  if (buttonText == "Завершить") {

    if(currentIndex.index === 1 || !isAnswerDone) {

        showLevels();    
        return;
    
      } 
    
    showResultsPage();

    showTestResult();

    

  }

  if (buttonText == "На главную") { 

    isAnswerDone = false;

    showLevels();

  }

   



  if(tglShuffle.checked) {

    localStorage.removeItem(currentTest.id);

    currentTest.id = '';

  }
  

})

button_next.addEventListener("click", function() {

  updateQuestionBlock();

  document.getElementById('button_next').style.display = "none";

})



function saveTestHistory(optionIndex) {    
 
  //const key = currentIndex.index;
  

 // const key = curQuestionNumber;

  //alert("first")

  //let isMistakes = true;
  

  let curItem = {};
  
  const history = localStorage.getItem(currentTest.id);


  //let mistakesQuantity = 0;
 


//ubrat
  if (history) {

     curItem = JSON.parse(history);

    //const mistakes = Object.values(curItem)[0]; 

    //mistakesQuantity = Object.keys(mistakes).length;
  
  
    // alert(mistakesQuantity)

   }

  

  let key;

  if(isMistakes) {

    key = Object.keys(curItem)[0];
   
  }else{

    key = currentIndex.index;

  }





 // alert(key)
  
  let value = Object.values(curItem)[0] || {};

  //alert(Object.keys(curItem)[0])
  
  if (optionIndex !== rightOptionIndex) {
    
    value[key] = optionIndex;    

  } else {    

    delete value[key];
    

  }

  //alert(key)
  
  curItem = { [key]: value};

 

  //alert(Object.keys(curItem)[0])

  localStorage.setItem(currentTest.id, JSON.stringify(curItem));

  //alert(Object.keys(curItem)[0])

}



function check(optionIndex) {  

  isAnswerDone = true;  

  //alert(curQuestionNumber + " -- " + currentTestLength)

  //alert('hear')

  if (curQuestionNumber === currentTestLength) {      
    
    saveTestHistory(optionIndex);

    //alert('optionIndex')
 
    showResultsPage();

    showTestResult();

   // currentIndex.index = 1; 
   
    //alert(currentIndex.index)

    return;

  } 

  if(isHistorySave){   

    // alert('nen')

    saveTestHistory(optionIndex);

  }

  //  LearnMode //////////////////////////
  //при верном ответе автоматически преходит на следующий вопрос, в новой редакции переход осуществляется пользователем
  //if (isLearnMode === true && optionIndex != rightOptionIndex) { 
  ///////////////////////////////////////////////////////////////////////////
 // if (isLearnMode === true) { 


  if (tglLearnMode.checked === true && optionIndex != rightOptionIndex) { 

    setTrainingMode(optionIndex);

    currentIndex.index++;

    return;

  } 

  currentIndex.index++;

  curQuestionNumber++;

  updateQuestionBlock();

}



function showMainPage() {

  document.getElementById('main_page').style.display = "block";
  document.getElementById('results').style.display = "none";
  divLavels.style.display = "none";
  document.getElementById('questions_counter').style.display = 'none';
  divTest.style.display = "none";
  navBlock.style.display = "none";
  document.getElementById('result').style.display = "none";

}

function showLevels() {

  //alert(document.getElementById('results').style.display)

  btnHome.style.display = "none";
  navBlock.style.display = "none";
  divLavels.style.display = "block";
  document.getElementById('errors').innerHTML = "";
  document.getElementById('test-title').innerHTML = "";
  document.getElementById('results').style.display = "none";
  divTest.style.display = "none";
  btnMenu.style.display = "block";
  headerBlock.style.display = "block";
  document.getElementById('counter').style.display = "none";
  //wrongAnswers.errors.length = 0;

  //alert(document.getElementById('results').style.display)

}

function showTest() {

  document.getElementById('questions_counter').style.display = 'block';
  divLavels.style.display = "none";
  document.getElementById('counter').style.display = "block";
}




  //if(event.target.className !== "test_button") return; 

  //currentTest.id = event.target.id;  
  


  document.addEventListener("click", function(event) {

    const id = event.target.id;

    const classNamed = event.target.className;

    if(classNamed === "test_button") {
      
      chooseTest(id);

    } 

    if (classNamed == "error_button") {

      showSelectedMistake(id);

    }

  
  })



//choose test
// document.addEventListener("click", function(event) {    

//   if(event.target.className !== "test_button") return; 

//   currentTest.id = event.target.id;     

//   //const testHistory = localStorage.getItem(currentTest.id);

//   const history = getTestHistory(currentTest.id) 

//   //const mistakes = Object.values(history)[0];  

//   //alert(history)
 
  
//   // if(testHistory) {   
//   if(history) {

//     //const history = JSON.parse(testHistory) ;   

//     //mistakes = Object.values(history)[0];   
    
//     //const mistakes = getMistakes(testHistory);  

//     const mistakes = Object.values(history)[0]; 

//     const mistakesQuantity = Object.keys(mistakes).length;

//     const quNumber = Number(Object.keys(history)[0]);

//     currentTestLength = testsList[defaultRank][currentTest.id][0].length;

//     //тест завершен
//     if(quNumber === currentTestLength) {     

//       curQuestionNumber = 1;

//       if(mistakesQuantity > 0) {

//         currentIndex.index = Object.keys(mistakes)[0];        

//         currentTestLength = mistakesQuantity;
  
//       } else {
  
//         localStorage.removeItem(currentTest.id);
  
//         currentTestLength = testsList[defaultRank][currentTest.id][0].length;
//       }

//     }else {  //тест не завершен

//       //alert('тест не завершен');      

//       currentIndex.index = Number(Object.keys(history)[0]) + 1;

//       curQuestionNumber = currentIndex.index;      


//     }

    
//   } else {

//     currentTestLength = testsList[defaultRank][currentTest.id][0].length;

//     currentIndex.index = 1;

//     curQuestionNumber = 1;

//   }

   
//   if (isShuffle) {

//     shuffle(currentTest.test);

//     currentTest.id += '$';

//   } else if (isLearnMode) {

//     currentTest.id += '*';
  
//   }  
 
//   showChosenTest(event.target.textContent);  

//   updateQuestionBlock();

// });


function chooseTest(id) {

  //if(event.target.className !== "test_button") return; 

  //currentTest.id = event.target.id;  
  
  
  currentTest.id = id;
  

  //const testHistory = localStorage.getItem(currentTest.id);

  const history = getTestHistory(currentTest.id) 

  //const mistakes = Object.values(history)[0];  

  //alert(history)
 
  
  // if(testHistory) {   
  if(history) {

    //const history = JSON.parse(testHistory) ;   

    //mistakes = Object.values(history)[0];   
    
    //const mistakes = getMistakes(testHistory);  

    const mistakes = Object.values(history)[0]; 

    const mistakesQuantity = Object.keys(mistakes).length;

    const quNumber = Number(Object.keys(history)[0]);

    currentTestLength = testsList[defaultRank][currentTest.id][0].length;


   // alert(currentTestLength + " -- " + quNumber); 

    //тест завершен
    if(quNumber === currentTestLength) {   
      
      //alert('тест завершен'); 

      curQuestionNumber = 1;

      if(mistakesQuantity > 0) {

        currentIndex.index = Object.keys(mistakes)[0];        

        currentTestLength = mistakesQuantity;

        //////////////////////////

        // const { oldKey, ...rest } = obj;

        // obj = { newKey: oldKey, ...rest };

        
        isMistakes = true;
        /////////////////////////////////////////
  
      } 
      
      // else {


      //   alert(currentTestLength);
  
      //   //localStorage.removeItem(currentTest.id);

       
  
      //   currentTestLength = testsList[defaultRank][currentTest.id][0].length;

      //   alert(currentTestLength);
      // }

    }else {  //тест не завершен

        

      currentIndex.index = Number(Object.keys(history)[0]) + 1;

      curQuestionNumber = currentIndex.index;      


    }

    
  } else {

    currentTestLength = testsList[defaultRank][currentTest.id][0].length;

    currentIndex.index = 1;

    curQuestionNumber = 1;

    //alert(" ne ---   " + currentIndex.index);    

  }

   
  if (tglShuffle.checked) {

    shuffle(currentTest.test);

    currentTest.id += '$';

  } else if (tglLearnMode.checked) {

    currentTest.id += '*';
  
  }  
 
  showChosenTest(event.target.textContent);  

  updateQuestionBlock();


}



function showResultsPage() {
  
  btnHome.style.display = "block";
  document.getElementById('button_next').style.display = "none";
  document.getElementById('results').style.display = 'block';
  divTest.style.display = "none";
  document.getElementById('result').style.display = "block";
  document.getElementById('counter').style.display = "none"; 
  btnHome.innerText = "На главную";

}

function showChosenTest(testName) {
  
  divTest.style.display = "block";
  document.getElementById('counter').innerHTML = "Вопрос: 1/" + currentTestLength;
  document.getElementById('counter').style.display = "block";
  document.getElementById('questions_counter').style.display = 'block';
  divLavels.style.display = "none";
  navBlock.style.display = "block";
  document.getElementById('button_next').style.display = "none";

  btnHome.innerText = "Завершить";
  btnHome.style.display = "block";


  btnMenu.style.display = "none";
  document.getElementById('test-title').innerHTML = testName;
  headerBlock.style.display = "none";
 

}

//////////////////////////////////////////////////////////////////////list///////////////////

const testTitle = document.getElementById('test-title');

testTitle.addEventListener("click", list)

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
 

  listBlock.style.display = "block";

  questions = []

}  
  

const btnHideList = document.getElementById('btn-hide-list')

btnHideList.addEventListener("click", hideListBlock)

function hideListBlock() {

  listBlock.style.display = "none";

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
  
