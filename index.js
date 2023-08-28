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
   step 5 : adding input prompt to manually select the map size
   step 6 : adding play method, just input taking and testing for now
   step 7 : adding move method to use with play, it should know our current location and where to go
   then update the map accordingly
   step 7.05: if win or lose, the game should end (end game condition)
   step 7.1 : inside any move directions(Up, Down, Left, Right), it should check whether you're still
   in the play field, otherwise you will auto lose
   step 7.2 : inside any move directions, it should check whether the position you're going is end game condition
   if it's not, update map and continue to play
   step 7.3 : FOR ME, debugging array comparision
   console.log([[1, 2], [3], [4, 5]].indexOf([1, 2])); this returns -1
   console.log(JSON.stringify([[1, 2], [3], [4, 5]]).indexOf(JSON.stringify([1, 2]))); this returns 1
   adding converting array to JSON string as helper function inside move()
   step 7.4 : the move method should get call in play method, if reach end game condition then terminate the loop
   print the text otherwise just keep inputting

   TO DO:
   step 8 : GAME DONE !! but you need to guarantee a win route otherwise user will be mad!
   we should test the map whether you can win or not first before letting user play it
   step 9 : think about how to solve a maze, you just walk a path that's walkable until you reach a goal
   that's a recursive function! just looking at directions available to our position like tree nodes
   keep going one direction until you can't, then tell the previous call that you cant go anymore so it go other way
   keep doing it until you find a goal or just stuck in the field
   step 9.1 : to do that you need to clone array of the same size as field to mark the location of where you went
   let's name it wasHere for now
   step10 : if you stuck in the field with no where to go, it means you don't have a solution to that map
   just generate a new map
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
const mapLoseText = "You left the map";
const holeLoseText = "You fell into a hole!";
const winText = "You Win!";

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

  //step6
  play(mode = "N") {
    //step 7
    const move = (key) => {
      let myPosition = this._startLocation;
      const arrayComparision = (arrSource, arrToFind) => {
        const index = arrSource.findIndex((arrSourceItem) => JSON.stringify(arrSourceItem) === JSON.stringify(arrToFind));
        return index;
      };
      if (key === "W") {
        if (myPosition[0] === 0) {
          return [false, mapLoseText]; //checking out of bound up
        } else {
          myPosition[0]--;
          if (arrayComparision(this._holes, myPosition) > -1) {
            return [false, holeLoseText];
          } else if (JSON.stringify(myPosition) === JSON.stringify(this._hatLocation)) {
            return [false, winText];
          } else {
            this._field[myPosition[0]][myPosition[1]] = pathCharacter;
            return [true];
          }
        }
      }
      if (key === "A") {
        if (myPosition[1] === 0) {
          return [false, mapLoseText]; //checking out of bound left
        } else {
          myPosition[1]--;
          if (arrayComparision(this._holes, myPosition) > -1) {
            return [false, holeLoseText];
          } else if (JSON.stringify(myPosition) === JSON.stringify(this._hatLocation)) {
            return [false, winText];
          } else {
            this._field[myPosition[0]][myPosition[1]] = pathCharacter;
            return [true];
          }
        }
      }
      if (key === "S") {
        if (myPosition[0] === this._field.length - 1) {
          return [false, mapLoseText]; //checking out of bound down
        } else {
          myPosition[0]++;
          if (arrayComparision(this._holes, myPosition) > -1) {
            return [false, holeLoseText];
          } else if (JSON.stringify(myPosition) === JSON.stringify(this._hatLocation)) {
            return [false, winText];
          } else {
            this._field[myPosition[0]][myPosition[1]] = pathCharacter;
            return [true];
          }
        }
      }
      if (key === "D") {
        if (myPosition[1] === this._field[0].length - 1) {
          return [false, mapLoseText]; //checking out of bound right
        } else {
          myPosition[1]++;
          if (arrayComparision(this._holes, myPosition) > -1) {
            return [false, holeLoseText];
          } else if (JSON.stringify(myPosition) === JSON.stringify(this._hatLocation)) {
            return [false, winText];
          } else {
            this._field[myPosition[0]][myPosition[1]] = pathCharacter;
            return [true];
          }
        }
      }
    };
    while (true) {
      this.print();
      console.log("How to play: W A S D to move!");
      let input = prompt("Which Way?: ").toUpperCase(); //make input not case sensitive
      if (input.length === 1 && (input === "W" || input === "A" || input === "S" || input === "D")) {
        let result = move(input);
        if (!result[0]) {
          //this checks true/false in return array, false is end game condition reached
          console.log(result[1]); //take message attached to it
          break; //end the game
        }
      } else {
        console.log("Invalid Input");
      }
    }
  }

  //print field method to make it eaier
  print() {
    //step 3
    clear();
    // your print map code here
    this._field.forEach((row) => console.log(row.join("")));
  }

  // the rest of your code starts here.
}
// let play = new Field(5, 5);
// play.play();
//step 5
while (true) {
  let createField;
  const height = parseInt(prompt("How many rows?: "));
  const width = parseInt(prompt("How many columns?: "));
  if (!isNaN(height) && !isNaN(width)) {
    createField = new Field(height, width);
    createField.play();
    break;
  }
}
