# provconvert

An executable to convert between PROV representations.

## USAGE

````
prov-convert [-namespaces file] [-infile file] [-verbose]
      [-version] [-debug] [-help] [-logfile file] [-outfile file]
-debug               print debugging information
-help                print this message
-infile <file>       use given file as input
-logfile <file>      use given file for log
-namespaces <file>   use given file as declaration of prefix namespaces
-outfile <file>      use given file as output
-title <string>      page title (for svg)
-verbose             be verbose
-version             print the version information and exit
````

## RECOGNIZED FILE EXTENSIONS

| Extension          | Format |
| ------------------ | ------ |
| `.provn`           | [PROV-N](http://www.w3.org/TR/prov-n/) |
| `.ttl`             | [PROV-O](http://www.w3.org/TR/prov-o/) [Turtle](http://www.w3.org/TR/turtle/) |
| `.rdf`             | PROV-O [RDF](http://www.w3.org/RDF/) |
| `.trig`            | PROV-O [TriG](http://www.w3.org/TR/trig/) |
| `.provx` or `.xml` | [PROV-XML](http://www.w3.org/TR/prov-xml/) |
| `.json`            | [PROV-JSON](http://www.w3.org/Submission/2013/SUBM-prov-json-20130424/) |
| `.pdf`             | Adobe [PDF](https://get.adobe.com/uk/reader/) document |
| `.svg`             | SVG image | 
| `.dot`             | [Graphviz](http://www.graphviz.org/) dot image |

`.pdf`, `.svg` and `.dot` can only be used as output formats.

## EXAMPLE

To convert a file to pdf:

````
provconvert -infile  pc1-full.xml -outfile pc1-full.pdf
````

To convert a ttl file to provn:

````
provconvert -infile  pc1-full.ttl -outfile pc1-full.provn
````

## NOTES

* This is purely experimental, and relying on XML schemas, OWL ontologies, and ASN grammars that are still evolving.
* The conversions do not support all the [PROV](http://www.w3.org/TR/prov-overview/) terms yet.
* There are a number of assumptions underpinning the ASN parser and converter:
  - Entities, agents, activities always have to be declared. In other words, if one writes 
    ` wasGeneratedBy(e2,a1)` there must be `entity(e2)` and `activity(a1)`.
  - Declarations should occur before use (due to a 1 pass conversion).

### Troubleshooting - Failed to load class "org.slf4j.impl.StaticLoggerBinder"

If, when specifying `.ttl` or `.rdf` as an input or output format you see:

````
$ provconvert -infile example.json -outfile example.ttl
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.

$ provconvert -infile example.ttl -outfile example.xml
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.

$ provconvert -infile  example.json -outfile example.rdf
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
````

These warnings can be ignored.
