// -----------Global Variables---------------
let shooterBsSkill = 0;
let shooterStr = 0;
let defenderTough = 0;
let defenderSave = 0;
let defenderModelWounds = 0;
let damageEvaluationArray= [];
let numberCasualties = 0;
let numberDiceRolled = 0;
let hitsRollArray = [];
let hitsLanded = 0;
let woundsRollArray = [];
let successfulWounds = [];
let woundsLanded = 0;
let savesRollArray = [];
let savedWounds = 0;
let unsavedWounds = 0;
let damageRollsArray = [];
let additionalWounds = [];
let modelsWounded = 0;
const selectElement = document.querySelector('.damageType');
let damageType = 0;

//-----------Event Listener--------------
document.getElementById("run").addEventListener("click",instaEngagement);
selectElement.addEventListener('change', (event) => {
    if (event.target.value === "1") {
    damageType = "Normal";
    } else if (event.target.value === "2"){
    damageType = "D3";
    } else if (event.target.value === "3"){
    damageType = "D6";
    }
    console.log(damageType);
  });

// -----------------Functions-----------------
const diceRoll = () => Math.floor(Math.random()* (7-1)+1);
const d3 = () => Math.floor(Math.random()* (3-1)+1);

function numberHits(diceRoll,numberDiceRolled) {
    for (i = 0; i < numberDiceRolled; i++) {
        hitsRollArray.push(diceRoll());
    }
    hitsLanded = hitsRollArray.filter(item => item >= shooterBsSkill).length;
    return hitsLanded;
} // returns # of successful hits

function woundsRolls(diceRoll,hitsLanded) {
    for (i = 0; i < hitsLanded; i++) {
        woundsRollArray.push(diceRoll());
}
return woundsRollArray;
} // returns an array of wounds rolls

function numberWounds(woundsRollArray, shooterStr, defenderTough) {
    // If strength is less than toughness but greater than half 
    if (shooterStr < defenderTough && (shooterStr * 2) > defenderTough) {
        for (i = 0; i < woundsRollArray.length; i++) {
         if (woundsRollArray[i] >= 5) {
        successfulWounds.push(i);
            }
        }
    } 
    // if strength is equal to toughness
    else if (shooterStr === defenderTough) {
        for (i = 0; i < woundsRollArray.length; i++) {
            if (woundsRollArray[i] >= 4) {
            successfulWounds.push(i);
            }
        }
    }
    // if strength is greater than toughness but less than double
    else if (shooterStr > defenderTough && shooterStr < (defenderTough * 2)) {
        for (i = 0; i < woundsRollArray.length; i++) {
            if (woundsRollArray[i] >= 3) {
            successfulWounds.push(i);
            }
        }
    }
     // if strength is less than half toughness 
     else if (shooterStr <= (defenderTough / 2)) {
        for (i = 0; i < woundsRollArray.length; i++) {
            if (woundsRollArray[i] >= 6) {
            successfulWounds.push(i);
            }
        }
    }
    // if strength is double toughness 
    else if (shooterStr >= (defenderTough * 2)) {
        for (i = 0; i < woundsRollArray.length; i++) {
            if (woundsRollArray[i] >= 2) {
            successfulWounds.push(i);
            }
        }
    }
woundsLanded = successfulWounds.length;
return woundsLanded;
} // returns # of successful wounds

function numberSaves(diceRoll,defenderSave) {
    for (i = 0; i < woundsLanded; i++) {
        savesRollArray.push(diceRoll())
    }
    let savedRolls = savesRollArray.filter(item => item >= defenderSave);
    savedWounds = savedRolls.length
    unsavedWounds = woundsLanded - savedWounds;
    return unsavedWounds;
} // returns # of unsaved wounds

function damagePerWound(damageType) {
    if (damageType === "D3") {
    for (i = 0; i < unsavedWounds; i++) {
        damageRollsArray.push(d3());
    }
    } else   if (damageType === "D6") {
        for (i = 0; i < unsavedWounds; i++) {
            damageRollsArray.push(diceRoll());
        }
        } else   if (damageType === "Normal") {
            for (i = 0; i < unsavedWounds; i++) {
                damageRollsArray.push(1);
            }
            }
    return damageRollsArray;
} // returns an array of damage results according to damage type

function casualties() {
for (i = 0; i < damageRollsArray.length; i++) {
    if (damageRollsArray[i] >= defenderModelWounds) {
    damageEvaluationArray.push("1 Casualty");
    } 
    else if (damageRollsArray[i] < defenderModelWounds) {
        additionalWounds.push(damageRollsArray[i]);
    }
}
numberCasualties = damageEvaluationArray.length
modelsWounded = additionalWounds.length;
return numberCasualties
} // returns the number of casualties

function instaEngagement() {
    numberDiceRolled = document.getElementById("input6").value;
    shooterBsSkill = document.getElementById("input1").value;
    shooterStr = document.getElementById("input2").value;
    defenderTough = document.getElementById("input3").value;
    defenderSave = document.getElementById("input4").value;
    defenderModelWounds = document.getElementById("input5").value;
    numberHits(diceRoll,numberDiceRolled);
    woundsRolls(diceRoll,hitsLanded);
    numberWounds(woundsRollArray, shooterStr, defenderTough);
    numberSaves(diceRoll,defenderSave);
    damagePerWound(damageType);
    casualties();
    addElement('p','resultsInstance1',`Hit rolls: ${hitsRollArray}.`,'newElementClass1');
    addElement('p','resultsInstance2',`There were ${hitsLanded} successful hits.`,'newElementClass2');
    addElement('p','resultsInstance3',`Wound rolls: ${woundsRollArray}. There were ${woundsLanded} successful wounds.`,'newElementClass3');
    addElement('p','resultsInstance4',`${savedWounds} wounds were saved, leaving ${unsavedWounds} unsaved wounds. Damage results: ${damageRollsArray}.`,'newElementClass4');
    addElement('p','resultsInstance5',`${numberCasualties} models are destroyed. ${modelsWounded} model(s) take ${additionalWounds} additional wound(s) respectively.`,'newElementClass5');
} // master function for the event listener

function addElement (element, idName, content, className) {
    const newElement = document.createElement(element);
    newElement.setAttribute("id",idName)
    newElement.setAttribute("class",className)
    const newContent = document.createTextNode(content);
    newElement.appendChild(newContent);
    const currentDiv = document.getElementById("newDiv");
    document.getElementById("masterContainer").insertBefore(newElement, currentDiv);
  }

 

