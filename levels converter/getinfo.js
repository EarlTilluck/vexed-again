/* eslint-disable */
/* eslint-env es6 */
/* eslint-disable no-console */

/**
 * Read levelsets.txt and get level information from it.
 * This contains the order each level should be presented in,
 * as well as information about each level.
 */

// aquire node file system
const fs = require('fs');

let levelsinfo = {};
const data = fs.readFileSync('levelsets.txt', 'utf8');

// split file contents by line
const levels = data.split('\r\n');

console.log('processing ' + (levels.length - 1) + ' levels');

// for each line...
let count = 0;
levels.forEach(level => {
  // split into parts if string is not empty
  if (level.length > 0) {
    const parts = level.split(';');
    //set level data
    count++;
    const levelnum = count + '';
    levelsinfo[levelnum] = {};
    levelsinfo[levelnum] = {
      name: parts[0],
      key: '',
      total: parts[1],
      by: parts[2],
      difficulty: parts[3],
      link: parts[4]
    }
  }
}); // end for each line (levels)

console.log(levelsinfo);
