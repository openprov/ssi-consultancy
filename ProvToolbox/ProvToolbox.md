# ProvToolbox

ProvToolbox is a Java library to create Java representations of PROV-DM and convert them to PROV-O, PROV-XML, PROV-N, and PROV-JSON.

* Source code: https://github.com/lucmoreau/ProvToolbox/
  - master is the stable branch.
  - refactoring is the development branch.
* Licence: MIT Public License.
* Documentation: http://lucmoreau.github.io/ProvToolbox/
* Issue tracker: https://github.com/lucmoreau/ProvToolbox/issues
* Travis CI: https://travis-ci.org/lucmoreau/ProvToolbox
* provconvert: https://github.com/lucmoreau/ProvToolbox/wiki/provconvert 

* https://travis-ci.org/trungdong/ProvToolbox 
* https://github.com/lucmoreau/ProvToolbox/wiki/provconvert 

* The prov-convert command line utility is built by maven and available at toolbox/target/appassembler/bin/provconvert
* Local tests: The library is managed by Maven (also available from Maven Central). Tests can be run by: mvn test

## GitHub

https://github.com/lucmoreau/ProvToolbox/

README.md redirects to http://lucmoreau.github.io/ProvToolbox/

## Documentation

http://lucmoreau.github.io/ProvToolbox/

Download links:

* https://github.com/lucmoreau/ProvToolbox/tarball/master
* https://github.com/lucmoreau/ProvToolbox/zipball/master

These just provide the contents of the master branch - alternative to Git clone.

Javadoc links to http://openprovenance.org/java/site/0_6_0/apidocs/index.html

Installation Instructions

> Requirements: https://github.com/lucmoreau/ProvToolbox/wiki/Installation#requirements
> Building from source: https://github.com/lucmoreau/ProvToolbox/wiki/Installation#building-from-source
> Binary install: https://github.com/lucmoreau/ProvToolbox/wiki/Installation#installing-binary-release

Release Notes

https://github.com/lucmoreau/ProvToolbox/wiki/Releases

Links to Installation, Releases and provconvert documentation

## Prerequisites

https://github.com/lucmoreau/ProvToolbox/wiki/Installation#requirements

> xmllint: the xmllint, xml schema validator, needs to be in the path for prov-xml to compile

    $ sudo apt-get install libxml2-utils
    $ xmllint --version
    xmllint: using libxml version 20901

> dot: the dot executable (graphiz) needs to be in the path for prov-dot to compile

From ProvPy:

    $ sudo apt-get install graphviz
    $ dot -V
    dot - graphviz version 2.36.0 (20140111.2315)

Graph visualization software GraphViz

* http://www.graphviz.org/

For users:

* Java - what version? Oracle JDK 7
  - Oracle, https://www.java.com/en/
  - OpenJDK http://openjdk.java.net/

For developers:

* Git - as for ProvToolbox
* Apache Maven - what version?
  - https://maven.apache.org/

## Binary install

https://github.com/lucmoreau/ProvToolbox/wiki/Installation#installing-binary-release

    $ curl -L -O http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/toolbox/0.6.1/toolbox-0.6.1-release.zip
    $ unzip toolbox-0.6.1-release.zip
    $ ls provToolbox
    bin          prov-toolbox-tutorial.pdf  README-provconvert.txt       repo
    license.txt  README-licenses.txt        README-provxml-validate.txt
    $ ./bin/provconvert
    Error: JAVA_HOME is not defined correctly.
      We cannot execute 
    ./bin/provconvert: 105: exec: : Permission denied

https://github.com/lucmoreau/ProvToolbox/blob/master/.travis.yml

    language: java

http://docs.travis-ci.com/user/languages/java/

> Oracle JDK 7 (default)

https://help.ubuntu.com/community/Java

Not provided via Ubuntu archives

https://lists.ubuntu.com/archives/ubuntu-security-announce/2011-December/001528.html

OpenJDK is recommended.

    $ sudo apt-get install openjdk-7-jre
    $ java -version
    java version "1.7.0_79"
    OpenJDK Runtime Environment (IcedTea 2.5.5) (7u79-2.5.5-0ubuntu0.14.04.2)
    OpenJDK 64-Bit Server VM (build 24.79-b02, mixed mode)

    $ ./bin/provconvert -version
    prov-convert:  version x.y.z

https://github.com/lucmoreau/ProvToolbox/wiki/provconvert

Create simple JSON example based on http://prov.readthedocs.org/en/latest/usage.html#prov-document-with-a-bundle

    $ cat example.json
    {"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}

Create other inputs using ProvPy:

    $ ./scripts/prov-convert -f xml example.json example.xml
    $ ./scripts/prov-convert -f provn example.json example.provn
    $ ./scripts/prov-convert -f svg example.json example.svg

Use provconvert:

    $ ./bin/provconvert -infile example.xml -outfile example.out.json
    $ cat example.out.json 
    {
      "entity": {
        "e001": {}
      },
      "prefix": {
        "xsd": "http://www.w3.org/2001/XMLSchema",
        "pre_0": "http://example.org/0/",
        "default": "http://example.org/0/",
        "prov": "http://www.w3.org/ns/prov#"
      },
      "bundle": {
        "e001": {
          "entity": {
            "e001": {}
          }
        }
      }
    }
    $ ./bin/provconvert -infile example.provn -outfile example.out.json
    $ cat example.out.json 
    {
      "entity": {
        "e001": {}
      },
      "prefix": {
        "xsd": "http://www.w3.org/2001/XMLSchema",
        "default": "http://example.org/0/",
        "prov": "http://www.w3.org/ns/prov#",
        "ex2": "http://example.org/2/",
        "ex1": "http://example.org/1/"
      },
      "bundle": {
        "e001": {
          "entity": {
            "e001": {}
          },
          "prefix": {
            "xsd": "http://www.w3.org/2001/XMLSchema",
            "default": "http://example.org/2/",
            "prov": "http://www.w3.org/ns/prov#"
          }
        }
      }
    }
    $ ./bin/provconvert -infile example.json -outfile example.out.json 
    $ cat example.out.json 
    {
      "entity": {
        "e001": {}
      },
      "prefix": {
        "xsd": "http://www.w3.org/2001/XMLSchema",
        "default": "http://example.org/0/",
        "prov": "http://www.w3.org/ns/prov#",
        "ex2": "http://example.org/2/",
        "ex1": "http://example.org/1/"
      },
      "bundle": {
        "e001": {
          "entity": {
            "e001": {}
          },
          "prefix": {
            "xsd": "http://www.w3.org/2001/XMLSchema",
            "default": "http://example.org/2/",
            "prov": "http://www.w3.org/ns/prov#"
          }
        }
      }
    }
    $ ./bin/provconvert -infile example.json -outfile example.out.provn
    $ cat example.out.provn 
    document
    default <http://example.org/0/>
    prefix xsd <http://www.w3.org/2001/XMLSchema>
    prefix ex2 <http://example.org/2/>
    prefix ex1 <http://example.org/1/>
    entity(e001)
    bundle e001
    default <http://example.org/2/>
    prefix xsd <http://www.w3.org/2001/XMLSchema>
    
    entity(e001)
    endBundle
    endDocument
    
Follow Dong's GoogleDoc instructions to find provconvert location:

    $ ./bin/provconvert -infile example.json -outfile example.out.svg
    exit value 0
    OK
    $ ./bin/provconvert -infile example.json -outfile example.out.pdf
    OK
    $ ./bin/provconvert -infile example.svg -outfile example.out.pdf
    Exception in thread "main" java.lang.UnsupportedOperationException
    	at org.openprovenance.prov.interop.InteropFramework.readDocumentFromFile(InteropFramework.java:633)
    	at org.openprovenance.prov.interop.InteropFramework.run(InteropFramework.java:696)
    	at org.openprovenance.prov.interop.CommandLineArguments.main(CommandLineArguments.java:160)
    $ ./bin/provconvert -infile example.json -outfile example.out.ttl
    SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
    SLF4J: Defaulting to no-operation (NOP) logger implementation
    SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
    $ cat example.out.ttl 
    @prefix prov: <http://www.w3.org/ns/prov#> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix ex2: <http://example.org/2/> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix ex1: <http://example.org/1/> .
        
    <http://example.org/0/e001> a prov:Entity .
    
    ex2:e001 a prov:Entity .
    $ .//bin/provconvert -infile example.out.ttl -outfile example.out.json
    SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
    SLF4J: Defaulting to no-operation (NOP) logger implementation
    SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
    
http://www.slf4j.org/codes.html#StaticLoggerBinder

    $ cat example.out.json 
    {
      "entity": {
        "pre_0:e001": {},
        "ex2:e001": {}
      },
      "prefix": {
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "ex2": "http://example.org/2/",
        "ex1": "http://example.org/1/",
        "prov": "http://www.w3.org/ns/prov#",
        "xsd": "http://www.w3.org/2001/XMLSchema",
        "pre_1": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "pre_0": "http://example.org/0/",
        "bnode": "http://openprovenance.org/provtoolbox/bnode/"
      }
    }

    $ README-provconvert.txt 

    RECOGNIZED FILE EXTENSIONS

     - prov-n notation:   .provn
     - prov-o ttl:        .ttl
     - prov-xml:          .provx or .xml
     - pdf:               .pdf
     - svg:               .svg

But rdf and dot are also supported

    $ ./bin/provconvert -infile  example.json -outfile example.rdf
    SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
    SLF4J: Defaulting to no-operation (NOP) logger implementation
    SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
    $ cat example.rdf 
    <?xml version="1.0" encoding="UTF-8"?>
    <rdf:RDF
    	xmlns:prov="http://www.w3.org/ns/prov#"
    	xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
    	xmlns:ex2="http://example.org/2/"
    	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    	xmlns:ex1="http://example.org/1/"
    	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    
    <rdf:Description rdf:about="http://example.org/0/e001">
    	<rdf:type rdf:resource="http://www.w3.org/ns/prov#Entity"/>
    </rdf:Description>
    
    <rdf:Description rdf:about="http://example.org/2/e001">
    	<rdf:type rdf:resource="http://www.w3.org/ns/prov#Entity"/>
    </rdf:Description>
    
    </rdf:RDF>

    $ ./bin/provconvert -infile  example.json -outfile example.dot
    $ cat example.dot 
    digraph "PROV" { size="16,12"; rankdir="BT"; 
    nhttp___example_org_0_e001 [style="filled",color="#808080",label="e001",URL="http://example.org/0/e001",fillcolor="#FFFC87"]
    subgraph clusternhttp___example_org_2_e001 { 
      label="e001";
      URL="http://example.org/2/e001";
    nhttp___example_org_2_e001 [style="filled",color="#808080",label="e001",URL="http://example.org/2/e001",fillcolor="#FFFC87"]
    }
    }
    $ dot -Tjpg example.dot -o example.jpg

bin/ contains provconvertBAK

    $ diff bin/provconvert bin/provconvertBAK 
    86c86
    <   #### no exit ### Luc
    ---
    >   exit 1

README-provxml-validate.txt desribes another tool:

    > opmxml-validate opmFile.xml {schemaFile.xsd}*

but there is no such tool in the bundle.

bin/provconvert.bat sets up the CLASSPATH. Alternatively use a JAR with a Class-Path attribute in its MANIFEST. See [Adding Classes to the JAR File's Classpath](https://docs.oracle.com/javase/tutorial/deployment/jar/downman.html).

http://sourceforge.net/p/ogsa-dai/code/HEAD/tree/ogsa-dai/trunk/release-scripts/ogsa-dai/build-binary.xml

## Git build

https://github.com/lucmoreau/ProvToolbox/wiki/Installation#building-from-source

> To install from source, you need to checkout the source code and compile, by running mvn clean install.

    $ git clone https://github.com/lucmoreau/ProvToolbox.git ProvToolboxSource

    $ sudo apt-get install maven
    $ mvn -v
    Warning: JAVA_HOME environment variable is not set.
    Apache Maven 3.0.5
    Maven home: /usr/share/maven
    Java version: 1.7.0_79, vendor: Oracle Corporation
    Java home: /usr/lib/jvm/java-7-openjdk-amd64/jre
    Default locale: en_US, platform encoding: UTF-8
    OS name: "linux", version: "3.16.0-30-generic", arch: "amd64", family: "unix"

    $ cd ProvToolboxSource/
    $ mvn clean install
    Warning: JAVA_HOME environment variable is not set.
    ...
    [ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:2.0.2:compile (default-compile) on project prov-model: Compilation failure
    [ERROR] Unable to locate the Javac Compiler in:
    [ERROR] /usr/lib/jvm/java-7-openjdk-amd64/jre/../lib/tools.jar
    [ERROR] Please ensure you are using JDK 1.4 or above and
    [ERROR] not a JRE (the com.sun.tools.javac.Main class is required).
    [ERROR] In most cases you can change the location of your Java
    [ERROR] installation by setting the JAVA_HOME environment variable.
    [ERROR] -> [Help 1]

    $ sudo apt-get install openjdk-7-jdk
    $ javac -version
    javac 1.7.0_79

    $ script
    $ mvn clean install
    ...
    [INFO] ------------------------------------------------------------------------
    [INFO] Reactor Summary:
    [INFO] 
    [INFO] ProvToolbox: Java for W3C PROV .................... SUCCESS [0.632s]
    [INFO] PROV-MODEL ........................................ SUCCESS [10.022s]
    [INFO] PROV-XML .......................................... SUCCESS [26.620s]
    [INFO] PROV-N ............................................ SUCCESS [18.762s]
    [INFO] PROV-DOT .......................................... SUCCESS [5.050s]
    [INFO] PROV-JSON ......................................... SUCCESS [20.823s]
    [INFO] PROV-RDF .......................................... SUCCESS [18.752s]
    [INFO] PROV-TEMPLATE ..................................... SUCCESS [3.045s]
    [INFO] PROV-GENERATOR .................................... SUCCESS [4.330s]
    [INFO] PROV-INTEROP ...................................... SUCCESS [2.651s]
    [INFO] PROV Toolbox ...................................... SUCCESS [7.471s]
    [INFO] PROV-SQL .......................................... SUCCESS [1:09.727s]
    [INFO] ProvToolbox Tutorial 1 ............................ SUCCESS [6.432s]
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 3:15.601s
    [INFO] Finished at: Tue May 12 07:23:18 PDT 2015
    [INFO] Final Memory: 99M/253M
    [INFO] ------------------------------------------------------------------------
    $ CTRL-D
    $ grep -v Downloading typescript > tmp
    $ grep -v Downloaded tmp > ProvToolBox.build.out.txt

    $ ./toolbox/target/appassembler/toolbox/target/appassembler/bin/provconvert -version
    prov-convert:  version x.y.z
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.xml -outfile example.out.json
    $ cat example.out.json
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.provn -outfile example.out.json
    $ cat example.out.json
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.json -outfile example.out.json 
    $ cat example.out.json
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.json -outfile example.out.provn
    $ cat example.out.provn 
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.json -outfile example.out.svg
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.json -outfile example.out.pdf
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.svg -outfile example.out.pdf
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.json -outfile example.out.ttl
    $ cat example.out.ttl 
    $ ./toolbox/target/appassembler/bin/provconvert -infile example.out.ttl -outfile example.out.json
    $ cat example.out.json

All as for binary release.

http://docs.travis-ci.com/user/languages/java/

> If your project has pom.xml file in the repository root ..., Travis CI Java builder will use Maven 3 to build it. By default it will use
>
>    mvn test

> Before running tests, Java builder will execute
>
>    mvn install -DskipTests=true

## Source release build

    $ curl -L -o master.zip -O https://github.com/lucmoreau/ProvToolbox/zipball/master
    $ unzip master.zip
    $ cd lucmoreau-ProvToolbox-f602c0f/
    $ mvn clean install
    OK

## Maven

    $ mvn -o help:effective-settings
    ...
      <localRepository xmlns="http://maven.apache.org/SETTINGS/1.1.0">/home/ubuntu/.m2/repository</localRepository>
    ...

-o offline

https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html

validate - validate the project is correct and all necessary information is available

    $ mvn validate
    $ mvn compile
    $ mvn test

package - take the compiled code and package it in its distributable format, such as a JAR.

    $ mvn package
    ...
    [INFO] Building jar: /home/ubuntu/ProvToolboxSource/tutorial/tutorial1/target/ProvToolbox-Tutorial1-0.6.2-SNAPSHOT.jar
    ...
    [INFO] Building zip: /home/ubuntu/ProvToolboxSource/tutorial/tutorial1/target/ProvToolbox-Tutorial1-0.6.2-SNAPSHOT-src.zip

integration-test - process and deploy the package if necessary into an environment where integration tests can be run

    $ mvn integration-test

verify - run any checks to verify the package is valid and meets quality criteria

    $ mvn verify

install - install the package into the local repository, for use as a dependency in other projects locally

deploy - done in an integration or release environment, copies the final package to the remote repository for sharing with other developers and projects.    $ mvn integration-test

## Tutorial

ProvToolbox Tutorial 1: Creating and Saving a PROV Document

https://lucmoreau.wordpress.com/2014/08/01/provtoolbox-tutorial-1-creating-and-saving-a-prov-document/

Last updated: 2014/08/08

    $ curl -L -o tutorial.zip http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/ProvToolbox-Tutorial1/0.6.1/ProvToolbox-Tutorial1-0.6.1-src.zip
    $ unzip tutorial.zip 
    $ cd ProvToolbox-Tutorial1-0.6.1/
    $ ls -1
    LICENSE.TXT
    pom.xml
    README.txt
    
    ./src/main/java/org/openprovenance/prov/tutorial/tutorial1:
    Little.java
    
    ./src/main/resources:
    log4j.xml
    
    $ mvn clean install
    ...
    *************************
    * Converting document  
    *************************
    document
    prefix xsd <http://www.w3.org/2001/XMLSchema>
    prefix provbook <http://www.provbook.org>
    prefix jim <http://www.cs.rpi.edu/~hendler/>
    entity(provbook:a-little-provenance-goes-a-long-way,[prov:value = "A little provenance goes a long way" %% xsd:string])
    agent(provbook:Paul,[prov:label = "Paul Groth"])
    agent(provbook:Luc,[prov:label = "Luc Moreau"])
    wasAttributedTo(provbook:a-little-provenance-goes-a-long-way, provbook:Paul)
    wasAttributedTo(provbook:a-little-provenance-goes-a-long-way, provbook:Luc)
    entity(jim:LittleSemanticsWeb.html)
    wasDerivedFrom(provbook:a-little-provenance-goes-a-long-way, jim:LittleSemanticsWeb.html)
    endDocument
    *************************
    ...

View target/little.svg

OK

Java file:

    $ cat src/main/java/org/openprovenance/prov/tutorial/tutorial1/Little.java 
    
    public static final String PROVBOOK_NS = "http://www.provbook.org";
    public static final String PROVBOOK_PREFIX = "provbook";
        
    public static final String JIM_PREFIX = "jim";
    public static final String JIM_NS = "http://www.cs.rpi.edu/~hendler/";
    
    public Little(ProvFactory pFactory) {
        ...
        ns=new Namespace();
        ns.addKnownNamespaces();
        ns.register(PROVBOOK_PREFIX, PROVBOOK_NS);
        ns.register(JIM_PREFIX, JIM_NS);
    }
    
    public QualifiedName qn(String n) {
        return ns.qualifiedName(PROVBOOK_PREFIX, n, pFactory);
    }
    
    public Document makeDocument() {     
        // entity(provbook:a-little-provenance-goes-a-long-way, ...)
        Entity quote = pFactory.newEntity(qn("a-little-provenance-goes-a-long-way"));
        // entity(provbook:a-little-provenance-goes-a-long-way,[prov:value = "A little provenance goes a long way" %% xsd:string])
        quote.setValue(pFactory.newValue("A little provenance goes a long way",
                                         pFactory.getName().XSD_STRING));
     
        // entity(jim:LittleSemanticsWeb.html)
        Entity original = pFactory.newEntity(ns.qualifiedName(JIM_PREFIX,"LittleSemanticsWeb.html",pFactory));
     
        // agent(provbook:Paul,[prov:label = "Paul Groth"])
        Agent paul = pFactory.newAgent(qn("Paul"), "Paul Groth");
        // agent(provbook:Luc,[prov:label = "Luc Moreau"])
        Agent luc = pFactory.newAgent(qn("Luc"), "Luc Moreau");
     
        // wasAttributedTo(provbook:a-little-provenance-goes-a-long-way, provbook:Paul)
        WasAttributedTo attr1 = pFactory.newWasAttributedTo(null,
                                                            quote.getId(),
                                                            paul.getId());
        // wasAttributedTo(provbook:a-little-provenance-goes-a-long-way, provbook:Luc)
        WasAttributedTo attr2 = pFactory.newWasAttributedTo(null,
                                                            quote.getId(),
                                                            luc.getId());
        // wasDerivedFrom(provbook:a-little-provenance-goes-a-long-way, jim:LittleSemanticsWeb.html)
        WasDerivedFrom wdf = pFactory.newWasDerivedFrom(quote.getId(),
                                                        original.getId());
     
        // document
        // endDocument
        Document document = pFactory.newDocument();
        // document
        // ...
        // endDocument
        document.getStatementOrBundle()
                .addAll(Arrays.asList(new StatementOrBundle[] { quote, 
                                                                paul,
                                                                luc, 
                                                                attr1,
                                                                attr2, 
                                                                original,
                                                                wdf }));
        // document
        // ...
        // endDocument
        document.setNamespace(ns);
        return document;
    }

Maven file:
    
    $ cat pom.xml
    
    <dependencies>
    
      <!-- Classes to manipulate PROV-DM in Java -->
    
      <dependency>
        <groupId>org.openprovenance.prov</groupId>
        <artifactId>prov-model</artifactId>
        <version>0.6.1</version>
      </dependency>
    
      <!-- Classes to convert to and from PROV-DM in Java -->
    
      <dependency>
        <groupId>org.openprovenance.prov</groupId>
        <artifactId>prov-interop</artifactId>
        <version>0.6.1</version>
      </dependency>
    </dependencies>
    
    <!-- Execute Java programwhen run 'mvn test' -->
    
    <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>1.3.2</version>
        <executions>
          <execution>
            <phase>test</phase>
            <goals>
              <goal>java</goal>
            </goals>
            <configuration>
              <mainClass>org.openprovenance.prov.tutorial.tutorial1.Little</mainClass>
              <arguments>
            <argument>target/little.svg</argument>
              </arguments>
            </configuration>
          </execution>
        </executions>
    </plugin>

## Tutorial PDF

prov-toolbox-tutorial.pdf in toolbox-0.6.1-release.zip is 29 blank pages. Likewise in 0.6.0 zip:

* http://openprovenance.org/java/maven-releases/org/openprovenance/prov/toolbox/0.6.0/toolbox-0.6.0-release.zip
* http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/toolbox/0.6.1/toolbox-0.6.1-release.zip

Likewise:

    ./toolbox/target/classes/8-prov-toolbox.pdf

is 29 empty pages but

    ./toolbox/src/main/resources/8-prov-toolbox.pdf

is OK!

Slides refer to:

* toolbox-1.1.X-release.zip
* http://openprovenance.org/java/maven-releases/org/openprovenance/toolbox/
* http://github.com/lucmoreau/OpenProvenanceModel
* All last updated ~2011

## Eclipse

.settings directory under GitHub.

    $ sudo apt-get install eclipse
    $ eclipse

Eclipse 3.8

---

## Set up environment summary

    # User prerequisites
    sudo apt-get -y install libxml2-utils
    xmllint --version
    sudo apt-get -y install graphviz
    dot -V
    sudo apt-get -y install openjdk-7-jre
    java -version
    sudo apt-get -y install curl
    curl --version
    # Developer prerequisites
    sudo apt-get -y install git
    git --version
    sudo apt-get -y install maven
    mvn -v
    sudo apt-get -y install openjdk-7-jdk
    javac -version
    # Optional
    sudo apt-get -y install eclipse
    eclipse

    # Sample file
    echo "{\"prefix\": {\"default\": \"http://example.org/0/\", \"ex2\": \"http://example.org/2/\", \"ex1\": \"http://example.org/1/\"}, \"bundle\": {\"e001\": {\"prefix\": {\"default\": \"http://example.org/2/\"}, \"entity\": {\"e001\": {}}}}, \"entity\": {\"e001\": {}}}" > example.json
    cat example.json

    # Binary release
    curl -L -O http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/toolbox/0.6.1/toolbox-0.6.1-release.zip
    unzip toolbox-0.6.1-release.zip
    cd provToolbox
    ./bin/provconvert -version
    ./bin/provconvert -infile example.json -outfile example.out.json 
    ./bin/provconvert -infile example.json -outfile example.ttl
    ./bin/provconvert -infile example.json -outfile example.rdf
    ./bin/provconvert -infile example.json -outfile example.provn
    ./bin/provconvert -infile example.json -outfile example.provx
    ./bin/provconvert -infile example.json -outfile example.dot
    ./bin/provconvert -infile example.json -outfile example.svg
    ./bin/provconvert -infile example.json -outfile example.pdf

    # Source release
    curl -L -o master.zip -O https://github.com/lucmoreau/ProvToolbox/zipball/master
    unzip master.zip
    cd lucmoreau-ProvToolbox-f602c0f/
    mvn clean install
    ./toolbox/target/appassembler/bin/provconvert -infile example.json -outfile example.out.json 
     mvn javadoc:javadoc

    # Source code repository
    git clone https://github.com/lucmoreau/ProvToolbox.git ProvToolboxSource
    cd ProvToolboxSource/
    mvn clean install
    ./toolbox/target/appassembler/bin/provconvert -infile example.json -outfile example.out.json 

    # Tutorial
    curl -L -o tutorial.zip http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/ProvToolbox-Tutorial1/0.6.1/ProvToolbox-Tutorial1-0.6.1-src.zip
    unzip tutorial.zip 
    cd ProvToolbox-Tutorial1-0.6.1/
    mvn clean install
