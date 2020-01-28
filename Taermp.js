// ==UserScript==
// @name         Taermp!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include https://breadnroses.club/threads/*
// @description  Generates misspellings of TREMP for your posting pleasure
// @author       Crème Fatale
// @match        http://*/*
// @grant       GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    JavaScript:
    //find the xenforo postbuttons group
    //we'll add our created buttons there
var postButtons = document.querySelector(".formButtonGroup-extra");

    //the button that adds the TAERMP to the post
const trumpButton = document.createElement ('span');
    trumpButton.innerHTML = `<button type="button" class="button--link button button--icon button--icon--quote">
    <span class="button-text">Gimme a Taermp</span></button>`;

    trumpButton.setAttribute ('id', 'trumpButton');

    //the button that opens the settings modal
    //so the user can adjust the generator settings
const settingsButton = document.createElement('span');
    settingsButton.innerHTML = `<button type="button" class="button--link button button--icon button--icon--preview">
    <span class="button-text">Settings</span></button>`;
    settingsButton.setAttribute('id', 'settingsButton');

    //adding trumpButton and settingsBUtton to the postButtons
    postButtons.appendChild(trumpButton);
    postButtons.appendChild(settingsButton);

    //declare the variables that the generator will use
    //declaring them here makes them available for the settings display components
    const genSettings = {
        adulteration: 0,
        aggression:20,
        distortion:30,
        endWithP:false,
        forceVowels: true,
        natural:true,
        randomness:0,
        repeat:false,
        startWithT:true
    };

    const trump = 'trump'

//keys within striking distance of the letters
const keyMaps = {
    t: {
        1: 'rfghy',
        2: 'edcvbnju',
        3: 'wsx mki'
    },
    r: {
        1: 'edfgt',
        2: 'wsxcvbhy',
        3: 'qaz nju'
    },
    u: {
        1: 'yhnm,ki',
        2: 'tgb .ku',
        3: 'rfv /;p'
    },
    m: {
        1: 'nhjkl. ',
        2: 'bgyui.lo',
        3: '/;pvgy'
    },
    p: {
        1: "ol;'[",
        2: 'ik,./"',
        3: 'ujm'

    }
};

//fisher yates shuffle
const shuffle = (array) => {
    if (array.length > 0) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
      }
    };
    return array;
};

//make a string from an array of strings
const stringFromArray = (array) =>
    array.reduce((acc, cur) => {
        acc = acc + cur;
        return acc;
    }, '');

const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

//Math.random is not really random, but TERMP!
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;

//generates a number 1-3, weighted to 1, 2
const getSeverity = () => {
    const level = randomInt(1, 12);
    return level < 7
    ? 1
    : level < 11
        ? 2
        : 3
};

const randomLetter = (string) => string
    ? string[randomInt(0, string.length - 1)]
    : allLetters[randomInt(0, 51)];

    //each typo can be one, two, or three keys away
    //the odds are, lets say
    //half the time it'll be one key
    //a third of the time it'll be two keys
    //and a sixth of the time it'll be three keys
const typo = (letter) =>
    randomLetter(keyMaps[letter.toLowerCase()[getSeverity()]]);


const genTrump = ({
    //adulteration will insert extra letters
    adulteration,

    //aggression changes the odds that a letter will be capitalized
    aggression,

    //distortion increases typos
    distortion,

    //the trump will end with p, making it more recognizable
    endWithP,

    //force vowels flag will add vowel(s) in the middle ish, and maybe the end
    //making for a more readable termpo
    forceVowels,

    //the natural flag restricts adulteration to keys within range of the original letters
    natural,

    //randomness may increase adulteration, aggression, distortion
    randomness,

    //may repeat characters
    repeat,
    //the distorted trump will start with T
    startWithT
}) => {
    //make an array out of the string 'trump'
    const trumpArray = Array.from(trump);

    //if randomness is not 0
    if(!!randomness) {
        //increase adulteration by up to randomness / 10
        adulteration = adulteration + randomInt(0, Math.floor(randomness /10));
        //increase aggression and distortion by up to randomness
        aggression = aggression + randomInt(0, randomness);
        distortion = distortion + randomInt(0, randomness);
    };

    //if distortion and adulteration are 0, return a trump (SAD!)
    if(distortion === 0 && adulteration === 0) {
        return trump;
    };

    //adulterate the array with random letters
    for (let i = 0; i < adulteration; i++) {
        //the natural flag restricts adulteration to letters from 'trump'
        natural
        ? trumpArray.push(randomLetter(trump))
        : trumpArray.push(randomLetter());
    }

    //shuffle the adulterated array
    let scrambled = shuffle(trumpArray);

    //use Array.map to make a new array
    scrambled = scrambled
    .map(letter => {
        //apply typo if distortion level is high
        letter = randomInt(0, 99) < distortion
            ? typo(letter)
            : letter;

        //capitalize if aggression level is high
        letter = randomInt(0, 99) < aggression
            ? letter.toUpperCase()
            : letter

        return letter;
    });

    //may drop some letters if distortion and aggresion are high
        if(distortion + aggression > 60 && randomInt(0, 125) < distortion) {
            const numberToDrop = scrambled.length > 10
            ? getSeverity() + getSeverity()
            : getSeverity();

            for(let i = 0; i < numberToDrop; i ++) {
                scrambled.splice(randomInt(0, scrambled.length - 1), 1);
            };
        }

    if(repeat) {
        scrambled = scrambled
        .map(letter => {
            if (randomInt(0, 99) < distortion) {
                const repeatTimes = getSeverity();
                for(let i = 1; i < repeatTimes; i++) {
                   letter = letter + letter;
                }
            } return letter;
        });
    };


    if(startWithT) {
        const firstT = scrambled.indexOf('t');
        if(firstT !== -1) {
            const swap = scrambled[0];
            scrambled[firstT] = swap;
        }
        scrambled[0] = 'T'
    };

    if(endWithP) {
        const lastP = scrambled.lastIndexOf('p');
        const lastIndex = scrambled.length - 1;
        if(lastP !== -1) {
            const swap = scrambled[lastIndex];
            scrambled[lastP] = swap;
        };

        //respect aggression
        const p = randomInt(0, 99) < aggression
            ? 'P'
            : 'p';

        scrambled[lastIndex] = p;
    };

            //the force vowels flag adds at least some vowels in the middle ish
        //and has a chance to add a vowel at the end, favoring a, o, and y
        if(forceVowels) {
            const vowels = Array.from('aoyeiu');
            //calculate one third of the array
            const oneThird = Math.floor(scrambled.length / 3);

            //examine the middle third for vowels
            //use array.slice to get the middle third of the array
            const middle = scrambled.slice(oneThird,
                //avoid going past the end of very short arrays
                oneThird + oneThird < scrambled.length
                    ? oneThird + oneThird
                    : scrambled.length -1)

            //count the vowels
            const middleVowels = middle
                .reduce((
                    count,
                    letter
                    ) => {
                        vowels.includes(letter) && count ++;
                        return count;
                    },0);

            const addVowelsToMiddle = (number) => {
                for(let i = 0; i < number; i++){
                    //if natural flag is on, only vowel is 'u'
                    scrambled[oneThird + i] = natural ? 'u' : vowels[randomInt(0, 5)];
                };
            };

            //if the middle third is > 3, indicating a long termp
            //insert more than one vowel
            if(oneThird > 3 && middleVowels < 2) {
                addVowelsToMiddle(getSeverity());
            } else if (!middleVowels) {
                //if there are no vowels in a short array, insert one
                addVowelsToMiddle(1);
            };

            //check distortion to add a vowel to the end
            if (randomInt(0, 99) < distortion) {
            //roll severity, 1 or 2 grab vowels[0-2], on a 3 grab vowels[3-5]
            //ignore natural flag because 'u' doesn't sound as funny at the end
                getSeverity() < 3
                ? scrambled.push(vowels[randomInt(0, 2)])
                : scrambled.push(vowels[randomInt(3, 5)]);
            };
        };
    //can add exclamation points
    if(aggression > 44) {
        //maximum exclamation points
        const maxExclamation = aggression > 84
            ? 3
            : aggression > 59
               ? 2
               : 1

        //the extra for 100
        aggression === 100 && scrambled.push('!');

        //if you are aggressive enough
        if (randomInt(0, 45) > (100 - aggression)) {
            let severity = getSeverity();

            //add exclamation points
            for(let i = 0; i <= severity; i++){
                i < maxExclamation &&
                scrambled.push('!');
            };
        };
    };

    return stringFromArray(scrambled);
};

    //the input for adulteration
    //adulteration controls how many extra characters are added
    const adulterationInput = `<div><label for="adulterationInput">How many added characters? \&nbsp</label><input type="number" id="adulterationInput"/></div>`

    //returns a checkbox input
    const makeCheckbox = (name, display) =>`<div>
    <label for="${name}">${display}</label>
    <input type="checkbox" id="${name}CheckboxInput" name="${name}" ${!!genSettings[name] && "checked"}>
  </div>`

    //the checkboxes for the boolean parameters
    //start with T forces the generated string to start with "t"
   const startWithTCheckbox = makeCheckbox('startWithT', 'Start with "T":');
    //end with p forces the generated string to end with "p"
   const endWithPCheckbox = makeCheckbox('endWithP', 'End with "p":');
    //force vowels forces at least one vowel in the middle, chance to end in a vowel
    const forceVowelsCheckbox = makeCheckbox('forceVowels', 'Force vowels');
    //natural limits adulteration to naturally likely typos
   const naturalCheckbox = makeCheckbox('natural', 'Prefer letters from "trump"');
    //may repeat characters
    const repeatCheckbox = makeCheckbox('repeat', 'Repeat letters');

    //returns a slider input with a label
   const makeSlider = (name) => `<div class="slidecontainer">${name.charAt(0).toUpperCase() + name.slice(1, name.length)}:
  <input type="range" min="0" max="100" value="${genSettings[name]}" class="slider" id="${name}SliderInput">
  <span id="${name}Display">${genSettings[name]}</span>
</div>`

   //the sliders, values 0-100
   //aggression makes capitalization more likely
   const aggressionSlider = makeSlider('aggression');
    //distortion increases the likelihood of typos
   const distortionSlider = makeSlider('distortion');
    //randomness increases aggression, distortion, and adulteration
   const randomnessSlider = makeSlider('randomness');

    //the settings modal, contains the inputs
    //being a modal, it starts out invisible until the user clicks the settings button
const settingsModal = document.createElement('div');
    settingsModal.setAttribute('id', 'trumpSettingsModal');
    settingsModal.setAttribute("class", "trumpSettingsModal")
    settingsModal.innerHTML = `<div class="trumpSettingsModal-content">
     <span class="modalClose" id="modalClose">&#10006;</span>
      <h2>Trump Generator Settings</h1>
        ${startWithTCheckbox}
        ${endWithPCheckbox}
        ${adulterationInput}
        ${forceVowelsCheckbox}
        ${naturalCheckbox}
        ${aggressionSlider}
        ${distortionSlider}
        ${repeatCheckbox}
        ${randomnessSlider}
    </div>`
    //add the settingsModal to the postButtons
   postButtons.appendChild(settingsModal);

const adulterationNumberInput = document.getElementById('adulterationInput');
adulterationNumberInput.addEventListener('change', (event) => {
    const adulteration = event.target.value;
    genSettings.adulteration = adulteration;
    console.log(`changed`, genSettings);
});
    //makes the slider input control the setting and display
const controlSlider = (name) => {
    const thisInput = document.getElementById(`${name}SliderInput`);
// Update the current slider value (each time you drag the slider handle)
 thisInput.oninput = function() {
     const setting = this.value;
     const thisDisplay = document.getElementById(`${name}Display`);
     genSettings[name] = setting;
     thisDisplay.innerHTML = setting;
  };
}

controlSlider('aggression');
controlSlider('distortion');
controlSlider('randomness');

        //makes the checkbox input control the setting
const controlCheckbox = (name) => {
    const checkbox = document.getElementById(`${name}CheckboxInput`);
    checkbox.addEventListener('change', (event) => {
  if (event.target.checked) {
    genSettings[name] = true;
      console.log(`${name} got checked`, genSettings)
  } else {
    genSettings[name] = false;
      console.log(`${name} unchecked`, genSettings)
  }
})
}

controlCheckbox('startWithT');
controlCheckbox('endWithP');
controlCheckbox('forceVowels');
controlCheckbox('natural');
controlCheckbox('repeat');

    //opens the modal
const openModal = () => {
    settingsModal.style.display = 'block';
};

    //closes the modal
const closeModal = () => {
    settingsModal.style.display = 'none';
};

document.getElementById ("settingsButton").addEventListener (
    "click", openModal, false
);
document.getElementById ("modalClose").addEventListener (
    "click", closeModal, false
);

GM_addStyle ( `
    #trumpSettingsModal {
        display: none;
        z-index: 1;
        position: fixed;
        top: 20%;
        left: 40%;
        margin-top: -50px;
        margin-left: -100px;
        width: 40%;
        height: 50%;
        overflow: auto;
        background-color: white;
        border-style: solid;
        padding: 20px;
        padding-top: 0px;
    }
    #trumpSettingsModal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        width: 80%;
    }
    #modalClose {
        color: #aaa;
        float: right;
        font-size: 200%;
        font-weight: bold;
    }
    #modalClose:hover,
    #modalClose:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
` );

const addTrumpToPost = () => {
  var postField = document.querySelector(".fr-element");
const taermp = genTrump(genSettings);
    postField.children[0].innerHTML += ` ${taermp} `;
}

//make the trump button call addTrumpToPost
document.getElementById ("trumpButton").addEventListener (
    "click", addTrumpToPost, false
);

})();