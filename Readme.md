# Vexed Again
Remake of the classic open source game for the Palm OS.
Made with the Ionic + Angular + Capacitor stack


## Play the game here (web version)
(todo add url when hosted on github)


## Development notes
### Ionic documentation
[Official Docs](https://ionicframework.com/docs/)
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
### htaccess (for other web host)
Upload build project to hosting platform and configure htaccess to redirect all requests to index.html.  
The htaccess file is located in the `public_html` or `www` folder right next to `index.html`.

## Links 
### Frameworks / Dependencies
* [Angular](https://angular.io/docs)
* [Ionic with Angular](https://ionicframework.com/docs/angular/overview)
* [Ionic UI](https://ionicframework.com/docs/components)
* [Capacitor](https://capacitorjs.com/docs)
* [@capacitor/splash-screen](https://capacitorjs.com/docs/apis/splash-screen)


## todo
* make splashscreen, icon, fav icon
* remove extra tab pages.
* add help and how to play, about.
* nicer transition for gameboard when load and resized (css);
* implement sound and toggle sound button
* add copywrite info from levelsets.txt in levels converter folder
* add some animations to menu
* ~~use service for animations~~
* progress indicators in menu, when selecting level.

* Add images and graphics. blocks are a-h abcdefgh which is 8 different blocks.

* change the homepage in description part of package.json.


next:

* after every move, we should save the state in a stack (just a copy of the block array)
* using stack, have undo functionality
* save state to local storage for later and reload last game, one for each pack
* when game win, move to next level
* delete data option to restart



