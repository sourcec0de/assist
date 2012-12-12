#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander'),
    connect = require("connect"),
    sys     = require('sys'),
    exec    = require('child_process').exec,
    fs      = require("fs"),
    serverPort = 8080,
    liveReloadPort = 9000;
 

 program
   .version('0.0.1')
   // .option('-C, --chdir <path>', 'change the working directory')
   // .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
   .option('-T, --no-tests', 'ignore test hook')

 program
  .command('new <cmd>')
  .description('Creates new project')
  .action(function(cmd) {
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec("git clone git://github.com/skyteclabs/Base-Bootstrap.git " + cmd, puts);
  });

 program
  .command('server')
  .description('Initiates a web server')
  .action(function() {
    var files = fs.readdirSync(__dirname),
        options = [],
        choice = '';

    for (var i = files.length - 1; i >= 0; i--) {

      if (files[i].indexOf( "." ) == -1 && files[i] != 'node_modules') {
        // console.log("Folder: " + files[i])
        options.push(files[i])
      };

    };


    if (options.length == 1) {
      choice = "/" + options[0];
      var serverRoot = __dirname + choice;
        console.log("Server is Active")
        console.log("Port: " + serverPort)
        console.log("URL: http://localhost:" + serverPort)
        console.log("Press 'CTRL + C' to exit server")
        exec('start live-reload.sh ' + liveReloadPort);
      var app = connect()
        .use(connect.logger('dev'))
        .use(connect.static(serverRoot))
        .listen(serverPort);
    }else if (options.length >= 2) {
      console.log('What project do you want a server for?');
      program.choose(options, function(i){
        console.log('Starting Server for %d "%s"', i+1, options[i]);
        console.log();
        choice = "/" + options[i];
        process.stdin.destroy();

        var serverRoot = __dirname + choice;
        console.log("Server is Active")
        console.log("Port: " + serverPort)
        console.log("URL: http://localhost:" + serverPort)
        console.log("Press 'CTRL + C' to exit server")
        exec('start live-reload.sh ' + liveReloadPort);
        var app = connect()
        .use(connect.logger('dev'))
        .use(connect.static(serverRoot))
        .listen(serverPort);

      });
    }else{
      console.log('You have no projects... Try running bs new <cmd>')
    }


  });

 program
   .command('start')
   .description('reloads browser when changes occur')
   .action(function(){
      exec('start test.sh');
   });


 // program
 //   .command('*')
 //   .description('deploy the given env')
 //   .action(function(env){
 //     console.log('deploying "%s"', env);
 //   });


 program.parse(process.argv);


