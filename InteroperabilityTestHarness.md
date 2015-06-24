# Interoperability test harness design

Mike Jackson, The Software Sustainability Institute / EPCC, The University of Edinburgh

## Format

> Quoted text is from Dong's Interoperability test requirements.

Proposed classes and functions are expressed in Python-style syntax, but this does not preclude the use of other languages e.g. Java.

Proposed configuration files are expressed using YAML, but this does not preclude the use of other notations e.g. JSON or XML.

## Objectives

The objective of this collaboration is to develop a test infrastructure, which systematically checks convertibility and round-trip conversions across combinations of Provenance Tool Suite packages and services operating collectively. This will include testing of:

* Round-trip interoperability between ProvPy and ProvToolbox.
* Round-trip interoperability between ProvPy and ProvToolbox and deployed ProvStore, ProvTranslator and ProvValidator services whether these be deployed locally, on a developer's own machine, or remotely.
* ProvJS-related operations.
* Command-line utilities that are provided within ProvToolbox (e.g. provconvert).

ProvToolbox also has a persistence layer and it would be useful if tests could exercise this in future. The infrastructure harness should not preclude this.

Testing of closed source packages and a private test infrastructure (e.g. hosted on a local machine, rather than Travis CI) are also desirable, so, any tests should be runnable both under Travis CI and on a locally hosted machine (for local or private testing, for example).

---

## Round-trip interoperability tests

> The main objective is to make sure that the software being tested support all PROV constructs (as specified by the test cases) and maintain their semantics across all supported PROV representations.

### Test cases

> The interoperability tests will be based around test cases, which are PROV documents provided in all supported representations: PROV-N, PROV-XML, PROV-JSON, and RDF (.ttl or .trig).

A test case consists of a set of documents in the PROV representations:

| Representation  | Extension     |
| --------------- | ------------- |
| PROV-N          | .provn        |
| PROV-O (Turtle) | .ttl          |
| PROV-O (TriG)   | .trig         |
| PROV-XML        | .xml / .provx |
| PROV-JSON       | .json         |

Each document within a single test case is semantically equivalent.

> For example, a test case whose name is testcase1 will consist of the files testcase1.provn, testcase1.xml, testcase1.json, testcase1.ttl, and testcase1.trig (where applicable) which are equivalent to each other.

Most, but not all, test cases will have files for every representation. Some test cases, however, will only have files for a subset of representations, as there are cases that can't be validly encoded in a particular representation (e.g. XML).

> The list of test cases will be curated manually, but will initially populated from the test output files produced by ProvToolbox.

> The test cases will be published in a Github repository and be maintained as a community resource for interoperability tests.

The test cases will be gradually updated over time as needed.

### Test procedure

> The test procedure for one test case is as follows:
> 
> * A converter translates testcase1.<ext_in> (from the test case) to converted_testcase1.<ext_out>.
> * A comparator compares testcase1.<ext_out> to converted_testcase1.<ext_out> for equivalence => success | fail.

### Component interfaces

Converters and comparators have a common base class, representing a configurable component:

```
class ConfigurableComponent:
  def __init__(self):
  def configure(self, config):
    Sub-classes override this function:
    - Extract sub-class-specific configuration from config, ignore the rest.
    - Raise ConfigError if there is missing or invalid configuration.
```

### Converters

Converters are represented by a base class:

```
class Converter(ConfigurableComponent):
  def convert(self, in_file, in_format, out_file, out_format):
    Sub-classes override this function:
    - Invoke converter-specific conversion.
    - Return True (success) or False (fail).
    - Raise ConverterError if there are problems invoking the converter 
```

Command-line converters have their own sub-classes:

```
class ProvPyConverter(Converter):
  def convert(self, in_file, in_format, out_file, out_format):
    Execute prov-convert.
    Capture return code, standard output, standard error.
    Check return code and existence of output file.

class ProvToolboxConverter(Converter):
  def convert(self, in_file, in_format, out_file, out_format):
    As above, for provconvert.
```

Command-line converters, invoked by these classes, need to exit with a non-zero exit code in case of problems and/or *not* write an output file, so that conversion failures can be detected.

**TODO:** Dong will check whether prov-convert satisfies this requirement.

Configuration includes information required to invoke the converter. For command-line converters:

* ProvPyConverter:
  - Path to executable e.g. /home/user/prov/scripts
  - Executable name e.g. prov-convert
  - Command-line argument list with output format and input and output files represented by tokens e.g. [-f, PROV_FORMAT, PROV_INPUT, PROV_OUTPUT]
* ProvToolboxConverter:
  - Path to executable e.g. /home/user/provToolbox/bin
  - Executable name e.g. provconvert
  - Command-line argument list with input and output files represented by tokens e.g. [-infile, PROV_INPUT, -outfile, PROV_OUTPUT]

Sub-classes can replace the tokens with the output format, input and output file names when constructing the command to invoke. Providing command-line arguments in this way allows for additional command-line arguments (e.g. to set logging verbosity) to be added by updating the configuration, rather than editing the source code.

REST converters also have their own sub-classes:

```
class ProvTranslatorConverter(Converter):
  def convert(self, in_file, in_format, out_file, out_format):
    Invoke POST on REST endpoint, submitting infile content.
    Check HTTP status.
    Extract outfile content from response.

class ProvStoreConverter(Converter):
  def convert(self, in_file, in_format, out_file, out_format):
    Invoke POST on REST endpoint, submitting infile content.
    Check HTTP status.
    Extract document ID from response.
    Invoke GET on REST endpoint, to get converted document.
    Check HTTP status.
    Extract outfile content from response.
    Invoke DELETE on REST endpoint to delete document.
```

REST converters need to return a 4xx (client) or 5xx (server) status code, so that conversion failures can be detected.

For REST converters, configuration includes:

* ProvTranslatorConverter:
  - REST endpoint for POST request e.g. https://provenance.ecs.soton.ac.uk/validator/provapi/documents/
* ProvStoreConverter:
  - REST endpoint for POST request e.g. https://provenance.ecs.soton.ac.uk/store/api/v0/documents/
  - API key for authenticating with ProvStore e.g. mikej888:XXXXXXXX.

### Comparators

prov 1.3.2 available on [pypi](https://pypi.python.org/pypi/prov) ([1.3.2](https://github.com/trungdong/prov/tree/1.3.2) tag in the [prov](https://github.com/trungdong/prov/tree/1.3.2) repository) has a prov-compare script.

provcompare, based on ProvToolbox, may be implemented at a later date.

Comparators are represented by a base class:

```    
class Comparator(ConfigurableComponent):
  def compare(self, canonical_file, canonical_format, file, format):
    Sub-classes override this function:
    - Invoke comparator-specific test for equivalence.
    - Return True (success) or False (fail).
    - Raise ComparatorError if there are problems invoking the converter 
```

Each comparator has its own sub-class:

```
class ProvPyComparator(Comparator):
  def compare(self, canonical_file, canonical_format, file, format):
    Execute prov-compare.
    Capture return code, standard output, standard error.
    Check return code.

class ProvToolboxComparator(Comparator):
  def compare(self, canonical_file, canonical_format, file, format):
    As above, for provcompare.
```

Command-line comparators, invoked by these classes, need to exit with a non-zero exit code in case of a non-equivalent pair of files being given, or another error arising (e.g. no such file). The error code for a non-equivalent pair should differ from that for other errors (e.g. missing input file). prov-compare satisfies this requirement.

Comparator sub-class configuration is the same as that for the corresponding converter sub-classes.

### Utility classes

Class to invoke command-line operations:

```
class CommandLineInvoker:
  @staticmethod
  def invoke(command_line):
    Extract executable name and arguments from command_line.
    Invoke command-line executable.
    Capture and return return code, stdout and stderr.
    Return CommandLineResult.
    Raise CommandLineError if there are problems invoking the command e.g.
    - Non-existent commands or files.
    - Any errors from the script itself.

class CommandLineResult:
  Setters/getters for return code, stdout, stderr.
```

Class to invoke REST endpoints:

```
class RestInvoker:
  @staticmethod
  def get(url, header_list):
    Invoke GET on REST endpoint.
    Capture HTTP status, response headers and body.
    Return RestResult.
    Raise RestError if there are problems invoking the REST endpoint e.g.:
    - Non-existent/non-contactable endpoints.
    - Badly-formatted URLs.
    - Any errors from the endpoint itself.
    - These are passed to the caller as exception(s).
  @staticmethod
  def post(url, header_list, body):
    As above, for POST.
  @staticmethod
  def delete(url, header_list):
    As above, for DELETE.

class RestResult:
  Setters/getters for HTTP status, headers, body.
```

Exception classes:

```
class ConfigError(Exception):
class ComparatorError(Exception):
class ConvertorError(Exception):
class CommandLineError(Exception):
class RestError(Exception):
```

### Test runner

> For a converter, the test infrastructure will allow specifying the list of (ext_in, ext_out) to be tested, and the comparator for each pair of representations. Converters and comparators are expected to be command line executable.

There are:

* 5 PROV representations i.e. a possible 120 (ext_in, ext_out) pairs.
* 5 converters.
* 2 comparators.
* N test cases.

From this, there are 1200*N possible tests that could be run. Providing a test function per possible test is unscalable. Converter-specific, test case-specific or format-specific test class/functions could be proposed but, again, these incur scalability problems if, for example, a new PROV representation were to be proposed, new test cases defined, or new converters implemented. 

As all tests confirm to the same pattern:

* A converter translates testcase1.<ext_in> (from the test case) to converted_testcase1.<ext_out>.
* A comparator compares testcase1.<ext_out> to converted_testcase1.<ext_out> for equivalence => success | fail.

a generic test class is used:

```
class InteroperabilityTest
  def test_interoperability(self, converters, comparators, tests):
    converters is a dictionary of named Converter objects.
    comparators is a dictionary of named Comparator objects.
    tests is a test specification (see below).
    FOR EACH converter_test IN tests:
      Get converter from converters.
      FOR EACH test_case IN converter_test:
        Get comparator from comparators.
        FOR EACH (ext_in, ext_out) pair IN test_case:
          convertor.convert(test_case.ext_in, ext_in, converted.ext_out, ext_out).
          comparator.compare(test_case.ext_out, ext_out, converted.ext_out, ext_out)
          Record comparator result.
```

A test specification, expressed as [YAML](http://yaml.org/) (YAML Ain't Markup Language) is: 

```
---
ProvPyConverter:
  testcase1:
  - convert: [[provn, trig], [xml, json]]
    comparator: ProvPyComparator
  - convert: [[provn, trig]]
    comparator: ProvToolboxComparator
  testcase2:
  - convert: [[provn, trig]]
    comparator: ProvPyComparator
  - convert: [[xml, json], [provn, trig]]
    comparator: ProvToolboxComparator
ProvToolboxConverter:
  ...
```

For each converter to be tested, zero or more test cases are specified. For each test case, a set of zero or more (ext_in, ext_out) pairs are specified, that is, the conversions to do using the documents of that test case. A comparator to validate each of these conversions is also specified.

For conciseness, a wild-card, 'all', can be used, within a convert pair, to denote all available formats for a test case e.g.

```
[xml, all] # Convert xml to each of provn, ttl, trig, xml and json.

[all, xml] # Convert each of provn, ttl, trig, xml, json to xml.

[all, all] # Convert each of provn, ttl, trig, xml, json to each of provn, ttl, trig, xml, json.
```

### Converter/comparator name-to-class mapping

There are three options for mapping converter and comparator names, as cited in the test specification, to their associated classes:

1. A factory class hard-codes these mappings.
  - Given a converter/comparator name, it creates the associated object.
  - The factory class needs to import the modules where the classes are defined.
2. A configuration file hard-codes mappings from names to module and class names.
  - Reflection is used to dynamically import modules and create objects from class names.
  - More flexible and extensible than 1.
3. Convertor and comparator class names are cited in test specification.
  - As above, reflection can be used. 
  - Specifying module names would make the test specification too verbose.

Option 2 is preferred. 

Class to support reflection and dynamic object creation:

```
class ReflectionUtilities:
  @staticmethod
  def getClass(name):
    Get module and class name from classes for the given string.
    Import module.
    Return class.
  @staticmethod
  def getInstance(name):
    Call getClass(name).
    Create and return instance of class. 
    - Assumes class has a 0-arity constructor.
```

### Test harness initialisation

Class to initialise test harness:

```
class InteroperabilityHarness
  def __init__(self):
    Initialise dictionary mapping converter names to instances.
    Initialise dictionary mapping comparator names to instances.
    Initialise empty test specification file name.
  def register_components(self, components):
    components is a dictionary of components and their configurations.
    FOR EACH component IN components:
      Get configuration for component.
      Get component name and class name from configuration.
      Call ReflectionUtilities.getInstance(class name) to get component instance.
      Call component.configure(configuration).
      Add to dictionary mapping component names to instances.
  def initialize(self, configuration):
    configuration holds test harness configuration (see below).
    Get converter configuration from configuration.
    Call register_components(converter configuration) to populate converters dictionary.
    Get comparator configuration from configuration.
    Call register_components(comparator configuration) to populate comparators dictionary.
    Get test specification file from configuration.
    Set test specification file.
```

Test harness configuration includes:

* Location of test case files.
* Location of test specification.
* Mappings from converter and comparator names to module and class names.
* Converter and comparator-specific configuration.

For example, in YAML:

```
---
test-cases: /home/user/test-cases
tests: /home/user/interop-tests.yaml
converters:
  ProvPyConverter: 
    class: prov.interop.converter.ProvPyConverter
    directory: /home/user/prov/scripts
    executable: prov-convert
    arguments: [-f, PROV_FORMAT, PROV_INPUT, PROV_OUTPUT]
  ProvToolboxConverter: 
    class: prov.interop.converter.ProvToolboxConverter
    directory: /home/user/provToolbox/bin
    executable: provconvert
    arguments: [-infile, PROV_INPUT, -outfile, PROV_OUTPUT]
  ProvTranslatorConverter:
    class: prov.interop.converter.ProvTranslatorConverter
    url: https://provenance.ecs.soton.ac.uk/validator/provapi/documents/
  ProvStoreConverter:
    class: prov.interop.converter.ProvTranslatorConverter
    url: https://provenance.ecs.soton.ac.uk/store/api/v0/documents/
    api_key: mikej888:XXXXXXXX
comparators:
  ProvPyComparator: 
    class: prov.interop.comparator.ProvPyComparator
    directory: /home/user/prov/scripts
    executable: prov-convert
    arguments: [-f, PROV_FORMAT, PROV_INPUT, PROV_OUTPUT]
  ProvToolboxComparator: 
    class: prov.interop.comparator.ProvToolboxComparator
    directory: /home/user/provToolbox/bin
    executable: provconvert
    arguments: [-infile, PROV_INPUT, -outfile, PROV_OUTPUT]
```

### Test harness execution

The test harness will be implemented in such a way that it supports execution via an xUnit test framework for the chosen implementation language e.g. for Python:

```
$ python -m unittest prov.interop.InteroperabilityTest
```

or,

```
$ nosetests prov.interop.InteroperabilityTest
```

This will determine the exact nature of the implementation of, and interaction between, the InteroperabilityTest and InteroperabilityHarness classes.

Adopting this approach means that xUnit framework support for test logging and report generation can be exploited.

### Question: design and xUnit test framework

The design supports just one test function which either succeeds (if every test in the interoperability test specification passes) or fails (if any one fails). Running this under an xUnit test framework would result in a report that only 1 test has been run, corresponding to the single test function (regardless of the number of conversions done and validated). For example, for Python the output would be something like:

```
$ python -m unittest prov.interop.InteroperabilityTest
.
----------------------------------------------------------------------
Ran 1 test in 1.000s

OK
```

Is this an issue? 

The test function can be implemented in a way so that failures report the specific comparison that failed. However, a failure of one converter would mean that the tests for other converters would not be run. There are ways of addressing this:

* Python 3.4 introduced [sub-tests](https://docs.python.org/dev/library/unittest.html#distinguishing-test-iterations-using-subtests) which would allow the tests for other converters to run even if a test for one converter failed. However, this still logs only one test function as having run.
* Python's nose library supports [test generators](http://nose.readthedocs.org/en/latest/writing_tests.html#test-generators) which allows iteration of a single test function across a range of parameters. An advantage over sub-tests is that it records each iteration as a separate invocation of the test function.
* Java's JUnit 4 supports [parameterized unit tests](http://junit.sourceforge.net/javadoc/org/junit/runners/Parameterized.html) which allow a test function to be run for each element in a user-defined test data generator.

An alternative solution is to have one test class per converter. Under this design there is no need for a dictionary that maps converter names to instances.

```
class InteroperabilityTest
  def run_interoperability_tests(self, comparator, comparators, tests):
    comparators is a dictionary of named Comparator objects.
    tests is a test specification (see below).
    FOR EACH test_case IN converter_test:
      Get comparator from comparators.
      FOR EACH (ext_in, ext_out) pair IN test_case:
        convertor.convert(test_case.ext_in, ext_in, converted.ext_out, ext_out).
        comparator.compare(test_case.ext_out, ext_out, converted.ext_out, ext_out)
        Record comparator result.

class ProvPyConverterTest(InteroperabilityTest)
  def test_interoperability(self, comparators, tests):
    Create and configue ProvPyConverter
    Call run_interoperability_tests.
class ProvToolboxConverter(InteroperabilityTest)
  def test_interoperability(self, comparators, tests):
    As above, for ProvToolboxConverter.
class ProvTranslatorConverter(InteroperabilityTest)
  def test_interoperability(self, comparators, tests):
    As above, for ProvTranslatorConverter.
class ProvStoreConverter(InteroperabilityTest)
  def test_interoperability(self, comparators, tests):
    As above, for ProvStoreConverter.
```

If the tests for one converter failed, the others would still be run. The xUnit would run one test function per converter and the output from an xUnit test framework would, for Python, be something like:

```
$ python -m unittest prov.interop.InteroperabilityTest
.....
----------------------------------------------------------------------
Ran 5 tests in 1.000s

OK
```

The original problem still exists for the tests within each converter - the failure to validate a conversion results in the rest of the conversions not running - but, at least, the failure won't block the tests for the other converters from running. A solution like nose test generators can be applied here too.

**Question:** should comparators have explicit test classes? I think maybe they should given they are the subject of the tests.

### Running within Travis CI or Jenkins

The design when implemented will be runnable under either Travis CI or Jenkins.

> The test cases will be published in a Github repository and be maintained as a community resource for interoperability tests.

Cloning the test cases repository and updating the interoperability test harness configuration to specify the local location of test case files, will be the responsibility of Travis CI- and Jenkins-specific configuration.

API keys are needed to POST and DELETE documents hosted in ProvStore. The API key should not be held within a publicly-visible repository. However, Travis CI can test code hosted in private GitHub repositories.

### Test harness unit tests

Unit test classes for the following test harness components will also be provided:

```
class CommandLineInvoker
class CommandLineResult
class RestInvoker
class RestResult
class ReflectionUtilities

class ComponentInterface
class Converter
class ProvPyConverter
class ProvToolboxConverter
class ProvTranslatorConverter
class ProvStoreConverter

class Comparator
class ProvPyComparator
class ProvToolboxComparator

class InteroperabilityHarness
```

---

## Deployment Readiness Tests

> Tests in this section are to assure new deployment will work as expected before replacing the live services (i.e. ProvStore, ProvValidator, ProvTranslator).

### ProvStore and ProvTranslator Integrity

> Treat ProvStore/ProvTranslator as a converter in the interoperability tests. In this case, the converter will use REST API to submit/retrieve documents from the interoperability test cases mentioned above to/from a configurable API endpoint.

This is covered in the foregoing design for the round-trip interoperability test harness.

### Function Operationality

> Check if all functions and services work: running basic requests without error (e.g. returning 2xx/3xx HTTP responses rather than 4xx or 5xx). These may form a test suite to for monitoring the live services at a regular basis.

This is orthogonal to the the round-trip interoperability test harness.

A simple design is a test class per service, where each test function submits one request:

```
class ServiceTest:
  def test_ping(url):
    Ping REST endpoint to check it is live.

class ProvValidatorTest(ServiceTest):
  def test_json():
    Invoke POST on REST endpoint with JSON document.
    Check HTTP status is 2xx/3xx.
  def test_provn():
    Invoke POST on REST endpoint with PROV-N document.
    Check HTTP status is 2xx/3xx.
  def test_xml():
    Invoke POST on REST endpoint with XML document.
    Check HTTP status is 2xx/3xx.
  ...

class ProvTranslatorTest(ServiceTest):
  def test_json_to_xml():
    Invoke POST on REST endpoint with JSON document.
    Check HTTP status is 2xx/3xx.
  def test_xml_to_json():
    Invoke POST on REST endpoint with XML document.
    Check HTTP status is 2xx/3xx.
  ...

class ProvStoreTest(ServiceTest):
  def test_save():
    Invoke POST on REST endpoint with JSON document.
    Check HTTP status is 2xx/3xx.
  def test_get():
    Invoke POST on REST endpoint with JSON document.
    Invoke GET on REST endpoint with JSON document.
    Check HTTP status is 2xx/3xx.
  def test_delete():
    Invoke POST on REST endpoint with JSON document.
    Check HTTP status is 2xx/3xx.
  ...
```

The RestInvoker class can be used by these test classes.

A YAML configuration file can provide URIs to be used to specify endpoints:

```
ProvTranslator:
 url: https://provenance.ecs.soton.ac.uk/validator/provapi/documents/
ProvValidator:
 url: https://provenance.ecs.soton.ac.uk/validator/provapi/documents/
ProvStore:
 url: https://provenance.ecs.soton.ac.uk/store/api/v0/documents/
 api_key: mikej888:XXXXXXXX
```

An alternative is to use a third-party test project e.g. [SoapUI](http://www.soapui.org/) which supports automated REST testing. There is also support for invoking SoapUI tests via [JUnit](http://www.soapui.org/test-automation/junit/junit-integration.html) or [Maven](http://www.soapui.org/test-automation/maven/maven-2-x.html). The ease of writing REST tests in SoapUI would need to be assessed, along with the desirability of using SoapUI rather than a simple in-house solution.

---

## Objectives covered by the foregoing

The foregoing design covers:

* A test infrastructure, which systematically checks convertibility and round-trip conversions across combinations of Provenance Tool Suite packages and services operating collectively.
* Round-trip interoperability between ProvPy and ProvToolbox.
* Round-trip interoperability between ProvPy and ProvToolbox and deployed ProvStore, ProvTranslator and ProvValidator services whether these be deployed locally, on a developer's own machine, or remotely.
* Testing of closed source packages and a private test infrastructure (e.g. hosted on a local machine, rather than Travis CI) are also desirable, so, any tests should be runnable both under Travis CI and on a locally hosted machine (for local or private testing, for example).

It does not cover:

* ProvJS-related operations.
* ProvToolbox also has a persistence layer and it would be useful if tests could exercise this in future. The infrastructure harness should not preclude this.

However, the design does not preclude either of these. Rather than a single monolithic test harness, these can be implemented as separate test suites in Jasmine, Grunt or Karma (for ProvJS) or JUnit (for ProvToolbox).

For:

> Converters and comparators are expected to be command line executable.

This design allows for both command-line and non-command line converters (and comparators as will be shown below) to be implemented as sub-classes (as demonstrated by the REST converter classes).

---

## Implementation language

The test harness can be implemented in Python or Java but I think Python will be less heavyweight, and remove the need to compile the test harness itself before execution.

The configuration files can be expressed in JSON. However, [YAML](http://yaml.org/) (YAML Ain't Markup Language) is simple human-readable file format, which can express dictionaries and lists and is a superset of JSON.

**Question:** ProvPy supports Python 2.6, 2.7, 3.3, 3.4 and pypy. Is there any requirement for the interoperability test harness to support these multiple Python versions? ProvPy itself is already tested under multiple Python versions. For interoperability testing I'd assume it only needs to run under one version (e.g. 3.4) be assumed? This would makes implementation and maintenance easier.

---

## Implementation plan

Phase 1:

* ConfigurableComponent, Converter, ProvPyConverter, ProvToolboxConverter.
* Comparator and a SimpleComparator class which just checks if the output file exists.
* InteroperabilityTest
* InteroperabilityHarness
* Utility classes required for the above.
* Unit test classes for the above.
* Test cases GitHub repository, populated with documents produced using ProvToolbox.
* Travis CI job.
* Jenkins job.

Phase 2:

* ProvTranslatorConverter, ProvStoreConverter and supporting classes.
* ProvPyComparator, ProvToolboxComparator and supporting classes.
* Additional utility classes required for the above.
* Additional unit test classes for the above.
* Updates to existing classes and jobs.

Phase 3:

* ServiceTest, ProvValidatorTest, ProvTranslatorTest, ProvStoreTest.

Phase 4 (optional):

* Consider how to remove/reduce duplication between converters and comparators
  - e.g. between ProvPyConverter and ProvPyComparator.
  - Pull out commonality into helper classes.
  - Use multiple inheritance.

---

## Packages and technologies useful for implementation

### Python subprocess

Python [subprocess](https://docs.python.org/2/library/subprocess.html) package can invoke command-line tools and capture return codes, output and error streams e.g.

```
cmd = ["./prov/scripts/prov-convert", "-f", "xml", "in.json", "out.xml"]
stdout = open("stdout.txt", "w")
stderr = open("stderr.txt", "w")
result = subprocess.call(cmd, stdout=stdout, stderr=stderr)
stdout.close()
stderr.close()
```

### Python requests

Python [requests](http://docs.python-requests.org/en/latest/) package provides an HTTP library which can be used to invoke REST endpoints e.g.

```
url = 'https://provenance.ecs.soton.ac.uk/validator/provapi/documents/'
headers = {'Content-type': 'application/json', 'Accept': 'text/turtle'}
payload={"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}
r = requests.post(url, headers=headers, data=json.dumps(payload))
print("{} {}".format(r.request.method, r.request.url))
print(r.request.headers.items())
print(r.request.body)
print("Status: {}".format(r.status_code))
print(r.headers)
print("History: {}".format(r.history))
print("Text:")
print(r.text)
```

Automatic redirects can be disabled if desired e.g.

```
headers = {'Content-type': 'application/json'}
r = requests.post(url, headers=headers, data=json.dumps(payload), allow_redirects=False)
url = r.headers['location']
headers = {'Accept': 'text/turtle'}
r = requests.get(url, headers=headers, allow_redirects=False)
url = r.headers['location']
r = requests.get(url, allow_redirects=False)
```

Originally recommended in [Communicating with RESTful APIs in Python](http://isbullsh.it/2012/06/Rest-api-in-python/).

To install:

```
$ pip install requests[security]
```

### YAML

[YAML](http://yaml.org/) (YAML Ain't Markup Language) is simple human-readable file format. It can express dictionaries and lists.

```
---
a: 123
b: 456
c:
  c1: 1
  c2: 2
  c3: 3
d:
  - e: 10
  - e: 20
  - e: 30
```

Syntax:

* `---` indicates the start of a document.
* `:` denotes a dictionary. `:` must be followed by a space.
* `-` denotes a list.

JSON can be considered a subset of YAML (see [YAML version 1.2](http://yaml.org/spec/1.2/spec.html)).

### Python yaml

Python [yaml](http://pyyaml.org/wiki/PyYAML) library provides a YAML parser.

Example of yaml and json:

```
import yaml
import json

with open('file.yaml','r') as f:
data = yaml.load(f)
print("----Data----")
print(data)
print(data['a'])
print("----YAML----")
print(yaml.dump(data))
print("----JSON----")
json_doc = json.dumps(data)
print(json_doc)
print("----JSON via YAML----")
data = yaml.load(json_doc)
print(data)
print(data['a'])
```

To install:

```
$ pip install pyyaml
```

### Python 3.4 sub-tests

Python 3.4 [sub-tests](https://docs.python.org/dev/library/unittest.html#distinguishing-test-iterations-using-subtests).

```
import unittest

class SimpleSubTest(unittest.TestCase):

  def test_converters(self):
    for converter in ["Py", "Toolbox"]:
      for testcase in range(0, 4):
        for pairs in [["xml", "json"], ["rdf", "provn"]]:
          id = "TEST " + converter + " " + str(testcase) + " " + str(pairs)
          print(id)
          with self.subTest(id=id):
            ...do something...
            self.assertEqual(..., ...)
```

The subTest block will be run for 16 iterations and failures logged. The test framework considers this to be a single test as it involves one invocation of test_converters.

### Python nose test generators

Python's [nose](https://nose.readthedocs.org/) library [test generators](http://nose.readthedocs.org/en/latest/writing_tests.html#test-generators).

```
import nose.tools

class TestGenerators:

  def test_converters(self):
    for converter in ["Py", "Toolbox"]:
      for testcase in range(0, 4):
        for pairs in [["xml", "json"], ["rdf", "provn"]]:
          yield self.check_convert, converter, testcase, pairs

  def check_convert(self, converter, testcase, pairs):
    id = "TEST " + converter + " " + str(testcase) + " " + str(pairs)
    print(id)
    ...do something...
    nose.tools.assert_equal(..., ...)
```

check_convert will be run for 16 iterations and failures logged. The test framework considers this to be 16 tests - test_converters is considered to be a test generator.

From the nose user documentation:

> Please note that method generators are not supported in unittest.TestCase subclasses.
