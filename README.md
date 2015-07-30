# The Software Sustainability Institute / Provenance Tool Suite 
Consultancy

A collaboration between [The Software Sustainability Institute](http://www.software.ac.uk) and the [Provenance Tool Suite](http://provenance.ecs.soton.ac.uk/) team at [Electronics and Computer Science](http://www.ecs.soton.ac.uk) at the [University of Southampton](http://www.soton.ac.uk).

## Aims

The aims of our collaboration are as follows.

* Deployment experience report. A report summarising experiences of deploying Provenance Tool Suite and setting up a local development environment for building and testing its packages and services.
* Round-trip interoperability test specification. Specification of round-trip interoperability tests to be implemented with reference to PROV and packages and services of the Provenance Tool Suite.
* Round-trip interoperability test harness design. Design for a test harness which systematically checks convertibility and round-trip conversions across combinations of these.
* Round-trip interoperability test harness. Test harness implementation, with implementation of round-trip interoperability tests specified in the Round-trip interoperability test specification. The test harness will be complemented with documentation on how to deploy, maintain and extend the test harness.

For the background to this work, please see [Provenance Tool Suite](http://www.software.ac.uk/who-do-we-work/provenance-tool-suite) on the [Software Sustainability Institute](http://www.software.ac.uk) web site.

## Reports

* [Tool Deployment Experiences](./ToolsDeployment.md). 

Notes, commands and code excerpts used as the basis of this report are in:

* [ProvPy](./ProvPy/ProvPy.md)
* [ProvToolbox](./ProvToolbox/ProvToolbox.md)
* [ProvJS](./ProvJS/ProvJS.md)

Sample guides based on current pages and adopting recommendations from Tool Deployment Experiences

* ProvToolbox:
  - [User's Guide](./ProvToolbox/UsersGuide.md)
  - [Developer's Guide](./ProvToolbox/DevelopersGuide.md)
  - [provconvert man page](./ProvToolbox/manpage.md)
* ProvPy:
  - [User's Guide](./ProvPy/UsersGuide.md)
  - [Developer's Guide](./ProvPy/DevelopersGuide.md)
* ProvJS:
  - [Developer's Guide](./ProvJS/DevelopersGuide.md)

## Interoperability test harness
 
* [Original design](./InteroperabilityTestHarness.md)
* [Design as 
implemented](https://github.com/prov-suite/interop-test-harness/blob/master/docs/Design.md)

Interoperability test harness

* [GitHub](https://github.com/prov-suite/interop-test-harness)
* [TravisCI](https://travis-ci.org/prov-suite/interop-test-harness) unit tests results

Test cases

* [GitHub](https://github.com/prov-suite/testcases)

## Service deployment readiness tests

* Tests to checks ProvValidator and ProvStore services work by running basic REST invocations and checking for 2xx/3xx HTTP responses.
* [GitHub](https://github.com/prov-suite/service-tests)
* [TravisCI](https://travis-ci.org/prov-suite/service-tests)

## ProvJS automated tests

* [Pull request](https://github.com/prov-suite/provjs/pull/1) with configuration configuration files needed to run the Jasmine NodeJS tests using both Grunt and Karma, and a Travis CI job file. 
* Merged into [ProvJS](https://github.com/prov-suite/provjs)
* [TravisCI](https://travis-ci.org/prov-suite/provjs)
