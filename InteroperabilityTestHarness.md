# Interoperability test harness design

Mike Jackson, The Software Sustainability Institute / EPCC, The University of Edinburgh based on requirements from Trung Dong Huynh, Electronics and Computer Science, University of Southampton.

## Format

Proposed classes and functions are expressed in Python-style syntax, but this does not preclude the use of other languages e.g. Java.

Proposed configuration files are expressed using YAML, but this does not preclude the use of other notations e.g. JSON or XML.

## Objectives

The objective of this collaboration is to develop a test infrastructure which systematically checks convertibility and round-trip conversions across combinations of Provenance Tool Suite packages and services operating collectively. This includes testing of:

* Round-trip interoperability between ProvPy and ProvToolbox.
* Round-trip interoperability between ProvPy and ProvToolbox and deployed ProvStore, ProvTranslator and ProvValidator services whether these be deployed locally, on a developer's own machine, or remotely.
* ProvJS-related operations.
* Command-line utilities that are provided within ProvToolbox (e.g. provconvert).

ProvToolbox also has a persistence layer and it would be useful if tests could exercise this in future. The infrastructure harness should not preclude this.

Testing of closed source packages and a private test infrastructure (e.g. hosted on a local machine, rather than Travis CI) are also desirable, so, any tests should be runnable both under Travis CI and on a locally hosted machine (for local or private testing, for example).

---

## Round-trip interoperability tests

The round-trip interoperability tests are intended to make sure that Provenance Tool Suite tools and services support all PROV representations (as specified by test cases, see below) and maintain their semantics across all supported PROV representations.

### Test cases

A single test case consists of a set of files, where each file holds a document in one of the PROV representations:

| Representation  | Extension     |
| --------------- | ------------- |
| PROV-N          | .provn        |
| PROV-O (Turtle) | .ttl          |
| PROV-O (TriG)   | .trig         |
| PROV-XML        | .provx        |
| PROV-JSON       | .json         |

For example, a test case whose name is testcase1 consists of the files testcase1.provn, testcase1.xml, testcase1.json, testcase1.ttl, and testcase1.trig (where applicable, see below). Each document within a single test case is semantically equivalent to the others within the same test case.

Some test cases will only have files for a subset of representations, as there are cases that can't be validly encoded in a particular representation (e.g. XML). If a file for a specific representation is absent, then it can be assumed that conversions to and from that representation do not need to be tested for that test case. For example, the absence of testcase1.xml means that conversions to XML from testcase1.ttl do not need to be tested.

The test cases will be curated manually and published in a Github repository. They will be maintained as a community resource for interoperability tests

The test cases will initially populated from the test output files produced by ProvToolbox. The test cases will be gradually updated over time as needed.

### Test procedure

The procedure for testing a converter (one of the tools - prov-convert from ProvPy or provconvert from ProvToolbox - or services - ProvStore or ProvTranslator) using a test case is as follows:
 
* A converter translates testcase1.<ext_in> (from the test case) to converted_testcase1.<ext_out>.
* A comparator compares testcase1.<ext_out> to converted_testcase1.<ext_out> for equivalence => success | fail.

Comparator are deemed to be both authoritative and correct. They may need test cases of their own in future, but this is out of scope at present

Comparators do not need to understand PROV concepts e.g. those that compare XML or RDF documents.

ProvPy 1.3.2 available on [pypi](https://pypi.python.org/pypi/prov) (or in the [1.3.2](https://github.com/trungdong/prov/tree/1.3.2) tag in the [prov](https://github.com/trungdong/prov/tree/1.3.2) repository) has a prov-compare script.

provcompare, based on ProvToolbox, may be implemented at a later date.

Both converters and comparators are assumed to be either executable from the command-line (for tools) or via REST operations (for services).

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
  def get_input_formats():
    Return list of input formats supported by the converter.
  def get_output_formats():
    Return list of output formats supported by the converter.
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

ProvPy's prov-convert returns an exit code of 2 if there is no input file, the input file is not a valid PROV document or the output format is not supported. For these last two situations, it will create an empty output file. However, the exit codes can be used to check for conversion failures.

ProvToolbox's provconvert returns an exit code of 1 if there is no input file, the input file is not a valid PROV document or the input file format is not supported. It returns an exit code of 0 if successful or, problematically, if the output file format is not supported. However, it does not create any output files if any file or file format is invalid, so that allows for conversion failures to be detected.

Configuration includes information required to invoke the converter. For command-line converters:

* ProvPyConverter:
  - Path to executable e.g. /home/user/prov/scripts
  - Executable name e.g. prov-convert
  - Command-line argument list with output format and input and output files represented by tokens e.g. [-f, PROV_FORMAT, PROV_INPUT, PROV_OUTPUT]
  - Input formats e.g. [provn, provx, json]
  - Output formats e.g. [provn, provx, json]
* ProvToolboxConverter:
  - Path to executable e.g. /home/user/provToolbox/bin
  - Executable name e.g. provconvert
  - Command-line argument list with input and output files represented by tokens e.g. [-infile, PROV_INPUT, -outfile, PROV_OUTPUT]
  - Input formats e.g. [provn, ttl, trig, provx, json]
  - Output formats e.g. [provn, ttl, trig, provx, json]

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
  - Input formats e.g. [provn, ttl, trig, provx, json]
  - Output formats e.g. [provn, ttl, trig, provx, json]

* ProvStoreConverter:
  - REST endpoint for POST request e.g. https://provenance.ecs.soton.ac.uk/store/api/v0/documents/
  - API key for authenticating with ProvStore e.g. mikej888:XXXXXXXX.
  - Input formats e.g. [provn, ttl, trig, provx, json]
  - Output formats e.g. [provn, ttl, trig, provx, json]

### Comparators

Comparators are represented by a base class:

```    
class Comparator(ConfigurableComponent):
  def get_formats():
    Return list of formats supported by the comparator.
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

Comparator sub-class configuration is the same as that for the corresponding converter sub-classes. However, instead of input and output formats it lists the formats that the comparator can compare:

* ProvPyComparator:
  - Formats e.g. [provx, json]
* ProvToolboxComparator:
  - Formats e.g. [provn, ttl, trig, provx, json]

### Supported formats and file extensions

There is inconsistency in how certain converters handle file extensions. For example ProvPy's prov-convert can handle .provx XML documents, but expects the documents to have the extension .xml. Similarly for ProvStore. 

The canonical list of file format types is [provn, ttl, trig, provx, json]. Mapping these to converter or comparator-specific variants (e.g. using .xml in place of .provx) is the responsibility of the sub-classes that manage invocation of those components.

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

There are 5 PROV representations giving a possible 120 (ext_in, ext_out) pairs per test cases. If there are N test cases, that implies there are 120*N possible tests that could be run for each of the 4 converters. Providing a test function for each of these tests is unscalable. As all tests confirm to the same pattern:

* A converter translates testcase1.<ext_in> (from the test case) to converted_testcase1.<ext_out>.
* A comparator compares testcase1.<ext_out> to converted_testcase1.<ext_out> for equivalence => success | fail.

a generic test class is used, with sub-classes for each converter:

```
class ConverterInteropTest
  def test_interoperability(self, specification, comparators):
    specification is a converter specification.
    comparators is a dictionary of Comparators indexed by format.
    Use specification to create and configure the Converter.
    FOR EACH test_case NOT IN skip-tests:
      Enumerate set of (ext_in, ext_out) pairs based on test_case formats.
      Enumerate set of (ext_in, ext_out) pairs based on converter input and output formats.
      FOR EACH (ext_in, ext_out) pair IN intersection of sets:
        convertor.convert(test_case.ext_in, ext_in, converted.ext_out, ext_out).
        Get comparator for ext_out from comparators
        comparator.compare(test_case.ext_out, ext_out, converted.ext_out, ext_out)
        Record comparator result.

class ProvPyInteropTest(ConverterInteropTest):
  def test_interoperability(self, comparators, tests):
    Create and configue ProvPyConverter
    Call test_interoperability()
class ProvToolboxInteropTest(ConverterInteropTest):
  def test_interoperability(self, comparators, tests):
    As above, for ProvToolboxConverter.
class ProvTranslatorInteropTest(ConverterInteropTest):
  def test_interoperability(self, comparators, tests):
    As above, for ProvTranslatorConverter.
class ProvStoreInteropTest(ConverterInteropTest):
  def test_interoperability(self, comparators, tests):
    As above, for ProvStoreConverter.
```

Each converter has its own specification expressed as [YAML](http://yaml.org/) (YAML Ain't Markup Language): 

```
---
ProvPyConverter: 
  class: prov.interop.converter.ProvPyConverter
  directory: /home/user/prov/scripts
  executable: prov-convert
  arguments: [-f, PROV_FORMAT, PROV_INPUT, PROV_OUTPUT]
  inputs: [provn, provx, json]
  outputs: [provn, provx, json]
  skip-tests: [1, 4]
```
```
---
ProvToolboxConverter: 
  class: prov.interop.converter.ProvToolboxConverter
  directory: /home/user/provToolbox/bin
  executable: provconvert
  arguments: [-infile, PROV_INPUT, -outfile, PROV_OUTPUT]
  inputs: [provn, ttl, trig, provx, json]
  outputs: [provn, ttl, trig, provx, json]
  skip-tests: [2, 5, 6]
```
```
---
ProvTranslatorConverter:
  class: prov.interop.converter.ProvTranslatorConverter
  url: https://provenance.ecs.soton.ac.uk/validator/provapi/documents/
  inputs: [provn, ttl, trig, provx, json]
  outputs: [provn, ttl, trig, provx, json]
  skip-tests: []
```
```
---
ProvStoreConverter:
  class: prov.interop.converter.ProvTranslatorConverter
  url: https://provenance.ecs.soton.ac.uk/store/api/v0/documents/
  api_key: mikej888:XXXXXXXX
  inputs: [provn, ttl, trig, provx, json]
  outputs: [provn, ttl, trig, provx, json]
  skip-tests: [3]
```

The specification describes everything needed to create and configure the converter (as discussed in Converters, see above). It also specifies skip-tests, the test cases that, for whatever reason, are not applicable for this converter. For example, if there is a known issue that cannot be addressed immediately.

The test harness configuration specifies the available comparators for each format (see below).

### Test harness configuration

Test harness configuration includes:

* Location of test case files.
* Location of converter specification files, holding the converter specifications (see above).
* Comparator-specific information. This includes everything needed to create and configure a comparator (as discussed in Comparators, see above).

For example, in YAML:

```
---
test-cases: /home/user/interop/test-cases
converter-tests:
 ProvPy: /home/user/interop/provpy.yaml
 ProvToolBox: /home/user/interop/provtoolbox.yaml
 ProvTranslator: /home/user/interop/provtranslator.yaml
 ProvStore: /home/user/interop/provstore.yaml
comparators:
  ProvPyComparator: 
    class: prov.interop.comparator.ProvPyComparator
    directory: /home/user/prov/scripts
    executable: prov-convert
    arguments: [-f, PROV_FORMAT, PROV_INPUT, PROV_OUTPUT]
    formats: [provx, json]
  ProvToolboxComparator: 
    class: prov.interop.comparator.ProvToolboxComparator
    directory: /home/user/provToolbox/bin
    executable: provconvert
    arguments: [-infile, PROV_INPUT, -outfile, PROV_OUTPUT]
    formats: [provn, ttl, trig, provx, json]
```

Class to configure test harness:

```
class InteroperabilityConfiguration
  def __init__(self):
    Initialise dictionary mapping comparator names to instances.
    Initialise dictionary mapping formats to Comparator instances.
  def register_components(self, components):
    components is a dictionary of components and their configurations.
    FOR EACH component IN components:
      Get configuration for component.
      Get component name and class name from configuration.
      Call ReflectionUtilities.getInstance(class name) to get component instance.
      Call component.configure(configuration).
      Add to dictionary mapping component names to instances.
  def initialize(self, configuration):
    configuration holds test harness configuration.
    Get comparator configuration from configuration.
    Call register_components(comparator configuration) to populate comparators dictionary.
    FOR EACH comparator IN comparators dictionary:
      Get formats supported by comparator.
      Update dictionary mapping formats to Comparator instances.
    Set variable with test-cases from configuration.
    Set variable with converter-tests from configuration.
```

### Converter/comparator name-to-class mapping

There are three options for mapping converter and comparator names, as cited in configuration files, to their associated modules and classes:

1. A factory class hard-codes these mappings.
  - Given a converter/comparator name (e.g. ProvPyComparator) it creates the associated object (e.g. prov.interop.comparator.ProvPyComparator).
  - The factory class needs to import the modules where the classes are defined.
2. Configuration files map shorthand names to module and class names.
  - Reflection is used to dynamically import modules and create objects from class names.
  - Shorthand names are defined for converters and comparators (e.g. ProvPyConvert). These shorthand names are used in the test specification files.
  - More flexible and extensible than 1.
  - See the configuration examples above.
3. Convertor and comparator class names are cited in test specification.
  - As above, reflection can be used. 
  - No need for a mapping from shorthand names to module and class names.
  - For example, note how the module and class name is used as the comparator name directly:

```
comparators:
  prov.interop.comparator.ProvPyComparator:
    directory: /home/user/prov/scripts
    executable: prov-convert
    arguments: [-f, PROV_FORMAT, PROV_INPUT, PROV_OUTPUT]
    ...
```

Option 2 is preferred since it allows the use of short-hand names which can be used within logging information or exceptions. The sample configurations presented earlier adopt this option.

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

### Test harness execution

The test harness will be implemented in such a way that it supports execution via an xUnit test framework for the chosen implementation language e.g. for Python:

```
$ python -m unittest prov.interop.ProvPyInteropTest
$ python -m unittest prov.interop.ProvToolboxInteropTest
```

or,

```
$ nosetests prov.interop.ProvPyInteropTest
$ nosetests prov.interop.ProvToolboxInteropTest
```

This will determine the exact nature of the implementation of, and interaction between, the InteroperabilityTest and InteroperabilityConfiguration classes.

Adopting this approach means that xUnit framework support for test logging and report generation can be exploited.

### Integration with an xUnit test framework

The design supports just one test function, per converter, which either succeeds (if every test in the interoperability test specification passes) or fails (if any one fails). 

Running this under an xUnit test framework would result in a report that only 1 test has been run for a converter, corresponding to the single test function (regardless of the number of conversions done and validated). For example, for Python the output would be something like:

```
$ python -m unittest prov.interop.ProvPyInteropTest
.
----------------------------------------------------------------------
Ran 1 test in 1.000s

OK
```

If using nosetests to run all 4 interoperability test classes for converter, then just 4 tests, one per converter test class, are reported as having run:

```
$ nosetests
.....
----------------------------------------------------------------------
Ran 4 tests in 1.000s

OK
```

While this is not ideal, it is acceptable. The test framework should output extra logging for each test case it runs. 

However, it is important to know all the cases that fail, and for which pair(s) of representations. This knowledge may provide clues as to what the issue is. The test function should be implemented in a way so that failures report the specific comparison that failed. 

Stopping a whole test suite when one case fails is not acceptable. There are ways of addressing this:

* Python 3.4 introduced [sub-tests](https://docs.python.org/dev/library/unittest.html#distinguishing-test-iterations-using-subtests) which would allow the tests for other test cases to run even if one test case failed. However, this still logs only one test function as having run.
* Python's nose library supports [test generators](http://nose.readthedocs.org/en/latest/writing_tests.html#test-generators) which allows iteration of a single test function across a range of parameters. An advantage over sub-tests is that it records each iteration as a separate invocation of the test function.
* Java's JUnit 4 supports [parameterized unit tests](http://junit.sourceforge.net/javadoc/org/junit/runners/Parameterized.html) which allow a test function to be run for each element in a user-defined test data generator.

There are also solutions that involve dynamic code creation, for example:

* [Dynamically generating Python test cases](http://eli.thegreenplace.net/2014/04/02/dynamically-generating-python-test-cases)
* [Gold/approved file testing all methods in a test class against every file in a directory via metaclass metaprogramming in Python](https://gist.github.com/patkujawa-wf/1f569d245bbfc73f83a3)

### Running within Travis CI or Jenkins

The design when implemented will be runnable under either Travis CI or Jenkins.

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

class InteroperabilityConfiguration
```

---

## Deployment Readiness Tests

Tests in this section are to assure new deployment will work as expected before replacing the live services (i.e. ProvStore, ProvValidator, ProvTranslator).

### ProvStore and ProvTranslator Integrity

ProvStore and ProvTranslator should be treated as a converter in the interoperability tests. In this case, the converter will use REST API to submit/retrieve documents from the interoperability test cases to/from a configurable API endpoint.

This is already covered in the foregoing design for the round-trip interoperability test harness. The configurable API endpoint can be set to be a live service, once deployed, or a local service, prior to going live.

### Function Operationality

There is a need to check that all functions and services work, running basic requests without error. For example, checking that they return 2xx/3xx HTTP responses rather than 4xx or 5xx. These can form a test suite for monitoring live services on a regular basis.

This is orthogonal to the the round-trip interoperability test harness.

A simple design is a test class-per-service, where each test function submits one request:

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

The design covers:

* A test infrastructure, which systematically checks convertibility and round-trip conversions across combinations of Provenance Tool Suite packages and services operating collectively.
* Round-trip interoperability between ProvPy and ProvToolbox.
* Round-trip interoperability between ProvPy and ProvToolbox and deployed ProvStore, ProvTranslator and ProvValidator services whether these be deployed locally, on a developer's own machine, or remotely.
* Testing of closed source packages and a private test infrastructure (e.g. hosted on a local machine, rather than Travis CI) are also desirable, so, any tests should be runnable both under Travis CI and on a locally hosted machine (for local or private testing, for example).

The design allows for both command-line and non-command line (e.g. REST-based service) converters and comparators to be tested and used.

The design does not cover:

* ProvJS-related operations.
* ProvToolbox also has a persistence layer and it would be useful if tests could exercise this in future. The infrastructure harness should not preclude this.

However, the design does not preclude either of these. Rather than a single monolithic test harness, these can be implemented as separate test suites in Jasmine, Grunt or Karma (for ProvJS) or JUnit (for ProvToolbox).

---

## Implementation language

The test harness can be implemented in Python or Java but I think Python will be less heavyweight, and remove the need to compile the test harness itself before execution.

The configuration files can be expressed in JSON. However, [YAML](http://yaml.org/) (YAML Ain't Markup Language) is simple human-readable file format, which can express dictionaries and lists and is a superset of JSON.

### Python test harness implementation and ProvPy

ProvPy supports Python 2.6, 2.7, 3.3, 3.4 and pypy. There is a about different behaviours in Python 2.x and 3.x with respect to handling strings. It is unclear whether ProvPy's prov-convert tool outputs the same results in both environments. As a result, the test harness must be able to run ProvPy's prov-convert tool under a Python 2.x and a Python 3.x version. 

If implementing the test harness under Python this then requires one of two implementation approaches to be adopted:

1. Implement the test harness such that it can run under both Python 2.x and Python 3.x. See, for example, [Supporting Python 2 and 3 without 2to3 conversion](http://python3porting.com/noconv.html).
2. As the test harness treats ProvPy's prov-convert tool as a command-line executable (and is not aware that it is implemented in Python) specify the version of Python to use, when running it via the command line. The Python environment on which the test harness run can be separate from that of ProvPy. This is how, for example, the [tox](https://testrun.org/tox) package manages the execution of tests on different versions of Python).

[pyenv](https://github.com/yyuu/pyenv) allows for multiple Python versions to be installed and used. As described in [Coosing the Python version](https://github.com/yyuu/pyenv#choosing-the-python-version):

> You can activate multiple versions at the same time, including multiple versions of Python2 or Python3 simultaneously. This allows for parallel usage of Python2 and Python3, and is required with tools like tox.

---

## Implementation plan

Phase 1 - ProvPy and ProvToolbox:

* ConfigurableComponent.
* Converter, ProvPyConverter, ProvToolboxConverter.
* Comparator, SimpleComparator (a simple class that just tests if a file exists), ProvPyComparator.
* InteroperabilityTest, ProvPyInteropTest, ProvToolboxInteropTest
* InteroperabilityConfiguration
* Utility classes required for the above.
* Unit test classes for the above.
* Test cases GitHub repository, populated with documents produced using ProvToolbox.
* Travis CI job.
* Jenkins job plus documentation on how to configure and run Jenkins with this job
  - Example on an Ubuntu virtual machine, running under VMWare 

Phase 2 - ProvTranslator and ProvStore

* ProvTranslatorConverter, ProvStoreConverter and supporting classes.
* ProvTranslatorInteropTest, ProvStoreInteropTest.
* Additional utility classes required for the above.
* Additional unit test classes for the above.
* Updates to existing classes and jobs.

Phase 3 - services.

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
