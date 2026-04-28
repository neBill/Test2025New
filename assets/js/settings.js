'use strict';


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

btnMenu.addEventListener("click", showHideMenu);

btnRemoveHistory.addEventListener("click",  clearHistory);

btnRemoveCache.addEventListener("click",  clearCache);

btnDefaultSettings.addEventListener("click",  removeSettings);

btnShowHelp.addEventListener("click",  showHelpPage);

btnGoBack.addEventListener("click",  showHideProfilePage);


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


window.addEventListener("load", ()=>{  

 // showMainPage();

  //set saved  settings
  if(localStorage.getItem('settings')) {   

    setSettings(JSON.parse(localStorage.getItem('settings')));  
        
  } else {

    //set end save default settings
    setSettings(defaultSettings);  
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
    
  }    
 
  //createLevelsButtons();
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




function createLevelsButtons(){  


  // let testsList = [];



  //  Object.keys(testBases).forEach(key => {

  //   testsList.push(testBases[key].testTitle)
   
  // });

  //alert(testsList)

  
  Object.keys(testBases).forEach(key => {
    const testButton = document.createElement('button');   
    testButton.id = key;
    testButton.className = "test_button";   
    testButton.textContent = testBases[key].testTitle;
    testButton.addEventListener('click', testButtonClick);  
    divTestsSelector.appendChild(testButton);
  });
 
   testButtonsContainer.classList.add('hidden');
}


btnShowProfilePage.addEventListener('click', showHideProfilePage)   


function showHideProfilePage() {

  // let display = divProfilePage.style.display; 

  divProfilePage.classList.toggle('hidden', false);

   const elementsToHide = [
    divMainSettings,
    // divMenuButton,    
    btnMenu
  ]

  const elementsToShow = [ 
   // testButtonsContainer,
   // pQuestionsCounter,
    //questionsCounter,
   // navigationContainer,
    //divHome   
  ]
  
 // if(display === "block") {   

  //  divProfilePage.style.display = "none"; 
   // mainMenu.style.display = "block";
   // header.style.display = "flex";

    // const divisions = document.getElementsByName('div');  
    // const levels = document.getElementsByName('lev'); 
    // let division;
    // let level;

    // for(var i = 0; i < divisions.length; i++){
    //   if(divisions[i].checked){
    //       division = divisions[i].id;
    //       break;
    //   }        
    // }

    // for(var i = 0; i < levels.length; i++){
    //   if(levels[i].checked){
    //       level = levels[i].id;
    //       break;
    //   }        
    // }

    

 // } else {   

  //  divProfilePage.style.display = "block";

    //hideElements(elementsToHide);
    //hideBlocks();

    
    //profileTitle
 // }


  // const elementsToHide = [
  //   divLevels,
  //   divMenuButton,    
  //   divNext
  // ]

  // const elementsToShow = [ 
  //   testButtonsContainer,
  //   pQuestionsCounter,
  //   questionsCounter,
  //   navigationContainer,
  //   divHome   
  // ]

  hideElements(elementsToHide);
  showElements(elementsToShow); 

}




function removeButtons() {    
  divTestsSelector.innerHTML = '';  
}

// btnMenu.addEventListener("click", showHideMenu);

function showHideMenu() {  
  // Так как класс есть, он будет убран
   // А при повторном вызове будет снова добавлен  
  divMainSettings.classList.toggle('hidden')
  divTestsSelector.classList.toggle('hidden')


   if(divMainSettings.classList.contains('hidden')) {  
    const currentSettings = {
      isLearnMode : tglLearnMode.checked,
      // isShuffle : tglShuffle.checked,
      isDarkTheme : tglTheme.checked,
      defRank : defaultRank,
      fontSize : currentFontSize,
      
    }

    const isSettings = localStorage.getItem("settings");
    const settings = isSettings ? currentSettings : defaultSettings;
    setSettings(settings);
    saveData('settings', settings);   
    removeButtons();
    createLevelsButtons();
  }

}

function removeSettings() {  
  localStorage.removeItem("settings");  
}


function hideHelpPage() {
  helpSection.classList.add('hidden'); 
}

function showHelpPage() {
  helpSection.classList.remove('hidden'); 
  showHideMenu();
}




function saveData(key, valueObject ){   
  localStorage.setItem(key, JSON.stringify(valueObject));
}


function setSettings(settings) {
  tglTheme.checked = settings.isDarkTheme; 
  
  //tglShuffle.checked = settings.isShuffle;

  tglLearnMode.checked = settings.isLearnMode;  
  defaultRank = settings.defRank;
  currentFontSize = settings.fontSize;
  //document.body.style.setProperty("--btn-font-size", `${settings.fontSize}px`);

  docBody.style.setProperty("--btn-font-size", `${settings.fontSize}px`);
  let theme;
  tglTheme.checked == true  ? theme = 'dark-theme' : theme = 'light-theme';  
  //const theme = settings.isDarkTheme ? 'dark-theme' : 'light-theme';
  docBody.className = theme;

}


function setRankToggles(rank){  

  tglLevel6.checked = rank === 'rank6';
  tglLevel5.checked = rank !== 'rank6';
  defaultRank = rank;

  // const isRank6 = rank === 'rank6';
  // lev6Toggle.checked = isRank6;
  // lev5Toggle.checked = !isRank6;
  // defaultRank = rank;

}

const defaultSettings = {
  isLearnMode : false,
  // isShuffle : false,
  isDarkTheme : false,
  defRank : 'rank6', 
  fontSize : 20,  
}

