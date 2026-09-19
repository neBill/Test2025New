'use strict';

//const { createElement } = require("react");


let currentFontSize = 20; 

function increaseFontSize() { 
  

  const newFontSize = currentFontSize + 1; 
  setFontSize(newFontSize);

}

function decreaseFontSize() { 
  const newFontSize = currentFontSize - 1;
  setFontSize(newFontSize);

}

function defaultFontSize() {  
  setFontSize(20)
}


function setFontSize(fontSize) {

  const MIN_FONT_SIZE = 17;
  const MAX_FONT_SIZE = 23;

  if (fontSize > MAX_FONT_SIZE || fontSize < MIN_FONT_SIZE) return;

  // if(fontSize > 23 || fontSize < 17) return;  

  docBody.style.setProperty("--btn-font-size", `${fontSize}px`);
 
  lbFontSizeSample.style.fontSize = `${fontSize}px`;

  currentFontSize = fontSize;
}


btnIncreaseFontSize.addEventListener('click', increaseFontSize);

btnDecreaseFontSize.addEventListener('click', decreaseFontSize);

btnDefaultFontSize.addEventListener('click', defaultFontSize);

//btnMenu.addEventListener("click", showHideMenu);
// btnMenu.addEventListener("click",() => {

//   menuController.toggle();
//  // console.log('tyt')

// });

btnMenu.addEventListener("click",() => toggleSettingsPage());



btnRemoveHistory.addEventListener("click",  clearHistory);

btnRemoveCache.addEventListener("click",  clearCache);

btnRemoveSettings.addEventListener("click",  removeSettings);

btnShowHelp.addEventListener("click",  showHelpPage);

btnSaveSelectedTests.addEventListener("click",  saveSelectedTests);

btnShowProfilePage.addEventListener('click', () => toggleProfilePage());

btnGoBack.addEventListener("click",  () => toggleProfilePage());


//btnGoBack.addEventListener("click",  togglePage);


function clearCache(){   

  caches.open('offline-cache-v1').then(cache => {
    cache.keys().then(keys => {
      keys.forEach(request => {
        cache.delete(request);
      });
    });
  });
}

function clearHistory() {  

  for(let i = 0; i < localStorage.length; i++){
    
    if(localStorage.key(i) === "settings") continue

    localStorage.removeItem(localStorage.key(i));

  }

}

function saveSelectedTests(){

  const checkedCheckBoxes = getSelectedValues(divChooseProfiles);    

  if(!checkedCheckBoxes.length ) {

    console.log('Не выбрано')

  }else{

    const settings = JSON.parse(JSON.stringify(defaultSettings));

    let testsList = [];


    checkedCheckBoxes.forEach(element => {

      testsList.push(element)

      //console.log(element)
      
    });

    settings.selectedTests = testsList;

    saveSettings(settings);


    console.log(settings.selectedTests[0])



  }

}


window.addEventListener("load", ()=>{  

 // showMainPage();

  removeButtons(); 


 const isSettings = localStorage.getItem('settings');

 let savedSettings;

//  if(isSettings){
//   console.log('yes');

//  }else{
//   console.log('no');

//  }

  //const savedSettings = JSON.parse(localStorage.getItem('settings'));



  //console.log('first');



  //set saved  settings
  if(isSettings) {   

    console.log('yes');

    savedSettings = JSON.parse(localStorage.getItem('settings'));

    if(savedSettings.selectedTests.length === 0){

      createDefaultTestsSelector();

    }else{

      createTestsSelector(savedSettings.selectedTests);

    }

    

     //const savedSettings = localStorage.getItem('settings');

    // if(Object.hasOwn(settings, SELECTED_TESTS)) {

    //   console.log(settings[SELECTED_TESTS]);

    // } else {

    //console.log(savedSettings);

    //   //removeButtons(); 


    //   const testButton = createTestButton(0, 'Выбрать тесты');

    //   //button.addEventListener('click', testButtonClick); 

    //   testButton.addEventListener('click', () => togglePage(true))

    //   divTestsSelector.appendChild(testButton);

      // console.log(savedSettings.isDarkTheme);


    // }

    //  const settings = JSON.parse(JSON.stringify(savedSettings));

    //  settings.isLearnMode = savedSettings.isLearnMode;
    //  settings.isDarkTheme = savedSettings.isDarkTheme;
    //  settings.fontSize = savedSettings.fontSize;

    //console.log(savedSettings.isDarkTheme);

    setSettings(savedSettings);  

    // const defaultSettings = {
    //   isLearnMode : false, 
    //   isDarkTheme : false,   
    //   fontSize : 20,
    //   selectedTests : []
    // }


        
  } else {

    console.log('no');


    //localStorage.setItem("settings", JSON.stringify(defaultSettings)); 
    
    // const settings = JSON.parse(JSON.stringify(defaultSettings));

    //  settings.isLearnMode = savedSettings.isLearnMode;
    //  settings.isDarkTheme = savedSettings.isDarkTheme;
    //  settings.fontSize = savedSettings.fontSize;


    setSettings(defaultSettings); 

    saveSettings(defaultSettings);

    createDefaultTestsSelector();
    
  }    
 
  //createLevelsButtons();

  //createDefaultTestsSelector();

  showMainPage();
  
});

//лечение выхода из приложения при нажании кнопки назад в андроид
window.addEventListener('load', function() {
    window.history.pushState({}, '')
});
  
window.addEventListener('popstate', function() {   
    btnHome.click();    
    window.history.pushState({}, '')
});



// tglLevel5.addEventListener('change', function() {   
//   setRankToggles('rank5')  
// });

// tglLevel6.addEventListener('change', function() {  
//   setRankToggles('rank6')  
// });


// const testsList = {
   
//   rank5 : { 
//     st5_1 : [test_5s_block_1, "5p Стандарт 1"],
//     st5_2 : [test_5s_block_2, "5p Стандарт 2"],
//     ex5 : [test_5ex, "5р эксперт"],
//     ot_1 : [test_ot_block_1, "Охрана труда 1"],
//     ot_2 : [test_ot_block_2, "Охрана труда 2"],
//     ot5_2025 : [test_otrp, "ОT 2025"],
//   },    
    
//   rank6 : {      
//     st6_1 : [test_6s_block_1, "6p Стандарт 1"],
//     st6_2 : [test_6s_block_2, "6p Стандарт 2"],
//     st6_3 : [test_6s_block_3, "6p Стандарт 3"],
//     st6_4 : [test_6s_block_4, "6p Стандарт 4"],
//     ex6 : [test_6e_block_1, "6р Эксперт"],
//     ot_1 : [test_ot_block_1, "Охрана труда 1"],
//     ot_2 : [test_ot_block_2, "Охрана труда 2"],
//     ot6_2025 : [test_otrp, "ОT 2025"],
//     tmp : [temp, "TEMP"],  
//   },

// }

function createDefaultTestsSelector() { 

  const button = document.createElement('button'); 
  button.className = 'test-button';
  button.textContent = 'Выбрать тесты'; 

  button.addEventListener('click', function() {   

    toggleProfilePage();
    this.remove();

  });

  divTestsSelector.appendChild(button);  
}


function createTestsSelector(selectedTests){  

  selectedTests.forEach((item) => { 

    console.log(testBases.item)

    const testButton = createTestButton(item, item, );
   
    testButton.addEventListener('click', testButtonClick);

    divTestsSelector.appendChild(testButton);   

 });

  // Object.keys(testsBases).forEach(key => {   
    
  //   const testButton = createTestButton(key, testsBases[key].testTitle);

  //   //button.addEventListener('click', testButtonClick); 

  //   divTestsSelector.appendChild(testButton);

  // });

  
 
  // testButtonsContainer.classList.add('hidden');
}

function createTestButton(id, textContent, clickFunction){

  const button = document.createElement('button');   
  button.id = id;
  button.className = "test-button";     
  button.textContent = textContent;
  button.addEventListener('click', clickFunction);  
  return button;

}

const toggleProfilePage = () => {
  const isProfileHidden = divProfilePage.classList.contains('hidden');

  // Переключаем явно: если был скрыт — показываем, и наоборот
  if (isProfileHidden) {
    divProfilePage.classList.remove('hidden');
    divMainSettings.classList.add('hidden');
    btnMenu.classList.add('hidden');

    createProfilesList();

  } else {
    divProfilePage.classList.add('hidden');
    divMainSettings.classList.remove('hidden');
    btnMenu.classList.remove('hidden');

    // const listContainer = document.querySelector('.profiles-list');
    // if (listContainer) {
    //   listContainer.innerHTML = '';
    // }
  }
};






// btnShowProfilePage.addEventListener('click', () => togglePage(true));

// btnGoBack.addEventListener("click",  () => togglePage(false));


// function hideProfilePage() {

//    const elementsToHide = [
//     divProfilePage     
//   ]

//   const elementsToShow = [ 
//     divMainSettings,      
//     btnMenu, 
//   ]

//   showHidePages(elementsToShow, elementsToHide);

// }

// function showProfilePage() {

//    const elementsToHide = [       
//     divMainSettings,      
//     btnMenu    
//   ]

//   const elementsToShow = [ 
//    divProfilePage
//   ]
  
 

//   showHidePages(elementsToShow, elementsToHide);

// }

function showMainPage() {

  const elementsToHide = [
    
    testButtonsContainer,
    navigationContainer,
    testResultsContainer,
    questionsCounter,
    helpSection,
    listPageContainer,
    divMainSettings,
    divProfilePage   
      
  ];

  const elementsToShow = [    
    
    divTestsSelector,
    btnMenu
    
  ];

  // hideElements(elementsToHide);

  // showElements(elementsToShow); 

  showHidePages(elementsToShow, elementsToHide);

  //removeButtons();  

  //createLevelsButtons(testBases); 

  pTestTitle.textContent = "";

  

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


  // hideElements(elementsToHide);
  // showElements(elementsToShow);

  showHidePages(elementsToShow, elementsToHide);

  btnHome.textContent = "На главную";
  btnHome.value = "mainpage";

}

function showChosenTest(testName, counterText) {
  const elementsToHide = [
    divTestsSelector,
    // divMenuButton,    
    divNext,
    btnMenu
  ]

  const elementsToShow = [ 
    testButtonsContainer,
    pQuestionsCounter,
    questionsCounter,
    navigationContainer,
    divHome   
  ]

  // hideElements(elementsToHide);
  // showElements(elementsToShow);  

  showHidePages(elementsToShow, elementsToHide);

 

  renderQuestionCounter(counterText);

  pTestTitle.textContent = testName;
  btnHome.textContent = "Завершить";
  btnHome.value = "complite";
}


function showHidePages(showArray, hideArray){
  hideArray.forEach(element => {
      element.classList.add('hidden');
  });
  showArray.forEach(element => {
      element.classList.remove('hidden');
  });
   
}



function createProfilesList(){

  

  while (divChooseProfiles.firstChild) {
    divChooseProfiles.removeChild(divChooseProfiles.firstChild);
  }

  // testBases.forEach(key => {
  Object.keys(testBases).forEach(key => {
  // Создаём контейнер для чекбокса и подписи
  const label = document.createElement('label');
  label.style.display = 'block';
  label.style.marginBottom = '10px';

  // Создаём сам чекбокс
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = testBases[key].testTitle;

  // Добавляем текст подписи
  const text = document.createTextNode(testBases[key].testTitle);

  // Собираем элементы вместе
  label.appendChild(checkbox);
  label.appendChild(text);
  divChooseProfiles.appendChild(label);
  });


}

function getSelectedValues(container) {
  //nst container = document.getElementById(containerId);
  const checkedCheckboxes = container.querySelectorAll('input[type="checkbox"]:checked');
  const selectedValues = Array.from(checkedCheckboxes).map(cb => cb.value);
  return selectedValues;
}






function removeButtons() {    
  divTestsSelector.innerHTML = '';  
}


const toggleSettingsPage = () => {

  //console.log('ffff')

  const isSettingsHidden = divMainSettings.classList.contains('hidden');

  
  if (isSettingsHidden) {

    //divProfilePage.classList.remove('hidden');
   // divMainSettings.classList.add('hidden');
   // btnMenu.classList.add('hidden');

   divMainSettings.classList.remove('hidden');
   divTestsSelector.classList.add('hidden')

   // createProfilesList();

  } else {


    //divProfilePage.classList.add('hidden');
    //divMainSettings.classList.remove('hidden');
   // btnMenu.classList.remove('hidden');

    divMainSettings.classList.add('hidden');
    divTestsSelector.classList.remove('hidden')
  
  }
};


const menuController = {
  

  menuPage: divMainSettings,
  testSelector: divTestsSelector,

  show() {  
    
    console.log('show')
 
    this.menuPage.classList.toggle('hidden');
    this.testSelector.classList.toggle('hidden'); 
    this.isVisible = true;

   
    // const currentSettings = JSON.parse(JSON.stringify(defaultSettings));

    //console.log(' no set')

  },

  hide() {    

    console.log('hide')
    
    this.menuPage.classList.toggle('hidden');
    this.testSelector.classList.toggle('hidden'); 
    this.isVisible = false;

    let settings;

    const raw = localStorage.getItem('settings');

    if (raw !== null) {
      //const user = JSON.parse(raw);
      // работаем с user
      

    } else {
      console.log('Настройки по умолчанию');

      settings = JSON.parse(JSON.stringify(defaultSettings));
       

    }


    //const settings = JSON.parse(JSON.stringify(defaultSettings));

    


    

    // settings.isLearnMode = tglLearnMode.checked;
    // settings.isDarkTheme = tglTheme.checked;


    //settings.fontSize = currentFontSize;

    //console.log('hide')

    setSettings(settings); 

    // const settings = {

  //   isLearnMode : tglLearnMode.checked, 
  //   isDarkTheme : tglTheme.checked,   
  //   fontSize : currentFontSize,
  //   selectedTests : []

  // }

    saveSettings(settings);
   
  },

  toggle() {

    //console.log('work')

    if (!this.isVisible) {
      this.show();

     // console.log('show')

    } else {
      this.hide();

       //console.log('hide')


    }
  }
};



function showHideMenu() {  
  // Так как класс есть, он будет убран
   // А при повторном вызове будет снова добавлен  
  divMainSettings.classList.toggle('hidden')
  //divTestsSelector.classList.toggle('hidden')

    //console.log('work')


    if(divMainSettings.classList.contains('hidden')) {  

      //console.log('hide')

      // Правильно (создаёт копию):
      //const currentSettings = JSON.parse(JSON.stringify(defaultSettings));

      const currentSettings = {};

      currentSettings.isLearnMode = tglLearnMode.checked;
      currentSettings.isDarkTheme = tglTheme.checked;
      currentSettings.fontSize = currentFontSize;

      //const isSettings = localStorage.getItem("settings");
     // const settings = localStorage.getItem("settings") ? currentSettings : defaultSettings;

     //..............сохранение изменений настроек и загрузка их.......................................


      setSettings(currentSettings);

      saveSettings(currentSettings);  

      console.log("saved")

      removeButtons();
      //createLevelsButtons(testBases);

      const directChildren =divTestsSelector.children.length;

      if(directChildren === 0) {

        console.log(directChildren)
        createDefaultTestsSelector();

       // divTestsSelector.classList.add('hidden')
        divTestsSelector.classList.remove('hidden')

      } else{

        createLevelsButtons(testBases);

      }



      //createTestsSelector()

    }else{


      //divTestsSelector.classList.remove('hidden')
      divTestsSelector.classList.add('hidden')
      console.log('visible')
    }

}


function removeSettings() {  
  localStorage.removeItem("settings");  
  setSettings(defaultSettings);


}


function hideHelpPage() {
  helpSection.classList.add('hidden'); 
}

function showHelpPage() {
  helpSection.classList.remove('hidden'); 
  showHideMenu();
}


function saveSettings(settings){  

  // const settings = {

  //   isLearnMode : tglLearnMode.checked, 
  //   isDarkTheme : tglTheme.checked,   
  //   fontSize : currentFontSize,
  //   selectedTests : []

  // }  

  localStorage.setItem('settings', JSON.stringify(settings));
}

function updateTheme(isDark) {
  tglTheme.checked = isDark;

  //console.log(isDark)
  docBody.className = isDark ? 'dark-theme' : 'light-theme';
}

function updateLearnMode(isLearn) {
  tglLearnMode.checked = isLearn;
}

function updateFontSize(size) {
  currentFontSize = size;
  docBody.style.setProperty('--btn-font-size', `${size}px`);
}

function setSettings(settings) {

  //console.log(settings.isDarkTheme)

  if (!tglTheme || !tglLearnMode || !docBody) return;

  console.log(settings)



  updateTheme(settings.isDarkTheme);
  updateLearnMode(settings.isLearnMode);
  updateFontSize(settings.fontSize);
  //createTestsSelector(selectedTests, )
}


// function setSettings(settings) {

//   tglTheme.checked = settings.isDarkTheme;  
//   tglLearnMode.checked = settings.isLearnMode;   
//   currentFontSize = settings.fontSize; 

//   docBody.style.setProperty("--btn-font-size", `${settings.fontSize}px`);
//   let theme;
//   tglTheme.checked === true  ? theme = 'dark-theme' : theme = 'light-theme';  
  
//   docBody.className = theme;

// }


// function setRankToggles(rank){  

//   tglLevel6.checked = rank === 'rank6';
//   tglLevel5.checked = rank !== 'rank6';
//   defaultRank = rank;

//   // const isRank6 = rank === 'rank6';
//   // lev6Toggle.checked = isRank6;
//   // lev5Toggle.checked = !isRank6;
//   // defaultRank = rank;

// }

const defaultSettings = {
  isLearnMode : false, 
  isDarkTheme : false,   
  fontSize : 20,
  selectedTests : []
}

