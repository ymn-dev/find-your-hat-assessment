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

   step 8 : GAME DONE !! but you need to guarantee a win route otherwise user will be mad!
   we should test the map whether you can win or not first before letting user play it
   step 9 : think about how to solve a maze, you just walk a path that's walkable until you reach a goal
   that's a recursive search! just looking at directions available to our position like tree nodes
   keep going one direction until you can't, then tell the previous call that you cant go anymore so it go other way
   keep doing it until you find a goal or just stuck in the field
   step 9.1 : to do that you need to clone array of the same size as field to mark the location of where you went
   let's name it this._wasHere for now
   step10 : if you stuck in the field with no where to go, it means you don't have a solution to that map
   just generate a new map
   step11 : optimizing move function
   step12 : adding hard mode, where bomb dropping every X steps
   step 12.1 :  we need to take input with mode
   step 12.2 :  we need to keep track of players steps in play
   step 12.3 :  we make a design choice whether to guaranteed a path when generate bomb or not
   step13 : styling the game
   step14 : implementing win streak, win-lose score

*/

// JS Assessment: Find your hat //

const prompt = require("prompt-sync")({ sigint: true }); // This sends a SIGINT, or “signal interrupt” message indicating that a user wants to exit a program by press Crtl+c
const clear = require("clear-screen"); //every turn clear the screen that meant you will not get new field in time you choose the direction
const hat = "📚";
const hole = "💣";
const fieldCharacter = "⬜";
const pathCharacter = "😎";
const pathTaken = "🟨";
const borderCharacter = "⚡";
const holeName = "bomb";
const mapLoseText = "YOU GOT ZAPPED!";
const holeLoseText = "YOU DIED! CAREFUL WITH THE BOMB";
const winText = "YOU FOUND THE LEGENDARY TOME!";
const stepsUntilMoreHole = 3;
let win = 0;
let lose = 0;
let winStreak = 0;
let maxWinStreak = 0;
//setting whether path taken could be bombed or not
const safePathTaken = false;

class Field {
  constructor(row, col) {
    const generator = Field.generateField(row, col);
    this._row = row;
    this._col = col;
    this._field = generator[0];
    // Set the "home" position before the game starts
    this._startLocation = generator[1];
    this._hatLocation = generator[2];
    this._holes = generator[3];
    this._playSpace = row * col - 2 - Math.floor((row * col) / 3); //remove start,goal and bombs
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
    const maxHole = Math.floor((row * col) / 3);
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

    //announcing this just to make recursiveSolve class method
    this._wasHere = Array.from(myField, () => Array(myField[0].length).fill(false));
    //setting value on myField first to use canRecursiveSolve
    this._field = myField;
    this._startLocation = startLocation;
    this._hatLocation = hatLocation;
    this._holes = holes;
    //step 10
    if (!Field.canRecursiveSolve(generateStartRow, generateStartCol)) {
      console.log("Generated field is not solvable. Regenerating...");
      return this.generateField(row, col, mode);
    }

    return [myField, startLocation, hatLocation, holes];
  }
  //step 9
  static canRecursiveSolve(x, y) {
    const endRow = this._hatLocation[0];
    const endCol = this._hatLocation[1]; //set end goal

    if (x === endRow && y === endCol) return true; //if reach goal, it's solvable
    if (this._field[x][y] === hole || this._wasHere[x][y]) return false;
    //if we end up in a hole or go back to where we were, return false
    this._wasHere[x][y] = true; //mark current location as checked

    /*moving up, checking whether you're at the edge or not
        then we call this function again (recursive), it will keep going up until it cant (return false)
        then it will move down to another directions(s) marking wasHere along the way*/
    if (x !== 0 && this.canRecursiveSolve(x - 1, y)) return true; //going up until nothing left
    if (x !== this._field.length - 1 && this.canRecursiveSolve(x + 1, y)) return true; //then going down(not marked)
    if (y !== 0 && this.canRecursiveSolve(x, y - 1)) return true; //then left
    if (y !== this._field[0].length - 1 && this.canRecursiveSolve(x, y + 1)) return true; //then right
    return false;
  }
  //step6
  play(mode = "N") {
    //step 7
    const move = (key) => {
      const directions = {
        W: [-1, 0], // Up
        A: [0, -1], // Left
        S: [1, 0], // Down
        D: [0, 1], // Right
        H: [0, 0], // Stay Still
      };

      if (!(key in directions)) {
        return [false, "Invalid Input"];
      }

      const direction = directions[key];
      let newRow = this._startLocation[0] + direction[0];
      let newCol = this._startLocation[1] + direction[1];

      if (newRow < 0 || newRow >= this._field.length || newCol < 0 || newCol >= this._field[0].length) {
        if (winStreak > maxWinStreak) maxWinStreak = winStreak;
        if (winStreak > 0) winStreak = 0;
        lose++;
        return [false, mapLoseText];
      }

      if (this._field[newRow][newCol] === hole) {
        if (winStreak > maxWinStreak) maxWinStreak = winStreak;
        if (winStreak > 0) winStreak = 0;
        lose++;
        return [false, holeLoseText];
      }

      if (this._field[newRow][newCol] === hat) {
        win++;
        winStreak++;
        if (winStreak > maxWinStreak) maxWinStreak = winStreak;
        return [false, winText];
      }

      this._field[this._startLocation[0]][this._startLocation[1]] = pathTaken; // mark previous location as pathTaken
      if (safePathTaken && this._field[newRow][newCol] === fieldCharacter) this._playSpace--; //only when your path couldnt be bombed
      this._field[newRow][newCol] = pathCharacter; // mark new location as pathCharacter
      this._startLocation = [newRow, newCol]; // update the starting position

      return [true];
    };

    //initializing values for tracking steps for step 12
    let stepCount = 0;
    let successfullyPutAHole = false;
    while (true) {
      this.print();
      console.log("How to play: W A S D to move!! H to stay still");
      if (mode === "H") {
        console.log(`In hard mode, a random ${holeName} will appear every ${stepsUntilMoreHole} steps.`);
      }
      let input = prompt("Which way?: ").toUpperCase(); //make input not case sensitive
      if (input.length === 1 && (input === "W" || input === "A" || input === "S" || input === "D" || input === "H")) {
        let result = move(input);
        if (mode === "H") {
          stepCount++;
          if (stepCount === stepsUntilMoreHole) {
            const row = this._field.length;
            const col = this._field[0].length;
            do {
              const putHoleLocation = [Math.floor(Math.random() * row), Math.floor(Math.random() * col)];
              if (this._field[putHoleLocation[0]][putHoleLocation[1]] === fieldCharacter || (!safePathTaken && this._field[putHoleLocation[0]][putHoleLocation[1]] === pathTaken)) {
                this._field[putHoleLocation[0]][putHoleLocation[1]] = hole;
                successfullyPutAHole = true;
                this._playSpace--;
              }
            } while (!successfullyPutAHole && this._playSpace > 0);
            stepCount = 0;
            successfullyPutAHole = false;
          }
        }
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
    console.log(`WIN ${win} - ${lose} LOSE, WIN STREAK: ${winStreak}/${maxWinStreak} MAX`);
    // your print map code here
    const border = borderCharacter.repeat(this._col + 2);
    console.log(border);
    this._field.forEach((row) => {
      console.log(borderCharacter + row.join("") + borderCharacter);
    });
    console.log(border);
    // console.log(this._playSpace);
  }
}
let previousSettings = null;
let createField;
let height, width, mode;
while (true) {
  if (previousSettings !== null) {
    //saved settings to keep generating the same map
    const continueGame = prompt("CONTINUE? (Y/N): ").toUpperCase(); //ask whether continue playing or not
    if (continueGame !== "Y") {
      console.log(`SCORE: ${win}-${lose} MAX WIN STREAK: ${maxWinStreak} IN ${height}x${width} ${mode === "H" ? "HARD" : "NORMAL"}`);
      break;
    }
  }
  //if no setting
  if (!previousSettings) {
    height = parseInt(prompt("How many rows?: "));
    width = parseInt(prompt("How many columns?: "));
  }
  //if input valid numbers, ask mode next otherwise restart
  if (!isNaN(height) && !isNaN(width)) {
    if (!previousSettings || !previousSettings.mode) {
      do {
        //asking mode
        mode = prompt("Normal or hard mode? (N/H): ").toUpperCase();
        if (mode !== "N" && mode !== "H") {
          console.log("Invalid input, try again");
        }
      } while (mode !== "N" && mode !== "H");
    } else {
      mode = previousSettings.mode;
    }

    createField = new Field(height, width, mode);
    createField.play(mode);
    previousSettings = { height, width, mode }; //can be anything, just a flag
  } else {
    console.log("Invalid Input(s), try again!");
  }
}
