# application-installer
Quickly install npm modules and launch them in electron.

## Usage

```JavaScript

const applicationInstaller = require('application-installer');

applicationInstaller({
  emitter, // object must have .emit
  log, // plain function

  application: 'bootstrap-electron',
  open: false,

  location: path.join( paths.cache, 'core' ),
});

```
