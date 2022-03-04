/* eslint-disable */
/* eslint-env es6 */
/* eslint-disable no-console */

/**
 * Convert Android format levels to typescript files
 * that are suitable for importing into an
 * ionic/angular app
 *
 * Example of level:
 * Coffee Truffle;XXXa.X/XXXX.X/XXfb.X/e.efab;3
 *
 * Format details:
 * There are three fields separated by ';'
 *  - First is the level name: 'Coffee Truffle'
 *  - Second is the game board details: XXXa.X/XXXX.X/XXfb.X/e.efab
 *    - Each row is seperated by '/'
 *    - '.' represents free space.
 *    - Letters represent a movable block.
 *    - `X` represents an immovable wall.
 *  - Third is the 'par' score: 3 (expected turns to win)
 *
 * Note: There is an extra empty line at end of each file.
 */


// aquire node file system
const fs = require('fs');



// object to output
let levelData = {};


// promise to update the levels data object
const updateLevelData = (packName, levelName, board, par) => {
  if (levelData[packName] === undefined) {
    levelData[packName] = {};
  }
  levelData[packName][levelName] = { board, par };
};


const processLevels = (filename, data) => {

  // split file contents by line
  const levels = data.split('\r\n');

  console.log('processing ' + (levels.length - 1) + ' levels for ' + filename);

  // for each line...
  levels.forEach(level => {
    // split into parts if string is not empty
    if (level.length > 0) {
      const parts = level.split(';');
      // get each part and update level data
      updateLevelData(filename, parts[0], parts[1], parts[2]);
    }
  }); // end for each line (levels)

};



// Start Conversion...
const files = fs.readdirSync('Levels-Android', 'utf-8');

// for each file in directory....
files.forEach(file => {

  // set path to file
  const path = 'Levels-Android/' + file;
  // set filename
  const filename = file.replace('.txt', '');
  // read file...
  const data = fs.readFileSync(path, 'utf8');
  // process each line in file
  processLevels(filename, data);

});

// write data to file, disable linting for file
const header = '/* eslint-env es6 */\r\n/* eslint-disable */\r\nexport default ';
const output = header + JSON.stringify(levelData, null, '\t');
fs.writeFileSync('../src/app/services/levels.ts', output);
