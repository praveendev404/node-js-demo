var Service = require('node-windows').Service;

// Create a new service object 
var svc = new Service({
    name: 'NodeWithSql',
    description: 'Node js demo with sql server database.',
    script: 'D:\\Praveen\\Demos\\NodeJs\\20180621\\NodeWithSql\\Startup\\startup.js'
});

// Listen for the "uninstall" event so we know when it's done. 
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

// Uninstall the service. 
svc.uninstall();