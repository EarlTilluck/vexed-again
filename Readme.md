# Vexed Again
Remake of the classic open source game for the Palm OS.
Made with the Ionic + Angular + Capacitor stack


## Play 
Play the Web version here: [Vexed Again](https://www.todoAddURL)

## Credits
Original game design by The Vexed Team
* http://vexed.sourceforge.net/
Free sound effects from Mixkit.co
* https://mixkit.co/free-sound-effects/

## Links 
### Frameworks / Dependencies
* [Angular](https://angular.io/docs)
* [Ionic with Angular](https://ionicframework.com/docs/angular/overview)
* [Ionic UI](https://ionicframework.com/docs/components)
* [Capacitor](https://capacitorjs.com/docs)

## Development notes
### Install
Clone repository, then `npm install`
### Updating 
If Angular causes issues when trying to update:  
Run `npx npm-check-updates -u` to force all dependencies to update to their latest version.  
Then run `npm update`  
### Dev Server
Run `ionic serve` for web only with hot reload.  
Run `ionic cap run android -l --host=0.0.0.0` for web and android with hot reload  
### Andoid Build
Run `ionic capacitor build --prod` 
### IOS Build
Not available until I get a Mac computer and Iphone.
### Deploy to Github Pages
Commit and push all changes in Master first, then...  
Use angular-cli-ghpages to build and deploy to githup pages.  


## todo

* implement clear board and clear gamepack sound
* sound volume modal (how does it work with android volume button and windows volume button)

* You win shown on screen when last level reached. 
  message dissapears when choose to undo or reset.

* add help and how to play, about.

* nicer transition for gameboard when load and resized (css);

* thourogh test for jank and glitches.

* change the homepage in description part of package.json.
* add github pages url to top of readme under play section


