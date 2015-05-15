# ProvJS

ProvJS is a small JavaScript utility for indexing and searching PROV-JSON objects within JavaScript objects. It models PROV in JavaScript and outputs PROV-JSON.

* Source code: https://github.com/prov-suite/provjs
* Licence: None though this is planned. Source code is publicly-visible.
* Local tests: /tests/tests.html (run by Jasmine, very basic)

---

## Download and view

    $ git clone https://github.com/prov-suite/provjs
    $ cd provjs

View file:///home/ubuntu/provjs/example.html in Firefox

Click example

OK

Click prov-primer 

OK

Click (submit to ProvStore) 

Needs ProvStore account:

    var api = new $.provStoreApi({username: "username", key: "api_key"});

## Jasmine tests

Follow Dong's GoogleDoc instructions about need for Jasmine and tests in /tests/tests.html.

Jasmine

> Behavior-Driven JavaScript

http://jasmine.github.io/

View file:///home/ubuntu/provjs/tests/tests.html in Firefox

    Passing 6 specs

    Basic QualifiedName
    QualifiedName create
    QualifiedName equals
    QualifiedName equals different prefix
    QualifiedName not equals localpart
    QualifiedName not equals namespace
    QualifiedName not equals same concat path

OK

    $ ls tests/lib/
    jasmine-1.3.0

http://jasmine.github.io/1.3/introduction.html

Try current standalone version:

https://github.com/jasmine/jasmine/releases

    $ curl -L https://github.com/jasmine/jasmine/releases/download/v2.3.2/jasmine-standalone-2.3.2.zip -o jasmine2.3.2.zip 
    $ mkdir jasmine2.3.2/
    $ mv jasmine2.3.2.zip jasmine2.3.2/
    $ cd jasmine2.3.2
    $ unzip jasmine2.3.2.zip

View file:///home/ubuntu/jasmine2.3.2/SpecRunner.html in Firefox 

OK

    $ cp -r jasmine-2.3.2/ provjs/tests/lib/
    $ cp provjs/tests/tests.html provjs/tests/tests-2.3.2.html

Update tests-2.3.2.html:

    <link rel="shortcut icon" type="image/png" href="lib/jasmine-2.3.2/jasmine_favicon.png">
    <link rel="stylesheet" type="text/css" href="lib/jasmine-2.3.2/jasmine.css">
    <script type="text/javascript" src="lib/jasmine-2.3.2/jasmine.js"></script>
    <script type="text/javascript" src="lib/jasmine-2.3.2/jasmine-html.js"></script>

Add:

    <script type="text/javascript" src="lib/jasmine-2.3.2/boot.js"></script>

View file:///home/ubuntu/provjs/tests/tests-2.3.2.html in Firefox

OK

## Command-line execution and Node.js

http://javascript.cs.lmu.edu/notes/commandlinejs/

> Node.js is a very popular platform that is used to build fast, scalable network applications, typically servers. Here we're interested in simply using node for running JavaScript applications outside of the browser.

https://nodejs.org/

https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions

    $ sudo apt-get install -y nodejs
    $ nodejs -v
    v0.10.25

Copy example.html and edit into example.js:

    var prov=require('./prov.js');
    var primer=require('./primer.js');
    function example() {
        var def = prov.setDefaultNamespace("http://default.example.com/");
        var ex = prov.addNamespace("ex", "http://www.example.org/");
        var e1 = prov.entity("ex:e1");
        e1.attr("ex:foo", ex.qn("bar"))
          .attr("ex:baz", ["abc", "xsd:string"])
          .attr("ex:bah", ["1", "xsd:integer"])
          .attr("ex:bam", ["bam", undefined, "en"])
          .attr(ex.qn("bam"), prov.literal("bam", undefined, "en"));
        console.log(e1);
    
        var d_e1 = prov.entity("d_e1");
    
        var e2 = prov.entity("ex:e2")
            .attr("ex:dat", new Date(Date.now()))
            .attr("ex:int", 1)
            .attr("ex:nint", -1)
            .attr("ex:flt", 1.02)
            .attr("ex:str", "def")
            .attr("ex:bool", true);
        console.log(e2);
        
        var der1 = prov.wasDerivedFrom("ex:e2", "ex:e1")
            .attr("prov:type", ["prov:Revision", "xsd:QName"])
            .id(ex.qn('d1'));
        var der1 = prov.wasDerivedFrom("ex:e2", "ex:e1");
        der1.attr(prov.ns.qn("type"), prov.ns.qn("Revision"));
        der1.id(ex.qn('d1'));
        //der1.activity = ex.qn('a1');
        der1.attr(prov.ns.qn("type"), prov.ns.qn("Revision"));
        console.log(der1);
        
        var der2 = prov.wasDerivedFrom("ex:e2", "ex:e1", ["prov:type", prov.ns.qn("Revision")]);
        console.log(der2);
    
        var bundle = prov.bundle("ex:bundle");
        bundle.entity("ex:e2").attr("prov:type", ["prov:Revision", "xsd:QName"]);
        var bundle2 = prov.bundle("ex:bundle2");
        console.log(bundle);
    
        // var doc = prov.document().document();
        // doc.entity("ex:foo");
        // console.console.log(doc);
        prov.wasDerivedFrom("ex:e2", "ex:e1").generatedEntity("ex:e4");
    };
    
    example();

Run:

    $ nodejs example.js

OK

## jasmine-py

https://github.com/jasmine/jasmine-py

> The Jasmine Python package contains helper code for developing Jasmine projects for Python-based web projects (Django, Flask, etc.) or for JavaScript projects where Python is a welcome partner. It serves up a project's Jasmine suite in a browser so you can focus on your code instead of manually editing script tags in the Jasmine runner HTML file.

May be useful for future.

## Grunt

Google. Grunt keeps popping up. Jasmine GitHub uses Grunt which uses NodeJS.

GruntJS

http://gruntjs.com/

> The JavaScript Task Runner

Travis CI provides NodeJS:

http://docs.travis-ci.com/user/languages/javascript-with-nodejs/

> node 0.10.x stable
>
> npm installed by default

"Travis CI use npm, which is also bundled with Node starting with 0.6.0 release."

Following https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server

    $ sudo apt-get -y install nodejs
    $ nodejs -v
    v0.10.25

> Because of a conflict with another package, the executable from the Ubuntu repositories is called nodejs instead of node. Keep this in mind as you are running software.

From Google:

    $ sudo ln -s /usr/bin/nodejs /usr/bin/node

Remember 'ln target link'

    $ npm -v
    The program 'npm' is currently not installed. 
    $ sudo apt-get -y install npm
    $ npm -v
    1.3.10

http://gruntjs.com/getting-started

Page recommends -g which is global but will use local.

    $ cd 
    $ npm install grunt-cli

Used local install so set PATH:

    $ export PATH=~/node_modules/.bin:$PATH
    $ grunt -V
    grunt-cli v0.1.13
    
    $ cd provjs

Following their example, create package.json:
    
    {
      "name": "my-project-name",
      "version": "0.1.0",
      "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-contrib-jshint": "~0.10.0",
        "grunt-contrib-nodeunit": "~0.4.1",
        "grunt-contrib-uglify": "~0.5.0"
      }
    }
    
Run:

    $ npm install grunt --save-dev

This would insert the grunt line into package.json if not present.

These are put into new node_modules directory in provjs

Install the dependencies:

    $ npm install grunt-contrib-jshint --save-dev
    $ npm install grunt-contrib-nodeunit --save-dev
    $ npm install grunt-contrib-uglify --save-dev
    $ cat package.json
    {
      "name": "my-project-name",
      "version": "0.1.0",
      "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-contrib-jshint": "~0.11.2",
        "grunt-contrib-nodeunit": "~0.4.1",
        "grunt-contrib-uglify": "~0.9.1"
      }
    }

Create Gruntfile.js:

    module.exports = function(grunt) {
    
      // Project configuration.
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          build: {
            src: 'src/<%= pkg.name %>.js',
            dest: 'build/<%= pkg.name %>.min.js'
          }
        }
      });
    
      // Load the plugin that provides the "uglify" task.
      grunt.loadNpmTasks('grunt-contrib-uglify');
    
      // Default task(s).
      grunt.registerTask('default', ['uglify']);
    
    };
    
Run:

    $ grunt
    Running "uglify:build" (uglify) task
    >> Destination build/my-project-name.min.js not written because src files were empty.
    >> No files created.
    
    Done, without errors.

## Grunt and Jasmine

http://floatleft.com/notebook/testing-your-javascript-with-jasmine-and-grunt/

> To get up and running we need to install Grunt, Phantomjs and the Grunt Jasmine runner task from the command line

https://github.com/jasmine-contrib/grunt-jasmine-runner

> THIS TASK IS NO LONGER SUPPORTED
>
> This task does not work with the current stable grunt (0.4.0) and has been replaced by grunt-contrib-jasmine

https://github.com/gruntjs/grunt-contrib-jasmine

http://blog.crisp.se/2013/03/31/danielsundman/test-driving-javascript-its-never-been-easier

    $ npm install grunt-contrib-jasmine --save-dev
    $ cat package.json
    ...
        "grunt-contrib-jasmine": "~0.8.2"
    ...

Create Gruntfile.jasmine.js:

    module.exports = function(grunt) {
       'use strict';
        // Project configuration.
        grunt.initConfig({
            jasmine : {
                src : 'src/**/*.js',
                options : {
                    specs : 'specs/**/*.js'
                }
            }
        });
        grunt.loadNpmTasks('grunt-contrib-jasmine');
    };
    
Run:

    $ grunt --gruntfile Gruntfile.jasmine.js jasmine
    Running "jasmine:src" (jasmine) task
    Testing jasmine specs via PhantomJS
    
    Warning: No specs executed, is there a configuration error? Use --force to continue.
    
    Aborted due to warnings.

Update Gruntfile.jasmine.js:

    specs : 'tests/spec/**/*.js'

Run:

    $ grunt --gruntfile Gruntfile.jasmine.js jasmine
    Running "jasmine:src" (jasmine) task
    Testing jasmine specs via PhantomJS
    
     Basic QualifiedName
       X QualifiedName create
         ReferenceError: Can't find variable: prov in file:///home/ubuntu/provjs/tests/spec/basic01.js (line 5) (1)
       X QualifiedName equals
         ReferenceError: Can't find variable: prov in file:///home/ubuntu/provjs/tests/spec/basic01.js (line 13) (1)
       X QualifiedName equals different prefix
         ReferenceError: Can't find variable: prov in file:///home/ubuntu/provjs/tests/spec/basic01.js (line 19) (1)
       X QualifiedName not equals localpart
         ReferenceError: Can't find variable: prov in file:///home/ubuntu/provjs/tests/spec/basic01.js (line 24) (1)
       X QualifiedName not equals namespace
         ReferenceError: Can't find variable: prov in file:///home/ubuntu/provjs/tests/spec/basic01.js (line 29) (1)
       X QualifiedName not equals same concat path
         ReferenceError: Can't find variable: prov in file:///home/ubuntu/provjs/tests/spec/basic01.js (line 34) (1)
    
    6 specs in 0.075s.
    >> 6 failures
    Warning: Task "jasmine:src" failed. Use --force to continue.
    
    Aborted due to warnings.

Update Gruntfile.jasmine.js:
            
    src : '*.js',

Run:

    $ grunt --gruntfile Gruntfile.jasmine.js jasmine
    Running "jasmine:src" (jasmine) task
    Testing jasmine specs via PhantomJS
    
    >> ReferenceError: Can't find variable: module at
    >> Gruntfile.jasmine.js:1 
    >> ReferenceError: Can't find variable: module at
    >> Gruntfile.js:1 
    >> ReferenceError: Can't find variable: jQuery at
    >> api.js:102 
    >> ReferenceError: Can't find variable: require at
    >> example.js:1 
    >> ReferenceError: Can't find variable: require at
    >> primer-node.js:11 
    >> ReferenceError: Can't find variable: require at
    >> provstore.js:13 
    >> provstore.js:128 
     Basic QualifiedName
       ? QualifiedName create
       ? QualifiedName equals
       ? QualifiedName equals different prefix
       ? QualifiedName not equals localpart
       ? QualifiedName not equals namespace
       ? QualifiedName not equals same concat path
    
    6 specs in 0.017s.
    >> 0 failures
    
    Done, without errors.

src can be a list e.g.

    src:['a.js','b.js']

so specify only what needs to be imported. tests/tests.html only imports prov.js.

Update Gruntfile.jasmine.js:

    src : 'prov.js',

Run:

    $ grunt --gruntfile Gruntfile.jasmine.js jasmine
    Running "jasmine:src" (jasmine) task
    Testing jasmine specs via PhantomJS
    
     Basic QualifiedName
       ? QualifiedName create
       ? QualifiedName equals
       ? QualifiedName equals different prefix
       ? QualifiedName not equals localpart
       ? QualifiedName not equals namespace
       ? QualifiedName not equals same concat path
    
    6 specs in 0.025s.
    >> 0 failures
    
    Done, without errors.
    
Try moving out local Jasmine:

    $ mv tests/lib zlib
    $ grunt --gruntfile Gruntfile.jasmine.js jasmine
    ...as above...
    $ mv zlib tests/lib

Grunt's Jasmine version:
    
    $ cat node_modules/grunt-contrib-jasmine/README.md 
    ...
    #### options.version
    Type: `String`  
    Default: '2.0.1'

    This is the jasmine-version which will be used. currently available versions are:

    * 2.0.1
    * 2.0.0

http://blog.crisp.se/2013/03/31/danielsundman/test-driving-javascript-its-never-been-easier

> PhantomJS is not installed properly when grunt-contrib-jasmine was installed. This is apparently a downstream problem related to the grunt-lib-phantomjs and/or phantomjs packages. Workaround: Explicitly install phantomjs locally.
> grunt install phantomjs --save-dev

That should be:

    $ npm install phantomjs --save-dev
    $ grunt jasmine --gruntfile Gruntfile.jasmine.js 
    Running "jasmine:src" (jasmine) task
    Testing jasmine specs via PhantomJS
    
     Basic QualifiedName
       ? QualifiedName create
       ? QualifiedName equals
       ? QualifiedName equals different prefix
       ? QualifiedName not equals localpart
       ? QualifiedName not equals namespace
       ? QualifiedName not equals same concat path
    
    6 specs in 0.008s.
    >> 0 failures
    
    Done, without errors.

## Jasmine without Grunt

http://jasmine.github.io/2.0/node.html

> The Jasmine node package contains helper code for developing and running Jasmine tests for node-based projects.

https://github.com/jasmine/jasmine-npm

    $ npm install jasmine --save-dev
    $ cd provjs/tests
    $ jasmine init
    $ ls spec/support/
    jasmine.json
    $ cat spec/support/jasmine.json
    {
      "spec_dir": "spec",
      "spec_files": [
        "**/*[sS]pec.js"
      ],
      "helpers": [
        "helpers/**/*.js"
      ]
    }
    $ jasmine
    Started
    
    No specs found
    
    $ ls spec/
    basic01.js  support
    
Update spec/support/jasmine.json:

    "spec_files": [
      "basic01.js"
    ],

Run:
    
    $ jasmine
    Started
    FFFFFF
    
    Failures:
    1) Basic QualifiedName QualifiedName create
      Message:
        ReferenceError: prov is not defined
      Stack:
        ReferenceError: prov is not defined
            at Object.<anonymous> (/home/ubuntu/provjs/tests/spec/basic01.js:5:20)
    
    2) Basic QualifiedName QualifiedName equals
      Message:
        ReferenceError: prov is not defined
      Stack:
        ReferenceError: prov is not defined
            at Object.<anonymous> (/home/ubuntu/provjs/tests/spec/basic01.js:13:20)
    
    3) Basic QualifiedName QualifiedName equals different prefix
      Message:
        ReferenceError: prov is not defined
      Stack:
        ReferenceError: prov is not defined
            at Object.<anonymous> (/home/ubuntu/provjs/tests/spec/basic01.js:19:20)
    
    4) Basic QualifiedName QualifiedName not equals localpart
      Message:
        ReferenceError: prov is not defined
      Stack:
        ReferenceError: prov is not defined
            at Object.<anonymous> (/home/ubuntu/provjs/tests/spec/basic01.js:24:20)
    
    5) Basic QualifiedName QualifiedName not equals namespace
      Message:
        ReferenceError: prov is not defined
      Stack:
        ReferenceError: prov is not defined
            at Object.<anonymous> (/home/ubuntu/provjs/tests/spec/basic01.js:29:20)
    
    6) Basic QualifiedName QualifiedName not equals same concat path
      Message:
        ReferenceError: prov is not defined
      Stack:
        ReferenceError: prov is not defined
            at Object.<anonymous> (/home/ubuntu/provjs/tests/spec/basic01.js:34:20)
    
    6 specs, 6 failures
    Finished in 0.019 seconds

Update tests/spec/basic01.js, add as first line:

    var prov = require('../../prov.js');
    
Run:
    
    $ jasmine
    Started
    ......
    
    
    6 specs, 0 failures
    Finished in 0.003 seconds
    
    $ cd ..
    $ export JASMINE_CONFIG_PATH=~/provjs/tests/spec/support/jasmine.json
    $ jasmine
    Started
    
    
    No specs found
    Finished in 0 seconds

Update jasmine.json: 
    
    "spec_dir": "tests/spec",

Run:

    $ jasmine
    Started
    ......
    
    6 specs, 0 failures
    Finished in 0.003 seconds

Note that 'grunt jasmine' and 'tests.html' fail if tests/spec/basic01.js has:

    var prov = require('../../prov.js');

## Grunt and Travis CI

These could be useful:

* http://www.mattgoldspink.co.uk/2013/02/10/using-travis-ci-with-grunt-0-4-x/
* http://stackoverflow.com/questions/21128478/run-grunt-build-command-on-travis-ci

## What is a headless browser?

http://en.wikipedia.org/wiki/Headless_browser

> A headless browser is a web browser without a graphical user interface.

## Karma

http://karma-runner.github.io/0.12/index.html

    $ cd provjs
    $ npm install karma --save-dev
    $ npm install karma-jasmine karma-chrome-launcher --save-dev
    $ cd
    $ npm install karma-cli
    $ karma --version
    Karma version: 0.12.31
    $ npm install karma-firefox-launcher --save-dev
    $ karma init
    Which testing framework do you want to use ?
    Press tab to list possible options. Enter to move to the next question.
    > jasmine
    
    Do you want to use Require.js ?
    This will add Require.js plugin.
    Press tab to list possible options. Enter to move to the next question.
    > no
    
    Do you want to capture any browsers automatically ?
    Press tab to list possible options. Enter empty string to move to the next question.
    > Firefox
    > 
    
    What is the location of your source and test files ?
    You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
    Enter empty string to move to the next question.
    > prov.js
    > tests/spec/**/*.js
    > 
    
    Should any of the files included by the previous patterns be excluded ?
    You can use glob patterns, eg. "**/*.swp".
    Enter empty string to move to the next question.
    > 
    
    Do you want Karma to watch all the files and run the tests on change ?
    Press tab to list possible options.
    > yes
    
    $ cat karma.conf.js 
    // Karma configuration
    // Generated on Thu May 14 2015 08:17:49 GMT-0700 (PDT)
    
    module.exports = function(config) {
      config.set({
    
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
    
    
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],
    
    
        // list of files / patterns to load in the browser
        files: [
          'prov.js',
          'tests/spec/**/*.js'
        ],
    
    
        // list of files to exclude
        exclude: [
        ],
    
    
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },
    
    
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
    
    
        // web server port
        port: 9876,
    
    
        // enable / disable colors in the output (reporters and logs)
        colors: true,
    
    
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
    
    
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
    
    
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox'],
    
    
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
      });
    };
    
    $ npm install karma-jasmine-html-reporter --save-dev

Update karma.conf.js:

    reporters: ['progress','html'],
    
Run:

    $ karma start

Browser kicks up with http://localhost:9876

Click Debug to see http://localhost:9876/debug.html

See Jasmine test results

Travis CI and Karma:

http://karma-runner.github.io/0.8/plus/Travis-CI.html

https://github.com/karma-runner/karma-coverage

    $ npm install karma-coverage --save-dev

Update karma.conf.js:

    preprocessors: {
        'prov.js': ['coverage']
    },

    reporters: ['progress','html','coverage'],

    coverageReporter: {
      type : 'html',
      dir : './coverage/'
    },

Browse to: file:///home/ubuntu/provjs/coverage/Firefox%2035.0.0%20%28Ubuntu%29/index.html

Karma and Travis:

http://karma-runner.github.io/0.8/plus/Travis-CI.html
