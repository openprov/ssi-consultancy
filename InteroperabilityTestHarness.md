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

**Implementation**

* The code assumes that:
  - Test case directories must be of form: `testcaseNNNN`
  - Test case files must be of form: `NAME.[provx | provn | json | ttl | trig]` - but there is no need for these to be named `testcase`.

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

**Implementation - prov_interop.component**

* load_configuration
  - Load configuration from a YAML file.
  - Either a file name can be provided, or sought for in an environment variable, or a default file name used.
* ConfigurableComponent
  - Property with configuation provided to configure.
* CommandLineComponent(ConfigurableComponent)
  - New class.
  - configure checks for "executable" and "arguments" in configuration.
  - These are assumed to be strings and are converted (using a string split) into lists internally.
* RestComponent(ConfigurableComponent)
  - New class.
  - configure checks for "url" in configuration.
* Tests - prov_interop.tests_test_component
  - LoadConfigurationTestCase
  - ConfigurableComponentTestCase
  - CommandLineComponentTestCase
  - RestComponentTestCase

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

**Implementation - prov_interop.converter**

* Converter
  - get_input_formats renamed to input_formats.
  - get_output_formats renamed to output_formats.
  - configure checks for "input-formats" and "output-formats" in configuration and that these contain valid input and output formats (see prov_interop.standards below).
  - convert has signature convert(self, in_file, out_file) with file extensions use to deduce input and output formats.
  - convert checks input file exists.
* Tests - prov_interop.tests_test_converter
  - ConverterTestCase

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

**Implementation - prov_interop.provpy.converter**

* ProvPyConverter
  - Defines LOCAL_FORMATS, mapping standards.PROVX ("provx") to "xml", the format specification expected by prov-convert.
  - configure checks for "FORMAT", "INPUT" and "OUTPUT" in "arguments" configuration value.
  - convert has signature matching Converter.convert.
  - convert does not capture standard input or output - these are just left to be printed as-is.
  - convert uses in_file extension and LOCAL_FORMATS to get value for prov-convert's -f FORMAT command-line value.
* Tests - prov_interop.tests.provpy.test_converter
  - ProvPyConverterTestCase
    - Uses prov_interop.tests.provpy.prov-convert-dummy.py script which mimics return codes of prov-convert.

**Implementation - prov_interop.provtoolbox.converter**

* ProvToolboxConverter
  - configure checks for "INPUT" and "OUTPUT" in "arguments" configuration value.
  - convert has signature matching Converter.convert.
  - convert does not capture standard input or output - these are just left to be printed as-is.
* Tests - prov_interop.tests.provtoolbox.test_converter
  - ProvToolboxConverterTestCase
    - Uses prov_interop.tests.provtoolbox.provconvert-dummy.py script which mimics return codes of provconvert.

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

**Implementation - command-line component configuration**

* Removed notion of path to executable and executable name.
* Removed notion of lists for executables and arguments - they are just plain-text that are internally split into lists.
* Allows flexibility for prov-convert and prov-compare e.g. executable can be "prov-convert" or "python prov-convert" depending upon whether package or source is used.

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

**Implementation - prov_interop.provtranslator.converter**

* ProvTranslatorConverter
  - Defines CONTENT_TYPES, mapping standards.FORMATS (e.g. standards.PROVX) to content types (e.g. application/provenance+xml)
  - convert has signature matching Converter.convert.
  - convert uses in_file extension and out_file extension with CONTENT_TYPES to set ContentType and Accept.
* Tests - prov_interop.tests.provtranslator.test_converter
  - ProvTranslatorConverterTestCase
    - Uses [requests-mock](https://pypi.python.org/pypi/requests-mock) for mock object testing, to mimic REST endpoint being available

**Implementation - prov_interop.provstore.converter**

* ProvStoreConverter
  - Defines CONTENT_TYPES, mapping standards.FORMATS (e.g. standards.PROVX) to content types (e.g. applicationxml)
  - configure checks for "AUTHORIZATION" in "arguments" configuration value which is expected to hold value for Authorization request header e.g. ApiKey mikej888:XXXXXXXX
  - convert has signature matching Converter.convert
  - convert uses in_file extension and out_file extension with CONTENT_TYPES to set ContentType and Accept
* Tests - prov_interop.tests.provstore.test_converter
  - ProvStoreConverterTestCase
    - Uses [requests-mock](https://pypi.python.org/pypi/requests-mock) for mock object testing, to mimic REST endpoint being available

**Implementation - prov_interop.http**

* New class introduced to hold constants for HTTP header fields e.g. Content-Type, Accept, Authorization

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

**Implementation - prov_interop.comparator**

* Comparator
  - get_formats renamed to formats.
  - configure() checks for "formats" in configuration and that these contain valid input and output formats (see prov_interop.standards below).
  - compare() has signature compare(self, file1, file2) with file extensions use to deduce input and output formats.
  - compare() checks both files exist.
* Tests - prov_interop.tests_test_comparator
  - ComparatorTestCase

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

**Implementation - prov_interop.provpy.comparator**

* ProvPyComparator
  - Defines LOCAL_FORMATS, mapping standards.PROVX ("provx") to "xml", the format specification expected by prov-compare.
  - configure checks for "FORMAT1", "FORMAT2", "FILE1" and "FILE2" in "arguments" configuration value.
  - convert has signature matching Comparator.compare.
  - compare does not capture standard input or output - these are just left to be printed as-is.
  - compare uses file1 and file2 extensions and LOCAL_FORMATS to get values for prov-compare's -f FORMAT1 and -F FORMAT2 command-line values.
* ProvToolboxComparator
  - Not implemented, as does not yet exist.
* Tests - prov_interop.tests.provpy.test_comparator
  - ProvPyComparatorTestCase
    - Uses prov_interop.tests.provpy.prov-compare-dummy.py script which mimics return codes of prov-compare.

Command-line comparators, invoked by these classes, need to exit with a non-zero exit code in case of a non-equivalent pair of files being given, or another error arising (e.g. no such file). The error code for a non-equivalent pair should differ from that for other errors (e.g. missing input file). prov-compare satisfies this requirement.

Comparator sub-class configuration is the same as that for the corresponding converter sub-classes. However, instead of input and output formats it lists the formats that the comparator can compare:

* ProvPyComparator:
  - Formats e.g. [provx, json]
* ProvToolboxComparator:
  - Formats e.g. [provn, ttl, trig, provx, json]

### Supported formats and file extensions

There is inconsistency in how certain converters handle file extensions. For example ProvPy's prov-convert can handle .provx XML documents, but expects the documents to have the extension .xml. Similarly for ProvStore. 

The canonical list of file format types is [provn, ttl, trig, provx, json]. Mapping these to converter or comparator-specific variants (e.g. using .xml in place of .provx) is the responsibility of the sub-classes that manage invocation of those components.

**Implementation - prov_interop.standards**

* Defines constants for each PROV standard file extension (provn, ttl, trig, provx, json) and a constant, FORMATS, holding all of these.

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

**Implementation**

* These are not needed as they are too heavyweight.
* CommandLineComponents just invoke subprocess.call directly.

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

**Implementation**

* See RestComponent above
* No need for this class as requests package provides suitable functions
* RestResult not needed

Exception classes:

```
class ConfigError(Exception):
class ComparatorError(Exception):
class ConvertorError(Exception):
class CommandLineError(Exception):
class RestError(Exception):
```

**Implementation**

* prov_interop.component.ConfigError
* prov_interop.comparator.ComparisonError
* prov_interop.converter.ConversionError
* CommandLineError and RestError are not necessary.

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

**Implementation - prov_interop.interop_tests.harness**

* New module to bootstrap test harness.
* PROV_HARNESS_CONFIGURATION - environment variable with configuration file name.
* localconfig/harness.yaml - default configuration file name.
* initialise_harness_from_file(file_name)
  - If file_name is not None, then it is assumed to hold the test harness configuration file
  - Else, if an environment variable CONFIGURATION_FILE_ENV is defined, then this environment variable is assumed to hold the configuration file.
  - Else localconfig/harness.yaml is used as a configuration file.
  - Configuration file is assumed to be a YAML file.
  - Configuration is loaded.
  - HarnessResources instance is created and configured using the configuration.

**Implementation - prov_interop.interop_tests.converter**

* Bootstraps the test harness by importing prov_interop.interop_tests.harness.
* test_case_name
  - nose-parameterized callback function used to create test function names of form test_case_N_EXTIN_EXTOUT (e.g. test_case_1_provx_json)
* ConverterInteropTest renamed to ConverterTestCase(TestCase)
  - Annotated using nose @istest to ensure it is not, itself, treated as a test class.
  - configure(self, env_var, default_file_name) called by sub-classes to load a Converter's configuration:
    - Assumes HarnessResources has been initialised by prov_interop.interop_tests.harness.
    - If HarnessResources.configuration has key matching Converter's class name, then its value is assumed to be a configuration file for the Converter.
    - Else, if an environment variable with the name in env_var is defined, then this environment variable is assumed to hold the configuration file.
    - Else default_file_name is used as the configuration file.
    - Configuration file is assumed to be a YAML file, with an entry keyed using the class name of the Converter (e.g. ProvPyConverter) 
    - Configuration file is loaded and the values under the converter's key used to configure the Converter via Converter.configure.
    - Configuration loaded from file also checked for "skip-tests" entry - if present, then these are recorded.
  - test_interoperability renamed to test_case.
    - Annotated using nose-parameterized @parameter with callback to prov_interop.interop_tests.harness.harness_resources.test_cases to auto-generate test methods for specific test-case, ext_in, ext_out combinations.
    - Raises nose's Skip error if test case number in Converter's "skip-tests".
    - Raises nose's Skip error if ext_in or ext_out not in Converter's "input-formats" or "output-formats".
    - Does the conversion or comparison as described in the design above/
* test_provpy.ProvPyTestCase(ConverterTestCase)
  - Annotated using nose @istest to ensure it is treated as a test class.
  - Renaming of ProvPyInteropTest.
  - PROVPY_TEST_CONFIGURATION - environment variable with configuration file name.
  - localconfig/provpy.yaml - default configuration file name.
  - setUp creates ProvPyConverter then calls super.setUp with envivonment variable and default configuration file names.
* test_provtoolbox.ProvToolboxTestCase(ConverterTestCase)
  - Annotated using nose @istest to ensure it is treated as a test class.
  - Renaming of ProvToolboxInteropTest.
  - PROVTOOLBOX_TEST_CONFIGURATION - environment variable with configuration file name
  - localconfig/provtoolbox.yaml - default configuration file for ProvToolboxConverter.
  - setUp creates ProvToolboxConverter then calls super.setUp with envivonment variable and default configuration file names.
* test_provtranslator.ProvTranslatorTestCase(ConverterTestCase)
  - Annotated using nose @istest to ensure it is treated as a test class.
  - Renaming of ProvTreanslatorInteropTest.
  - PROVTRANSLATOR_TEST_CONFIGURATION - environment variable with configuration file name
  - localconfig/provtranslator.yaml - default configuration file for ProvTranslatorConverter.
  - setUp creates ProvTranslatorConverter then calls super.setUp with envivonment variable and default configuration file names.
* test_provstore.ProvStoreTestCase(ConverterTestCase)
  - Annotated using nose @istest to ensure it is treated as a test class.
  - Renaming of ProvTreanslatorInteropTest.
  - PROVSTORE_TEST_CONFIGURATION - environment variable with configuration file name
  - localconfig/provstore.yaml - default configuration file for ProvStoreConverter.
  - setUp creates ProvStoreConverter then calls super.setUp with envivonment variable and default configuration file names.

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

**Implementation**

* "class" property is not needed.
* As mentioned earlier, there is no "directory" property.
* Configuration for ProvPyConverter depend on whether ProvPy source or package are used e.g. source:

```
---
ProvPyConverter: 
  ...
  executable: python /disk/ssi-dev0/home/mjj/ProvPy/scripts/prov-convert 
  ...
```

* e.g. package:

```
---
ProvPyConverter: 
  ...
  executable: prov-convert
  ...
```

* ProvStoreConverter configuration now defines "authorization", not "api-key", so the relationship to the HTTP request is clearer

```
authorization: ApiKey mikej888:XXXXXXXX
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

**Implementation**

* As mentioned earlier, there is no "directory" property needed for CommandLineComparators.
* As mentioned below, "converter-tests" is not used. Rather, any configuration required by converter-specific interoperability tests can be provided via optional values indexed by converter-class names e.g.:

```
ProvPyConverter: /home/user/provtoolsuite-interop-test-harness/localconfig/provpy.yaml
ProvToolboxConverter: /home/user/provtoolsuite-interop-test-harness/localconfig/provtoolbox.yaml
ProvTranslatorConverter: /home/user/provtoolsuite-interop-test-harness/localconfig/provtranslator.yaml
ProvStoreConverter: /home/user/provtoolsuite-interop-test-harness/localconfig/provstore.yaml
```

* If there are not provided then the interoperability tests will look for default files in localconfig/
* Configuration for ProvPyComparator depend on whether ProvPy source or package are used e.g. source:

```
---
comparators:
  ProvPyComparator: 
    executable: python /disk/ssi-dev0/home/mjj/ProvPy/scripts/prov-convert
    arguments: -f FORMAT INPUT OUTPUT
    # Formats must be in set [json, provn, provx, trig, ttl]
    formats: [provx, json]
```
* e.g. package:

```
---
comparators:
  ProvPyComparator: 
    executable: prov-convert
    arguments: -f FORMAT INPUT OUTPUT
    # Formats must be in set [json, provn, provx, trig, ttl]
    formats: [provx, json]
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

**Implementation - prov_interop.harness**

* InteroperabilityConfiguration renamed to HarnessResources(ConfigurableComponent)
  - Property with test-cases directory.
  - Property with dictionary of comparator name to Comparator instances.
  - Property with dictionary of formats (from prov_interop.standards) to Comparator instances.
  - register_components renamed to register_comparators.
  - register_components populates both dictionaries.
  - configure checks for "test-cases" and "comparators" in configuration.
  - configure saves complete configuration.
  - No need for notion of converter-tests - comparator-specific interoperability tests can check the complete configuration themselves.
  - configure calls register_test_cases with test-cases directory
  - "testcase" - assumed prefix for test case files.
  - register_test_cases
    - All directories matching testcaseNNNN are searched.
    - All files in each such directory are listed, and filtered so that only those with an extension matching one of those in prov_interop.standards (see above) for which a comparator exists are considered.
    - All possible combinations of pairs of the remaining files are calculated to give a set of (test-case-number, format1, file1, format2, file2) tuples.
    - These are saved in a test_cases variable, for use in auto-generating test-case methods.
* Tests - prov_interop.test_harness
  * HarnessResourcesTestCase

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

**Implementation - prov_interop.factory**

* ReflectionUtilities not implemented - provided its methods as module-wide functions.
* getClass renamed to get_class.
* getInstance renamed to get_instance.
* Tests - prov_interop.tests.test_factory
  - FactoryTestCase

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

**Implementation**

* Both test harness unit tests and interoperability tests can be invoked via nose e.g.

```
# Run all tests
$ nosetests

# Run unit tests only
$ nosetests prov_interop.tests
# Run subset of unit tests
$ nosetests prov_interop.tests.test_component

# Run interoperability tests only
$ nosetests prov_interop.interop_tests

# Run converter-specific interoperability tests only
$ nosetests prov_interop.interop_tests.test_provpy
$ nosetests prov_interop.interop_tests.test_provtoolbox
$ nosetests prov_interop.interop_tests.test_provtranslator
$ nosetests prov_interop.interop_tests.test_provstore
```

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

**Implementation**

* Python 3.4 [sub-tests](https://docs.python.org/dev/library/unittest.html#distinguishing-test-iterations-using-subtests)
  - Unhappy with it being 3.4 only.
* Python's nose [test generators](http://nose.readthedocs.org/en/latest/writing_tests.html#test-generators)
  - Unhappy with it not being usable within unittest.TestCase.
* Java's JUnit 4 [parameterized unit tests](http://junit.sourceforge.net/javadoc/org/junit/runners/Parameterized.html
  - Not applicable as implementing harness in Python.
* [Dynamically generating Python test cases](http://eli.thegreenplace.net/2014/04/02/dynamically-generating-python-test-cases)
  - Too low level and seems to need main method.
* [Gold/approved file testing all methods in a test class against every file in a directory via metaclass metaprogramming in Python](https://gist.github.com/patkujawa-wf/1f569d245bbfc73f83a3)
  - Too low level.
* [py.test parameterized](http://pytest.org/latest/parametrize.html#parametrized-test-functions)
  - Future possibility
* Adopted a new find, [nose-parameterized](https://pypi.python.org/pypi/nose-parameterized/)
  - Works with nose in Python 2 and 3.
  - Does not work with py.test.
  - Dynamically creates test methods based on tuples which can be enumerations of each test-case,ext_in,ext_out) combination
  - Prototyped version quickly.
* For skipping tests e.g. test cases or tests involving formats a converter does not support, nose.plugins.skip supports SkipTest exception which, if raised, records a test method has having been skipped (neither a pass nor a fail)

### Running within Travis CI or Jenkins

The design when implemented will be runnable under either Travis CI or Jenkins.

Cloning the test cases repository and updating the interoperability test harness configuration to specify the local location of test case files, will be the responsibility of Travis CI- and Jenkins-specific configuration.

API keys are needed to POST and DELETE documents hosted in ProvStore. The API key should not be held within a publicly-visible repository. However, Travis CI can test code hosted in private GitHub repositories.

**Implementation**

* A set of template configuration files are in config/.
* prov_interop/set-yaml-value.py is a script that can be used to customise these:

```
    usage: set-yaml-value.py [-h] file replacements [replacem
ents ...]

    Replace values in a YAML file

    positional arguments:
      file          File
      replacements  Replacements of form NAME=VALUE where nam
e is a path of keys
                    through a YAML file e.g.
                    comparators.ProvPyComparator.executable

    optional arguments:
      -h, --help    show this help message and exit
```

* For example, given config.properties:

```
CONFIG_DIR=localconfig
PROV_TEST_CASES=$HOME/provtoolsuite-testcases
python prov_interop/set-yaml-value.py $CONFIG_DIR/harness.yaml test-cases="$PROV_TEST_CASES"
```

* create_local_config.sh is a shell script that sets up all values for standalone running of the interoperability tests that uses set-yaml-value.py to update configuration files. Users can edit the values at the top of the file for their local configuration.
* set-yaml-value.py is also used in .travis.yml job files and Jenkins config.xml job files to customise configuration to the local environment.
* TravisCI allows encrypted variables to be defined and used in jobs - their contents are not displayed to the user. See [define variables in repository settings](http://docs.travis-ci.com/user/environment-variables/#Defining-Variables-in-Repository-Settings). The sample ProvStore job uses this approach.

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

**Implementation**

* See foregoing text.

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

**Implementation**

* Exceptions and print statements in Python 3-compliant format.
* All files include:

```
from __future__ import (absolute_import, division, print_function,  unicode_literals)
```

* Applied all changes suggested by [2to3](https://docs.python.org/2/library/2to3.html).
* Code and unit tests run under both Python 2.7.6 and 3.4.0.

### Python test harness implementation and ProvPy

ProvPy supports Python 2.6, 2.7, 3.3, 3.4 and pypy. There is a about different behaviours in Python 2.x and 3.x with respect to handling strings. It is unclear whether ProvPy's prov-convert tool outputs the same results in both environments. As a result, the test harness must be able to run ProvPy's prov-convert tool under a Python 2.x and a Python 3.x version. 

If implementing the test harness under Python this then requires one of two implementation approaches to be adopted:

1. Implement the test harness such that it can run under both Python 2.x and Python 3.x. See, for example, [Supporting Python 2 and 3 without 2to3 conversion](http://python3porting.com/noconv.html).
2. As the test harness treats ProvPy's prov-convert tool as a command-line executable (and is not aware that it is implemented in Python) specify the version of Python to use, when running it via the command line. The Python environment on which the test harness run can be separate from that of ProvPy. This is how, for example, the [tox](https://testrun.org/tox) package manages the execution of tests on different versions of Python).

[pyenv](https://github.com/yyuu/pyenv) allows for multiple Python versions to be installed and used. As described in [Coosing the Python version](https://github.com/yyuu/pyenv#choosing-the-python-version):

> You can activate multiple versions at the same time, including multiple versions of Python2 or Python3 simultaneously. This allows for parallel usage of Python2 and Python3, and is required with tools like tox.

**Implementation**

* Code and unit tests run under both Python 2.7.6 and 3.4.

---

## Implementation plan

Phase 1 - ProvPy and ProvToolbox:

* ConfigurableComponent **DONE**
* Converter, ProvPyConverter, ProvToolboxConverter **DONE**
* Comparator, SimpleComparator (a simple class that just tests if a file exists), ProvPyComparator **DONE**
  - **Implementation** - SimpleComparator was not needed.
* InteroperabilityTest, ProvPyInteropTest, ProvToolboxInteropTest **DONE**
  - **Implementation** - InteroperabilityTest was designed away in a previous iteration of this document, this mention was an oversight.
* InteroperabilityConfiguration **DONE**
* Utility classes required for the above **DONE**
* Unit test classes for the above **DONE**
* Test cases GitHub repository, populated with documents produced using ProvToolbox **DONE**
* Travis CI job **DONE**
* Jenkins job plus documentation on how to configure and run Jenkins with this job **DONE**
  - Example on an Ubuntu virtual machine, running under VMWare **DONE**

Phase 2 - ProvTranslator and ProvStore

* ProvTranslatorConverter, ProvStoreConverter and supporting classes. **DONE**
* ProvTranslatorInteropTest, ProvStoreInteropTest. **DONE**
* Additional utility classes required for the above. **DONE**
* Additional unit test classes for the above. **DONE**
* Updates to existing classes and jobs. **DONE**

Phase 3 - services.

* ServiceTest, ProvValidatorTest, ProvTranslatorTest, ProvStoreTest.
* Update of this document into a document that summarises the design as implemented.

Phase 4 (optional):

* Consider how to remove/reduce duplication between converters and comparators
  - **Implementation** - ProvPyConverter inherits from RestComponent and Converter
  - e.g. between ProvPyConverter and ProvPyComparator.
  - Pull out commonality into helper classes. **DONE where appropriate**
  - Use multiple inheritance. **DONE where appropriate**

---

## Implementation issues arising during Phase 1

### Scalability

* prov_interop.interop_tests.harness creates a list of (index, ext_in, file.ext_in, ext_out, file.ext_out) tuples.
* Up to 5 documents per test case - provn, ttl, trig, provx, json.
* 25 possible tuples per test case - one for each ext_in x ext_out combination.
* Tuples include the absolute paths to the files.
* List contains a maximum of N x 25 tuples.
* If the list of tuples were to grow so big that performance suffers, an alternative is:
  - Use a tuple (index, ext_in, ext_out)
  - Create file names and absolute paths in prov_interop.interop_tests.converter.ConverterTestCase
  - This may increase the runtime of the tests.

### One or many test jobs

There are a number of ways Travis CI jobs can be set up:

1. Single Travis CI job to run test harness unit tests and interoperability tests

* Pros:
  - All the tests are run from a single job in a single repository.
* Cons:
  - A bloated Travis CI configuration file.
  - Requires scrolling through Travis CI log to see results for each class of tests.

2. Multiple TravisCI jobs for test harness unit tests, ProvPy interoperability tests, ProvToolbox interoperability unit tests

* Pros:
  - More modular - each set of tests has its own job.
* Cons:
  - Each TravisCI job needs to be held in a separate repository.

This is purely a Travis CI issue and either solution is valid.

Multiple repositories have been set up to implement option 2.

This issue does not apply to Jenkins as a Jenkins server can host any number of jobs, using different job configuration files for each, though these configuration files can be hosted within the same repository.

A single Jenkins configuration file that runs ProvPy, ProvToolbox ProvTranslator and ProvStore interoperability tests has been written.

### Tool versions to test

There are a number of options for what versions of ProvPy and ProvToolbox are tested. For example:

* ProvPy
  - pip package
  - GitHub repository stable branch (e.g. 1.3.2)
  - GitHub repository latest version (e.g. master)
* ProvToolbox:
  - GitHub repository stable branch (i.e. master)
  - GitHub repository stable branch source code ZIP
  - Maven binary release ZIP
  - rpm package

This choice solely affects Travis CI and Jenkins configuration.

The example jobs written for Travis CI and Jenkins:

* ProvPy
  - GitHub repository stable branch (e.g. 1.3.2) - for ProvToolbox use of prov-compare
  - GitHub repository latest version (e.g. master) - for ProvPy prov-convert testing under Python 2.7 and 3.4 (since prov-compare works under 3.4 in master but not in 1.3.2)
* ProvToolbox:
  - GitHub repository stable branch (i.e. master) 

### Python versions

Test harness code and unit tests run under both Python 2.7.6 and 3.4.0.

This allows ProvPy to be tested under both Python 2 and Python 3.

Within Travis CI the job configuration can specify both 2.7 and 3.4. 

Within Jenkins, separate jobs can be set up to use the correct version of Python.

### Triggering test runs

Travis CI only runs tests when changes are pushed to, or pulled into, a repository. This means to trigger the interoperability test harness test runs, a file needs to be updated. This could, simply, be README.md.

However, as the interoperability test harness jobs can be configured to pull the most recent versions of ProvPy and ProvToolbox (as they do at present), it may be enough just to request that the most recent build be rerun.

A [StackOverflow](http://stackoverflow.com/questions/20395624/travis-ci-builds-on-schedule) response, suggests using the [Travis CI command line interface](https://github.com/travis-ci/travis.rb) with an OS task scheduler (e.g. cron).

This allows jobs to be [restarted](https://github.com/travis-ci/travis.rb#restart).

Jenkins can be configured to run test jobs either when a repository changes (e.g. code is commited) or at regular intervals, so this issue does not apply.

How to do this for the interoperability test harness, and a simple shell script, have been [documented](https://github.com/prov-suite/interop-test-harness/blob/master/travis/TravisClient.md).

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
