# Vexed Again
Remake of the classic open source game for the Palm OS.
Made with the Ionic + Angular + Capacitor stack


## Play the game here (web version)
(todo add url when hosted on github)

## Credits
Original game design by The Vexed Team
* http://vexed.sourceforge.net/

## Links 
### Frameworks / Dependencies
* [Angular](https://angular.io/docs)
* [Ionic with Angular](https://ionicframework.com/docs/angular/overview)
* [Ionic UI](https://ionicframework.com/docs/components)
* [Capacitor](https://capacitorjs.com/docs)
* [@capacitor/splash-screen](https://capacitorjs.com/docs/apis/splash-screen)

## Development notes
### Install
Clone repository, then `npm install`
### Updating 
If Angular causes issues when trying to update:  
Run `npx npm-check-updates -u` to force all dependencies to update to their latest version.  
Then run `npm update`  
### Dev Server
Run `ionic serve` or `npm start` to run the web development server.  
Run `npm run start-android` to launch to android phone or emulator with hot reload  
### Andoid Build
Run `ionic capacitor build --prod` 
### IOS Build
Not available until I get a Mac computer and Iphone.
### Deploy to Github Pages
Commit and push all changes in Master first, then...  
Use angular-cli-ghpages to build and deploy to githup pages.  



## todo

* disable gestures and ui while a move is being played out.

* You win shown on screen when last level reached. 
  message dissapears when choose to undo or reset.


* crosshair indicator feedback for where finger is on screen and which block is selected.
  when block is activated, light it up, show crosshair where finger is.
* large swipe = many moves to the left or right until block can't move or falls

* add capacitor splashscreen
* make splashscreen, icon, fav icon
* add help and how to play, about.

* nicer transition for gameboard when load and resized (css);
  
* implement sound and toggle sound button

* Add images and graphics. blocks are a-h abcdefgh which is 8 different blocks.

* change the homepage in description part of package.json.



