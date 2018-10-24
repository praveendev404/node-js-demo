var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'SqlServerWithNode',
    description: 'Node js demo with sql server database.',
    script: 'D:\\Praveen\\Demos\\NodeJs\\20180621\\NodeWithSql\\Startup\\startup.js'
});

// Listen for the 'install' event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
    console.log('install complete.');
    console.log('The service exists: ', svc.exists);
});

// install the service
svc.install();