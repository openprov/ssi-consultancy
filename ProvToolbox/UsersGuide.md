# ProvToolbox User's Guide

This page describes how to deploy ProvToolbox and its prerequisites.

---

## Operating systems

The instructions have been written with reference to the 64-bit [Ubuntu](http://www.ubuntu.com/) 14.04.1 operating system.

Other operating systems, or versions of these, may differ in how packages are installed, the versions of these packages available from package managers etc. Consult the relevant documentation for your operating system and the products concerned.

These assume you have sudo access to install and configure software (or a local system administrator can do this for you):

    $ sudo su -

---

## Install Java 7 JRE

Java is a popular object-oriented programming language. The JRE (Java Runtine Environment) allows pre-compiled Java code to be run. There are numerous versions of Java available. Two popular ones are:

* [OpenJDK](http://openjdk.java.net/)
* [Oracle Java](https://www.java.com/en/)

Ubuntu [recommend](https://help.ubuntu.com/community/Java) OpenJDK.

Install:

    $ sudo apt-get install openjdk-7-jre
    $ java -version
    java version "1.7.0_79"
    OpenJDK Runtime Environment (IcedTea 2.5.5) (7u79-2.5.5-0ubuntu0.14.04.2)
    OpenJDK 64-Bit Server VM (build 24.79-b02, mixed mode)

If you plan on writing and compiling Java code, then install the JDK (Java Development Kit). It comes with the JRE:

    $ sudo apt-get install openjdk-7-jdk
    $ java -version
    java version "1.7.0_79"
    OpenJDK Runtime Environment (IcedTea 2.5.5) (7u79-2.5.5-0ubuntu0.14.04.2)
    OpenJDK 64-Bit Server VM (build 24.79-b02, mixed mode)
    $ javac -version
    javac 1.7.0_79

---

## Install xmllint

[xmllint](http://xmlsoft.org/xmllint.html) is an XML Schema validator. It is part of the [libxml2](http://xmlsoft.org/) XML parser and toolkit.

Install:

    $ sudo apt-get install libxml2-utils
    $ xmllint --version
    xmllint: using libxml version 20901

---

## Install GraphViz

dot is a program for drawing directed graphs. It is part of [Graphviz](http://www.graphviz.org/) open source graph visualization software. 

Install:

    $ sudo apt-get install graphviz
    $ dot -V
    dot - graphviz version 2.36.0 (20140111.2315)

---

## Install cURL

[cURL](http://curl.haxx.se/) is a very useful command line tool and library for interacting over HTTP(S).

Install:

    $ apt-get install curl
    $ curl --version
    curl 7.35.0 (x86_64-pc-linux-gnu) libcurl/7.35.0 OpenSSL/1.0.1f zlib/1.2.8 libidn/1.28 librtmp/2.3

---

## Install ProvToolbox binary release

Latest release `0.6.1`. For more information about its contents, and all available releases, see [Releases](https://github.com/lucmoreau/ProvToolbox/wiki/Releases).

There is no installation procedure per se, but there is a zip archive, containing a binary executable `provconvert` in the bin/ subdirectory. The current and previous binary releases can be found at:

* http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/toolbox/0.6.1/toolbox-0.6.1-release.zip
* http://openprovenance.org/java/maven-releases/org/openprovenance/prov/toolbox/0.6.0/toolbox-0.6.0-release.zip

Install:

    $ curl -L -O http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/toolbox/0.6.1/toolbox-0.6.1-release.zip
    $ unzip toolbox-0.6.1-release.zip
    $ ls provToolbox
    bin          prov-toolbox-tutorial.pdf  README-provconvert.txt       repo
    license.txt  README-licenses.txt        README-provxml-validate.txt
    $ ./bin/provconvert -version
    prov-convert:  version x.y.z

Add provconvert to your PATH:

    $ export PATH=`pwd`/bin:$PATH
    $ cd
    $ provconvert -version
    prov-convert:  version x.y.z

---

## Run provconvert on an example

Create a file, `example.json`:

    {"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}

Run:

    $ provconvert -infile example.json -outfile example.xml
    $ cat example.xml
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <prov:document xmlns:prov="http://www.w3.org/ns/prov#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:
    ex2="http://example.org/2/" xmlns:ex1="http://example.org/1/">
        <prov:bundleContent prov:id="ex2:e001">
            <prov:entity prov:id="ex2:e001"/>
        </prov:bundleContent>
        <prov:entity xmlns="http://example.org/0/" prov:id="e001"/>
    </prov:document>

    $ provconvert -infile example.xml -outfile example.provn
    $ cat example.provn
    document
    default <http://example.org/0/>
    prefix xsd <http://www.w3.org/2001/XMLSchema>
    prefix ex2 <http://example.org/2/>
    entity(e001)
    bundle ex2:e001

    entity(ex2:e001)
    endBundle
    endDocument
    
    $ provconvert -infile example.provn -outfile example.rdf
    $ cat example.rdf
    <?xml version="1.0" encoding="UTF-8"?>
    <rdf:RDF
    	xmlns:prov="http://www.w3.org/ns/prov#"
    	xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
	    xmlns:ex2="http://example.org/2/"
	    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
	    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">

    <rdf:Description rdf:about="http://example.org/0/e001">
    	<rdf:type rdf:resource="http://www.w3.org/ns/prov#Entity"/>
    </rdf:Description>

    <rdf:Description rdf:about="http://example.org/2/e001">
	    <rdf:type rdf:resource="http://www.w3.org/ns/prov#Entity"/>
    </rdf:Description>

    </rdf:RDF>

For more information on provconvert, run:

    $ provconvert -help

See also the [provconvert man page](./manpage.md).
