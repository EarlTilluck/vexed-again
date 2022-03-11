# Vexed Again
Remake of the classic open source game for the Palm OS.
Made with the Ionic + Angular + Capacitor stack


## Play 
Play the Web version here: [Vexed Again](https://www.todoAddURL)  

## How to Play?
Click/Tap menu button, then choose 'How To Play'

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
* add github pages url to top of readme under play section after deploying to github pages

