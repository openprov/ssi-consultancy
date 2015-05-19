# ProvJS Developer's Guide

This page describes how to set up a development enviroment for ProvJS and other useful information for developers.

---

## Operating systems

The instructions have been written with reference to the 64-bit [Ubuntu](http://www.ubuntu.com/) 14.04.1 operating system.

Other operating systems, or versions of these, may differ in how packages are installed, the versions of these packages available from package managers etc. Consult the relevant documentation for your operating system and the products concerned.

Some prerequisites require you to have sudo access to install and configure software (or a local system administrator can do this for you):

    $ sudo su -

---

## Set up development environment

### Install Git

[Git](http://git-scm.com/) is a popular distributed version control system. It can be used to get the ProvJS source code repository.

Install:

    $ sudo apt-get -y install git
    $ git --version
    git version 1.9.1

### Install cURL

[cURL](http://curl.haxx.se/) is a very useful command line tool and library for interacting over HTTP(S).

Install:

    $ sudo apt-get install curl
    $ curl --version
    curl 7.35.0 (x86_64-pc-linux-gnu) libcurl/7.35.0 OpenSSL/1.0.1f zlib/1.2.8 libidn/1.28 librtmp/2.3

### Install Node.js

[Node.js](https://nodejs.org) is a platform that is used to build fast, scalable network applications, and can run JavaScript from outside of a browser.

Install:

    $ sudo apt-get -y install nodejs
    $ nodejs -v
    v0.10.25

Create a symbolic link as third-party packages expect nodejs to be called node:

    $ sudo ln -s /usr/bin/nodejs /usr/bin/node
    $ node -v
    v0.10.25

### Install npm

[npm](https://www.npmjs.com/) is the Node.js package manager.

Install:

    $ sudo apt-get -y install npm
    $ npm -v
    1.3.10

### Install Grunt command-line interface

[GruntJS](http://gruntjs.com/) is a JavaScript task runner can run Jasmine tests:

    $ npm install grunt-cli

Grunt itself and other packages will be installed shortly.

### Install Karma command-line interface

[Karma](http://karma-runner.github.io/) is a JavaScript test runner. It can run tests using actual browsers and there are a number of test report plugins, and a test coverage plugin. 

    $ npm install karma-cli

Karma itself and other packages will be installed shortly.

### Set path to npm executables

npm installs packages within a local node_modules directory:

    $ ls ~
    ... node_modules ...

Within this directory is a .bin directory where executables are stored. Edit ~/.bash_profile and add the line:

    export PATH=~/node_modules/.bin:$PATH

Update environment:

    $ source ~/bash_profile

### Get ProvJS source code

Source code is hosted on [GitHub](https://github.com/prov-suite/provjs).

Get source code:

    $ git clone https://github.com/prov-suite/provjs
    $ cd provjs

---

## View Jasmine test results

ProvJS comes with tests written in the [Jasmine](http://jasmine.github.io/) test framework. The version bundled is 1.3.0 (see tests/lib/jasmine-1.3.0/). To view the test results, open the file tests/tests.html in a web browser e.g. using Firefox:

    $ firefox file:///home/ubuntu/provjs/tests/tests.html in Firefox

---

## Upgrade Jasmine version

Update the Jasmine version from the 1.3.0 version that is currently bundled with ProvJS.

Download desired Jasmine version. For example:

    $ mkdir tmp
    $ cd tmp
    $ curl -L https://github.com/jasmine/jasmine/releases/download/v2.3.2/jasmine-standalone-2.3.2.zip -o jasmine2.3.2.zip 
    $ unzip jasmine2.3.2.zip
    $ cd ..

Copy Jasmine into tests/lib:

    $ cp -r tmp/lib/jasmine-2.3.2/ tests/lib
    $ cd tests/

Update tests.html and change the lines:

    <link rel="shortcut icon" type="image/png" href="lib/jasmine-1.3.0/jasmine_favicon.png">
    <link rel="stylesheet" type="text/css" href="lib/jasmine-1.3.0/jasmine.css">
    <script type="text/javascript" src="lib/jasmine-1.3.0/jasmine.js"></script>
    <script type="text/javascript" src="lib/jasmine-1.3.0/jasmine-html.js"></script>

to:

    <link rel="shortcut icon" type="image/png" href="lib/jasmine-2.3.2/jasmine_favicon.png">
    <link rel="stylesheet" type="text/css" href="lib/jasmine-2.3.2/jasmine.css">
    <script type="text/javascript" src="lib/jasmine-2.3.2/jasmine.js"></script>
    <script type="text/javascript" src="lib/jasmine-2.3.2/jasmine-html.js"></script>

Add the line:

    <script type="text/javascript" src="lib/jasmine-2.3.2/boot.js"></script>

---

## Configure Grunt to run Jasmine tests

Grunt can be installed and configured to run Jasmine tests, without the need for a browser.

### Install Grunt packages

Create package.json:

    {
        "name": "ProvJS",
        "version": "0.0.1",
        "devDependencies": {}
    }

Install [grunt](http://gruntjs.com/) package:

    $ npm install grunt --save-dev
    $ grunt -V
    grunt-cli v0.1.13
    grunt v0.4.5

Install [grunt-contrib-jasmine](https://github.com/gruntjs/grunt-contrib-jasmine) package to run Jasmine via Grunt:

    $ npm install grunt-contrib-jasmine --save-dev

grunt-contrib-jasmine comes with its own version of Jasmine and will not use the one bundled with ProvJS in tests/lib:

    $ cat node_modules/grunt-contrib-jasmine/README.md 
    ...
    #### options.version
    Type: `String`  
    Default: '2.0.1'

    This is the jasmine-version which will be used. currently available versions are:

    * 2.0.1
    * 2.0.0

--save-dev instructs npm to update package.json with these dependencies:

    $ cat package.json 
    {
      "name": "ProvJS",
      "version": "0.0.1",
      "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-contrib-jasmine": "~0.8.2"
      }
    }

### Create Grunt configuration

Create Gruntfile.js:

    module.exports = function(grunt) {
       'use strict';
        // Project configuration.
        grunt.initConfig({
            jasmine : {
                src : 'prov.js',
                options : {
                    specs : 'tests/spec/**/*.js'
                }
            }
        });
        grunt.loadNpmTasks('grunt-contrib-jasmine');
    };

### Run Grunt

Run:

    $ grunt  jasmine
    Running "jasmine:src" (jasmine) task
    Testing jasmine specs via PhantomJS

     Basic QualifiedName
         QualifiedName create
         QualifiedName equals
         QualifiedName equals different prefix
         QualifiedName not equals localpart
         QualifiedName not equals namespace
         QualifiedName not equals same concat path

    6 specs in 0.57s.
    >> 0 failures

    Done, without errors.

---

## Configure Karma to run Jasmine tests

Karma can be installed and configured to run Jasmine tests across multiple browsers. It also supports code coverage reports.

### Install Karma packages

Install [Karma](http://karma-runner.github.io/) package:

    $ npm install karma --save-dev
    $ karma --version
    Karma version: 0.12.31

Install [karma-jasmine](https://github.com/karma-runner/karma-jasmine) to run Jasmine via Karma:

    $ npm install karma-jasmine 

Install [karma-coverage](https://github.com/karma-runner/karma-coverage) to generate code coverage reports: 

    $ npm install karma-coverage --save-dev

Install [karma-jasmine-html-reporter](https://github.com/taras42/karma-jasmine-html-reporter) to create HTML reports for Jasmine tests:

    $ npm install karma-jasmine-html-reporter --save-dev

Install [karma-firefox-launcher](https://github.com/karma-runner/karma-firefox-launcher) to launch Firefox to run tests against:

    $ npm install karma-firefox-launcher --save-dev

--save-dev instructs npm to update package.json with these dependencies:

    $ cat package.json 
    {
      "name": "ProvJS",
      "version": "0.0.1",
      "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-contrib-jasmine": "~0.8.2",
        "karma-jasmine-html-reporter": "~0.1.8",
        "karma-coverage": "~0.3.1",
        "karma-firefox-launcher": "~0.1.6"
        "karma": "~0.12.31"
      }
    }

### Create Karma configuration

Create karma.conf.js:

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
            'prov.js': ['coverage']
        },
    
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress','html','coverage'],
    
        coverageReporter: {
          type : 'html',
          dir : './coverage/'
        },
    
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

### Run Karma

Run:

    $ karma start

Firefox will start, showing a page at http://localhost:9876.

Click Debug to see the Jasmine test results. 

A coverage/ directory will be created with coverage information in HTML. This will be in a sub-directory named after the browser-operating system. For example:

    $ ls coverage/
    Firefox 35.0.0 (Ubuntu)

To view the coverage report, open the file index.html file within this sub-directory in a web browser e.g. using Firefox:

    $ firefox file:///home/ubuntu/provjs/coverage/Firefox\ 35.0.0\ \(Ubuntu\)/index.html

Changes to the JavaScript cause the the tests to be rerun and the reports updated.

---

## Execute JavaScript via Node.js

Node.js can run JavaScript from the command-line

Create example.js:

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
        console.log("-----ENTITY 1-----");
        console.log(e1);
    
        var d_e1 = prov.entity("d_e1");
    
        var e2 = prov.entity("ex:e2")
            .attr("ex:dat", new Date(Date.now()))
            .attr("ex:int", 1)
            .attr("ex:nint", -1)
            .attr("ex:flt", 1.02)
            .attr("ex:str", "def")
            .attr("ex:bool", true);
        console.log("-----ENTITY 2-----");
        console.log(e2);
        
        var der1 = prov.wasDerivedFrom("ex:e2", "ex:e1")
            .attr("prov:type", ["prov:Revision", "xsd:QName"])
            .id(ex.qn('d1'));
        var der1 = prov.wasDerivedFrom("ex:e2", "ex:e1");
        der1.attr(prov.ns.qn("type"), prov.ns.qn("Revision"));
        der1.id(ex.qn('d1'));
        der1.attr(prov.ns.qn("type"), prov.ns.qn("Revision"));
        console.log("-----DERIVED 1-----");
        console.log(der1);
        
        var der2 = prov.wasDerivedFrom("ex:e2", "ex:e1", ["prov:type", prov.ns.qn("Revision")]);
        console.log("-----DERIVED 2-----");
        console.log(der2);
    
        var bundle = prov.bundle("ex:bundle");
        bundle.entity("ex:e2").attr("prov:type", ["prov:Revision", "xsd:QName"]);
        var bundle2 = prov.bundle("ex:bundle2");
        console.log("-----BUNDLE-----");
        console.log(bundle);
    
        var doc = prov.document().document();
        doc.entity("ex:foo");
        console.log("-----DOCUMENT-----");
        console.log(doc);
        prov.wasDerivedFrom("ex:e2", "ex:e1").generatedEntity("ex:e4");
    };
    
    example();

Run:

    $ nodejs example.js
    -----ENTITY 1-----
    { scope: 
       { attributes: [ [Object], [Object], [Object], [Object] ],
         identifier: 
          { prefix: 'ex',
            localPart: 'e1',
            namespaceURI: 'http://www.example.org/',
            uri: 'http://www.example.org/e1' } },
    ...
