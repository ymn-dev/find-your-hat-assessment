// Please copy and paste your GitHub Repo on line 2 (optional)
// <GitHub Repo> https://github.com/ymn-dev/find-your-hat-assessment

// JavaScript Assessment Rubric: https://generation.instructure.com/courses/2342/assignments/143783

// Codecademy: https://www.codecademy.com/paths/front-end-engineer-career-path/tracks/fecp-javascript-syntax-part-iii/modules/fecp-challenge-project-find-your-hat/projects/find-your-hat

// Please break down your thinking process step-by-step (mandatory)
/* step 1 : generate a field size = row*col, saved the field in Field instance
   step 2 : generating start and goal, they will not be on the same location so 
   input row = 1 col = 1 will be blocked, also blocking invalid stuffs like 0 and minus
   also adding starting and goal location to Field instance
   step 3 : print the field out to see if it's properly generated
   step 4 : adding holes 1/3 of total field size, must not be on start and goal position obviously
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
    this._field = generator[0];
    this._row = row;
    this._col = col;
    this._startLocation = generator[1];
    this._hatLocation = generator[2];
    this._holes = generator[3];
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
    //step 2.1 making start/goal
    const generateStartRow = Math.floor(Math.random() * row);
    const generateStartCol = Math.floor(Math.random() * col);
    const startLocation = [generateStartRow, generateStartCol];
    let generateHatRow;
    let generateHatCol;
    do {
      generateHatRow = Math.floor(Math.random() * row);
      generateHatCol = Math.floor(Math.random() * col);
      //re-random until goal position isn't on top of start
    } while (generateStartRow === generateHatRow && generateStartCol === generateHatCol);
    myField[generateStartRow][generateStartCol] = pathCharacter;
    myField[generateHatRow][generateHatCol] = hat;
    const hatLocation = [generateHatRow, generateHatCol];

    //step 4 generating holes
    const maxHole = Math.floor(row * col) / 3;
    let holeCount = 0;
    const holes = [];
    while (holeCount < maxHole) {
      const putHoleLocation = [Math.floor(Math.random() * row), Math.floor(Math.random() * col)];
      if (myField[putHoleLocation[0]][putHoleLocation[1]] === fieldCharacter) {
        myField[putHoleLocation[0]][putHoleLocation[1]] = hole;
        holes.push(putHoleLocation);
        holeCount++;
      }
    }

    return [myField, startLocation, hatLocation, holes];
  }

  //print field method to make it eaier
  print() {
    //step 3
    clear();
    // console.log(this._startLocation);
    // console.log(this._hatLocation);
    // console.log(this._holes);
    // your print map code here
    this._field.forEach((row) => console.log(row.join("")));
  }

  // the rest of your code starts here.
}
let play = new Field(5, 5);
play.print();
