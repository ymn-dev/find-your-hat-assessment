// Please copy and paste your GitHub Repo on line 2 (optional)
// <GitHub Repo> https://github.com/ymn-dev/find-your-hat-assessment

// JavaScript Assessment Rubric: https://generation.instructure.com/courses/2342/assignments/143783

// Codecademy: https://www.codecademy.com/paths/front-end-engineer-career-path/tracks/fecp-javascript-syntax-part-iii/modules/fecp-challenge-project-find-your-hat/projects/find-your-hat

// Please break down your thinking process step-by-step (mandatory)
/* step 1 : generate a field size = row*col, saved the field in Field instance
   step 2 : generating start and goal, they will not be on the same location so 
   input row = 1 col = 1 will be blocked, also blocking invalid stuffs like 0 and minus
   step 3 : print the field out to see if it's properly generated
   step 4 :
   step 5 :
   step 6 :
   step 7 :
   step 8 :
   step 9 :
   step10 :
   step11 :
   step12 :
   step13 :

*/

// JS Assessment: Find your hat //

const prompt = require("prompt-sync")({ sigint: true }); // This sends a SIGINT, or “signal interrupt” message indicating that a user wants to exit a program by press Crtl+c
const clear = require("clear-screen"); //every turn clear the screen that meant you will not get new field in time you choose the direction
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(row, col) {
    const generator = Field.generateField(row, col);
    this._field = generator;
    this._row = row;
    this._col = col;
    // Set the "home" position before the game starts
  }
  static generateField(row, col, mode = "N") {
    if (row < 2 && col < 2) {
      //step 2.2, blocking row 1 col 1 or otherwise 0 and minus
      console.log("Invalid Input");
      return;
    }
    const myField = [];
    for (let i = 0; i < row; i++) {
      myField.push([]);
      for (let j = 0; j < col; j++) {
        myField[i].push(fieldCharacter);
      }
    }
    return myField;
  }

  //print field method to make it eaier
  print() {
    clear();
    // your print map code here
    this._field.forEach((row) => console.log(row.join("")));
  }

  // the rest of your code starts here.
}
let play = new Field(5, 5);
play.print();
