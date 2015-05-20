# ProvToolbox notes

## Other resources

* https://github.com/lucmoreau/ProvToolbox/wiki/
* https://travis-ci.org/trungdong/ProvToolbox 
* https://github.com/lucmoreau/ProvToolbox/wiki/provconvert 

## Download links

* https://github.com/lucmoreau/ProvToolbox/tarball/master
* https://github.com/lucmoreau/ProvToolbox/zipball/master

These provide the contents of the master branch - alternative to Git clone.

## Java versions

https://github.com/lucmoreau/ProvToolbox/blob/master/.travis.yml

    language: java

http://docs.travis-ci.com/user/languages/java/

> Oracle JDK 7 (default)

https://help.ubuntu.com/community/Java

Oracle JDK not provided via Ubuntu archives

## provconvert examples

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
    
    $ ./bin/provconvert -infile example.json -outfile example.out.svg
    exit value 0

    $ ./bin/provconvert -infile example.json -outfile example.out.pdf

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

    $ ./bin/provconvert -infile example.out.ttl -outfile example.out.json
    SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
    SLF4J: Defaulting to no-operation (NOP) logger implementation
    SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
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

## Maven

http://docs.travis-ci.com/user/languages/java/

> If your project has pom.xml file in the repository root ..., Travis CI Java builder will use Maven 3 to build it. By default it will use
>
>    mvn test

> Before running tests, Java builder will execute
>
>    mvn install -DskipTests=true

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

## Tutorial files with additional comments

ProvToolbox Tutorial 1: Creating and Saving a PROV Document

https://lucmoreau.wordpress.com/2014/08/01/provtoolbox-tutorial-1-creating-and-saving-a-prov-document/

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

## Eclipse

.settings directory under GitHub.

    $ sudo apt-get install eclipse
    $ eclipse

Eclipse 3.8

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

    # Create simple JSON example based on http://prov.readthedocs.org/en/latest/usage.html#prov-document-with-a-bundle
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
