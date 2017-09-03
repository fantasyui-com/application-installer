const path = require('path');
const fs = require('fs');
const url = require('url');

const npm = require('npm');
const mkdirp = require('mkdirp');

const process = require('process');

const initializeStorage = function({location}){

  const initData = {
   "name": "core",
   "version": "1.0.0",
   "description": "",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1"
   },
   "keywords": [],
   "author": "",
   "license": "ISC"
 }

 fs.writeFileSync(path.join(location, 'package.json'), JSON.stringify(initData, null, '  '))

}

const installCorePackage = function({location, name}){
  return new Promise(function(resolve, reject) {
    npm.load({
       prefix:location,
       loaded: false,
       global: false,
     }, function(err) {
       npm.commands.install([name], function(er, data) {
         resolve();
       });
       npm.on('log', function(message) {
         // log installation progress
         console.log(message);
       });
     });
   });
}





module.exports = async function(configuration){

 const {location, emitter, open, application, log} = configuration;

 emitter.emit('application-installer-configuration', configuration)

 const progress = {progress:10};

 let progressInterval = setInterval(()=>{
   progress.progress = progress.progress + 1;
   if(progress.progress > 100) progress.progress = 0;
   emitter.emit('application-installer-progress', progress)
 }, 1000)

 log('Creating Core Directories');
 mkdirp.sync(location);
 progress.progress = 10;

 log('Initializing Storage');
 initializeStorage({location});
 progress.progress = 20;

 log('Installing Primary Package');
 await installCorePackage({location, name:application});
 progress.progress = 30;

 if(open){
   log('Opening Primary Package');

   require('electron').remote.getCurrentWindow().loadURL( url.format({
     pathname: path.join(location, 'node_modules', application ,'index.html'),
     protocol: 'file:',
     slashes: true
   }), {cwd: path.join(location, 'node_modules', application)});

   clearInterval(progressInterval);
 }



}
