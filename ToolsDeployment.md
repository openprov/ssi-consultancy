# Provenance Tool Suite - Tool Deployment Experiences

Mike Jackson, The Software Sustainability Institute / EPCC, The University of Edinburgh

## Introduction

This document reviews the [Southampton Provenance Tool Suite](http://provenance.ecs.soton.ac.uk/). It summarises experiences of, and makes recommendations relating to, the Provenance Tool Suite web site, and deploying the tools of Provenance Tool Suite. It also covers setting up a local development environment for building and testing these tools. 

The review used the following resources:

* Provenance Tool Suite tools and resources hosted on:
  - [GitHub](https://github.com/)
  - [Read the Docs](https://readthedocs.org/)
  - [Travis CI](https://travis-ci.org/)
* Provenance Tool Suite [services](https://provenance.ecs.soton.ac.uk/) hosted by [Electronics and Computer Science](http://www.ecs.soton.ac.uk) at the [University of Southampton](https://www.soton.ac.uk).
* Information provided by Trung Dong Huynh of the Provenance Tool Suite project.
* Documentation for third-party software packages.
* Online resources found via Google.

For the background to this work, please see [Provenance Tool Suite](http://www.software.ac.uk/who-do-we-work/provenance-tool-suite) on the [Software Sustainability Institute](http://www.software.ac.uk) web site.

---

## Review platform

A virtual machine image of [Ubuntu](http://www.ubuntu.com/) 14.04.1, 64-bit operating system, configured with 1 GB RAM and 20 GB hard disk was used. The image was run on a Dell Latitude E7440:

* 64-bit Intel Core i5-4310U CPU 2GHz, 2.60GHz 2 core.
* 8GB RAM.
* 185GB hard disk.
* Windows 7 Enterprise Service Pack 1.

The virtual machine image ran under [VMware Player](http://www.vmware.com/uk/products/player) 6.0.3. This is no longer available. The nearest version is [6.0.6](https://my.vmware.com/web/vmware/free#desktop_end_user_computing/vmware_player/6_0). The current version is now [VMWare Player 7.1.0](https://my.vmware.com/web/vmware/free#desktop_end_user_computing/vmware_player/7_0) 

---

## General

### Host project resources in project, not personal, spaces

Certain GitHub resources are hosted in personal projects. For example:

* https://github.com/trungdong/prov/
* https://github.com/lucmoreau/ProvToolbox/

These should be migrated to the [prov-suite](https://github.com/prov-suite) project on GitHub. This would help create a sense of identity, or brand, for Provenance Tool Suite. It may also help to encourage a community around the suite since the tools will be seen to belong to the project and not to individuals. It also makes it easier for other members of a project to access these project-specific resources, or update them if needed.

This is currently under discussion at Southampton.

Similar comments apply to the personal Travis CI projects:

* https://travis-ci.org/trungdong/prov/
* https://travis-ci.org/lucmoreau/ProvToolbox/

Consider creating a prov-suite project, or account, on Travis CI.

### Create a Provenance Tool Suite logo

A logo would help to create a sense of identity, or brand, for Provenance Tool Suite tools and services. In addition, GitHub allows organisations, such as that for [prov-suite](https://github.com/prov-suite), to have an associated logo.

### Replace MIT Public License with another free, open source licence

ProvPy and ProvToolbox are freely available under the free, open source, OSI-approved [MIT Public License](http://opensource.org/licenses/MIT). However, in a [comment](http://www.software.ac.uk/blog/2013-07-31-should-we-be-scared-choosing-oss-licence#comment-5858) on an Institute blog post [Should we be scared of choosing an OSS licence?](http://www.software.ac.uk/blog/2013-07-31-should-we-be-scared-choosing-oss-licence), Chris Morris of STFC observed that:

> Github's advice is not good for UK residents, because the repudiation of liability in the MIT license is not valid in UK law. The reason for this is: 
>
> * in UK law you cannot reject liability for personal injury or death 
> * when part of a sentence in a contract is invalid, the contract is considered as if the sentence as a whole was omitted 
> * after you strike out the inapplicable sentence, the MIT licence contains no statement about liability 

This seems to arise from the MIT Public License text which comments:

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

Moving to another free, open source, OSI-approved licence, e.g. [GNU General Public License 3](http://www.gnu.org/copyleft/gpl.html) would provide similar licence conditions to the MIT Public License, but provides a limitation of liability which factors in local laws ("UNLESS REQUIRED BY APPLICABLE LAW"):

    16. Limitation of Liability.
    IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN
    WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES
    AND/OR CONVEYS THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR
    DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL
    DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE PROGRAM
    (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED
    INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF
    THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER
    OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. 

### Provide information about pre-requisites and tools

It can be useful, especially for new developers, to know about what each tool they need to install does. Provide a short summary and a link to each tool's web page.

---

## Provenance Tool Suite web site

Comments on https://provenance.ecs.soton.ac.uk/ and pages under this domain.

### Update copyright

The page footers state:

> (c) University of Southampton 2013

which may give the impression that no work has been done since then. Keeping the copyright year live helps give the impression that the project is live.

### Fix broken links

https://provenance.ecs.soton.ac.uk/tools/extract/ has a broken link from "Contact" to https://provenance.ecs.soton.ac.uk/tools/extract/#.

https://provenance.ecs.soton.ac.uk/validator/view/about.html has a broken link from "ProvToolBox" to https://github.com/ProvToolbox.

### Provide a link to the ethics application

The [validator](https://provenance.ecs.soton.ac.uk/validator/view/validator.html) and [translator](https://provenance.ecs.soton.ac.uk/validator/view/translator.html) state that:

> By pressing the validate/translate buttons, you agree with the terms and conditions of this service (for full details see ethics application 4559).

Provide a link to this ethics application.

### Make PROV links consistent

https://provenance.ecs.soton.ac.uk/ links to a number of PROV-related pages:

* PROV-OVERVIEW
* PROV-PRIMER
* PROV-DM
* PROV-O
* PROV-N
* PROV-CONSTRAINTS
* Provenance Working Group at W3C
* PROV-JSON

However, https://provenance.ecs.soton.ac.uk/validator/view/about.html links to an overlapping, but not identical, set:

* PROV-OVERVIEW
* PROV-PRIMER
* PROV-DM
* PROV-O
* PROV-N
* PROV-CONSTRAINTS
* PROV-XML
* PROV-AQ
* PROV-LINKS
* PROV-DICTIONARY

PROV-JSON links to https://provenance.ecs.soton.ac.uk/prov-json/ whereas there is a now, updated, link available at http://www.w3.org/Submission/2013/SUBM-prov-json-20130424/.

### Provide REST API examples

Examples of invocations of REST endpoints (e.g. using cURL) and examples of what they return, which can be useful for deployers and developers.

---

## ProvPy

ProvPy is a Python library supporting import and export of PROV-DM data as PROV-JSON and PROV-XML.

* Source code: https://github.com/trungdong/prov/
* Licence: MIT Public License.
* Documentation: http://prov.readthedocs.org/
* Issue tracker: https://github.com/trungdong/prov/issues/
* Travis CI: https://travis-ci.org/trungdong/prov/
* PyPi prov 1.3.1: https://pypi.python.org/pypi/prov/

### List all package dependencies

There are a number of operating system-specific package dependencies that need to be installed using apt-get (if, for example, using a fresh Ubuntu 14.04.1 machine).

To install Python 2 packages needs:

* [Pip](https://pip.pypa.io/en/stable/)

To install Python 3 packages needs:

* [Pip](https://pip.pypa.io/en/stable/) for Python 3.

To get the most up-to-date source code needs:

* [Git](http://git-scm.com/)

To run needs:

* [GraphViz](http://www.graphviz.org/) for the 'dot' tool.

To run 'python setup.py test' or tox needs the tools and packages packages:

* libxslt1-dev 
* python-dev
* zlib1g-dev

These should be listed in any user doc as prerequisites for using or developing ProvPy.

### Rename 'Get Started!' to 'Set up development environment'

It isn't initially clear that the [Get Started!](http://prov.readthedocs.org/en/latest/contributing.html#get-started) section of [Contributing](http://prov.readthedocs.org/en/latest/contributing.html) is information for developers on how to set up their development environment.

### Update test example

The test command in [Tips](http://prov.readthedocs.org/en/latest/contributing.html#tips):

    $  python -m unittest tests.test_prov

is out of date and throws an exception:

    Traceback (most recent call last):
      File "/usr/lib/python2.7/runpy.py", line 162, in _run_module_as_main
        "__main__", fname, loader, pkg_name)
      ...
      File "/usr/lib/python2.7/unittest/loader.py", line 91, in loadTestsFromName
        module = __import__('.'.join(parts_copy))
    ImportError: No module named tests

Replace this with an up-to-date example e.g.:

    $ python -m unittest prov.tests.test_model

### Provide information about pyenv

[Pull Request Guidelines](http://prov.readthedocs.org/en/latest/contributing.html#pull-request-guidelines) comments that:

    > The pull request should work for Python 2.6, 2.7, and for PyPy.

Adding information about [pyenv](https://github.com/yyuu/pyenv), which allows multiple Python versions to co-exist and can work with tox, would be useful information for a developer who wants to test upon multiple-versions locally.

### Add pypy to tox.ini

Continuing from the above, .travis.yml specifies Python versions:

    python:
      - 2.6
      - 2.7
      - 3.3
      - 3.4
      - "pypy"

tox.ini specifies consistent Python versions, except for pypy:

    envlist = py26, py27, py33, py34

Update this to:

    envlist = pypy, py26, py27, py33, py34

to make these consistent.

### Document need to install dependencies if using prov-convert

If using prov-convert, Python 2 users need to install dependencies via:

    $ python setup.py develop
    $ pip install pydot

For Python 3:

    $ python setup.py develop
    $ pip install https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip

https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip is specified in requirements.txt and is a Python 3-compatible version of pydot. However, if using this with Python 2, prov-convert, when requested to create a dot file raises an error:

    $ ./scripts/prov-convert -f dot example.json example.dot
    Couldn't import dot_parser, loading of dot files will not be possible.
    prov-convert: str() takes at most 1 argument (2 given)

The problem arises at the line:

    content = dot.create(format=output_format)

where dot is a pydot.Dot object. For Python 2, pydot needs to be used.

As an aside, installing pydot under Python 3 gives:

    $ pip install pydot
    Downloading/unpacking pydot
      Downloading pydot-1.0.2.tar.gz
      Running setup.py (path:/tmp/pip_build_ubuntu/pydot/setup.py) egg_info for package pydot
        Traceback (most recent call last):
          File "<string>", line 17, in <module>
          File "/tmp/pip_build_ubuntu/pydot/setup.py", line 5
            except ImportError, excp:
                              ^
        SyntaxError: invalid syntax
        Complete output from command python setup.py egg_info:
        Traceback (most recent call last):
      File "<string>", line 17, in <module>
      File "/tmp/pip_build_ubuntu/pydot/setup.py", line 5
        except ImportError, excp:
                      ^
    SyntaxError: invalid syntax
    ----------------------------------------
    Cleaning up...

Support for comma syntax was removed in [Python 3](http://python3porting.com/differences.html#except). 'except ImportError as excp', introduced in Python 2.6, is required.

[pydot2](https://pypi.python.org/pypi/pydot2/1.0.33) provides a patch to suppress dot_parser warnings (see below and [StackOverflow](http://stackoverflow.com/questions/15951748/pydot-and-graphviz-error-couldnt-import-dot-parser-loading-of-dot-files-will)) and claims to support Python 3. However, running prov-convert under Python 3.4.0 with pydot2 raises an error:

    prov-convert: name 'file' is not defined

The problem arises within:

     content = dot.create(format=output_format)

pydot2 uses Python 'file' constructors which have been [removed in Python 3](https://docs.python.org/release/3.0/whatsnew/3.0.html#builtins). This has been raised as a pydot2 [issue](https://github.com/erocarrera/pydot/issues/76).

### Document need to install pydot if using 'python setup.py test' with Python 3

Under Python 2:

    $ python setup.py test
    ...
    ----------------------------------------------------------------------
    Ran 625 tests in 2.026s

    OK

Under Python 3 an error is raised:

    $ python setup.py test
    ...
    Reading http://dkbza.org/pydot.html
    Best match: pydot 1.0.28
    Downloading http://pydot.googlecode.com/files/pydot-1.0.28.tar.gz
    Processing pydot-1.0.28.tar.gz
    Writing /tmp/easy_install-qf30txd3/pydot-1.0.28/setup.cfg
    Running pydot-1.0.28/setup.py -q bdist_egg --dist-dir /tmp/easy_install-qf30txd3
    /pydot-1.0.28/egg-dist-tmp-zbonf778
    Traceback (most recent call last):
      File "/tmp/easy_install-qf30txd3/pydot-1.0.28/setup.py", line 5
        except ImportError, excp:
                          ^
    SyntaxError: invalid syntax

due to the deprecation of commas in exception handlers as described above. The user first needs to manually install the Python 3 version of pydot:

    $ pip install https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip
    $ python setup.py test
    ...
    Couldn't import dot_parser, loading of dot files will not be possible.
    ...
    ----------------------------------------------------------------------
    Ran 625 tests in 2.026s

    OK

### Update prov-convert shebang

prov-convert supports only Python 2.7. prov-convert hard-codes the Python version in the 'shebang':

    #!/usr/bin/env python2.7

Change this to:

    #!/usr/bin/env python

to allow any version of Python to be used.

### Make prov-convert GRAPHVIZ_SUPPORTED_FORMATS a list

When run under Python 2.6.9, prov-convert raises an error:

    File "./prov-convert", line 39
        'bmp', 'canon', 'cmap', 'cmapx', 'cmapx_np', 'dot', 'eps', 'fig', 'gtk', 'gv', 'ico', 'imap', 'imap_np', 'ismap',
         ^
    SyntaxError: invalid syntax

prov-convert defines a set:

    GRAPHVIZ_SUPPORTED_FORMATS = {
       ...
    }

This was introduced in [Python 2.7](https://docs.python.org/2/library/stdtypes.html#set-types-set-frozenset). For backwards compatibility, change the set to a list:

    GRAPHVIZ_SUPPORTED_FORMATS = [ 
        ...
    ]

As the set is only used in one place:

    elif output_format in GRAPHVIZ_SUPPORTED_FORMATS:

this causes no problems elsewhere.

### Replace comma with 'as' in prov-convert exception blocks

When run under Python 3, prov-convert raises an error:

     File "./scripts/prov-convert", line 127
        except Exception, e:
                        ^
    SyntaxError: invalid syntax

As mentioned above, 'as' is required:

    except Exception as e:

### Open output file as a binary in prov-convert

Running prov-convert under Python 3, raises an error:

    $ ./scripts/prov-convert -f pdf example.json example.pdf
    ...
    prov-convert: must be str, not bytes

This problem arises at the line:

    outfile.write(content)

According to [StackOverflow](http://stackoverflow.com/questions/5512811/builtins-typeerror-must-be-str-not-bytes) this is because the output file needs to be opened as a binary if writing bytes. Changing the line:

    parser.add_argument('outfile', nargs='?', type=FileType('w'), ...

to:

    parser.add_argument('outfile', nargs='?', type=FileType('wb'), ...

solves this problem. This fix also compatible with Python 2.6.9 and 2.7.6.

### Specify Python version-specific pydot versions in requirements.txt

requirements.txt contains package dependencies:

    lxml>=3.3.5
    networkx>=1.9.1
    python-dateutil>=2.2
    six>=1.9.0
    https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip

pip [requirements files](https://pip.pypa.io/en/latest/reference/pip_install.html#requirements-file-format) can, from version 6 onwards, support libraries conditional on Python versions:

    pydot; python_version < '3'
    https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip; python_version >= '3'

requirements.txt is also used by tox, and running tox, using a requirements.txt file with the above, results in success for all Python versions e.g.:

    $ pyenv local pypy-2.5.1 2.6.9 2.7.6 3.3.0 3.4.0 
    $ tox
    ...
    pypy: commands succeeded
    py26: commands succeeded
    py27: commands succeeded
    py33: commands succeeded
    py34: commands succeeded
    congratulations :)

---

### Advise that dot_parser warning can be ignored in prov-convert

Running 'python setup.py tests' or 'prov-convert' gives a warning e.g.

    $ python setup.py test
    ...
    Couldn't import dot_parser, loading of dot files will not be possible.
    ...
    ----------------------------------------------------------------------
    Ran 625 tests in 2.026s

    OK

As the code does not load dot files, the user should be told that this warning can be ignored.

---

### Specify prov-convert default format

If prov-convert is not given a format, then it defaults to JSON.

    $ ./scripts/prov-convert example.json example.out
    $ cat example.out
    {"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}

This should be stated in the help shown when running:

    $ ./scripts/prov-convert -h

---

### Allow prov-convert to deduce output format

Update prov-convert so that it deduces the output format from the file extension of the output file e.g.

    $ ./scripts/prov-convert example.json example.out.json
    $ ./scripts/prov-convert example.json example.provn
    $ ./scripts/prov-convert example.json example.xml
    $ ./scripts/prov-convert example.json example.pdf
    $ ./scripts/prov-convert example.json example.svg

---

## ProvToolbox

ProvToolbox is a Java library to create Java representations of PROV-DM and convert them to PROV-O, PROV-XML, PROV-N, and PROV-JSON.

* Source code: https://github.com/lucmoreau/ProvToolbox/
  - master is the stable branch.
  - refactoring is the development branch.
* Licence: MIT Public License.
* Documentation: http://lucmoreau.github.io/ProvToolbox/
* Issue tracker: https://github.com/lucmoreau/ProvToolbox/issues
* Travis CI: https://travis-ci.org/lucmoreau/ProvToolbox
* provconvert: https://github.com/lucmoreau/ProvToolbox/wiki/provconvert 

### Host JavaDoc on Read the Docs

ProvToolbox JavaDoc, linked from [ProvToolbox](http://lucmoreau.github.io/ProvToolbox/) documentation is hosted at [openprovenance.org](http://openprovenance.org/java/site/0_6_0/apidocs/index.html).

Consider hosting on [Read the Docs](http://readthedocs.org) for consistency with ProvPy and to reduce the number of separate locations where Provenance Tool Suite resources are held.

### Avoid in-page links

The 'Installation Instructions' section in [ProvToolbox](http://lucmoreau.github.io/ProvToolbox/) documentation has in-page links to the ProvToolbox [wiki](https://github.com/lucmoreau/ProvToolbox/wiki/Installation):

> Requirements: https://github.com/lucmoreau/ProvToolbox/wiki/Installation#requirements
>
> Building from source: https://github.com/lucmoreau/ProvToolbox/wiki/Installation#building-from-source
>
> Binary install: https://github.com/lucmoreau/ProvToolbox/wiki/Installation#installing-binary-release

Such links can be brittle. As an alternative, just link through to [Installation](https://github.com/lucmoreau/ProvToolbox/wiki/Installation) on the wiki.

### Host user documentation in the repository not the wiki

Certain user documentation is hosted on the  wiki:

* [Releases](https://github.com/lucmoreau/ProvToolbox/wiki/Releases)
* [Installation](https://github.com/lucmoreau/ProvToolbox/wiki/Installation)
* [provconvert](https://github.com/lucmoreau/ProvToolbox/wiki/provconvert)

Consider hosting user documentation in the repository rather than on the wiki. This would continue to provide an audit trail of who changed what, when and why. However, it also would allow this user documentation to be more tightly-coupled to releases and reduce the risk of them becoming out-of-synch.

### List all package dependencies

There are a number of operating system-specific package dependencies that need to be installed using apt-get (if, for example, using a fresh Ubuntu 14.04.1 machine). Two of these - xmllint and dot (from GraphViz) - are documented. Others are not.

To run ProvToolbox needs:

* Java JRE. There should be a recommended version and also a list of other supported versions, or, at least, versions known to work e.g.
  - Travis CI uses [Oracle Java](https://www.java.com/en/) - see Travis CI [java](http://docs.travis-ci.com/user/languages/java/) page.
  - I used [OpenJDK](http://openjdk.java.net/), since Ubuntu do not provide Oracle Java via their package managers - see Ubuntu [java](https://help.ubuntu.com/community/Java) page.

To get the most up-to-date source code needs:

* [Git](http://git-scm.com/)

To develop, build and test ProvToolbox needs:

* [Apache Maven](https://maven.apache.org/)
* Java SDK, as for JRE above.

These should be listed in any user doc as prerequisites for using or developing ProvToolbox.

### Provide Eclipse setup instructions

There is an [Eclipse](https://eclipse.org/) .settings directory within the Git repository. Provide instructions as to how a new developer can set up Eclipse for ProvToolbox development.

### Explain SLF4J warnings

When running provconvert on certain file formats, warnings appear:

    $ ./bin/provconvert -infile example.json -outfile example.out.ttl
    SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
    SLF4J: Defaulting to no-operation (NOP) logger implementation
    SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.

    $ ./bin/provconvert -infile example.out.ttl -outfile example.out.json
    SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
    SLF4J: Defaulting to no-operation (NOP) logger implementation
    SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.

provconvert still succeeds in these cases.

Add a note to the provconvert documentation explaining:

* That this warning is non-fatal and can be ignored.
* How this warning can be suppressed (if possible).

### Update supported file extensions

README-provconvert.txt in a ProvToolbox binary release states:

    RECOGNIZED FILE EXTENSIONS

     - prov-n notation:   .provn
     - prov-o ttl:        .ttl
     - prov-xml:          .provx or .xml
     - pdf:               .pdf
     - svg:               .svg

However, rdf and dot are also supported:

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

svg does not seem to be supported as an input format:

    $ ./bin/provconvert -infile example.svg -outfile example.out.pdf
    Exception in thread "main" java.lang.UnsupportedOperationException
    	at org.openprovenance.prov.interop.InteropFramework.readDocumentFromFile(InteropFramework.java:633)
    	at org.openprovenance.prov.interop.InteropFramework.run(InteropFramework.java:696)
    	at org.openprovenance.prov.interop.CommandLineArguments.main(CommandLineArguments.java:160)
    
Update README-provconvert.txt to accurately document the supported input and output file formats. 

### List supported file extensions in built-in help

List the supported file extensions as part of the built-in help when a user runs:

    $ ./bin/provconvert -help

### Remove provconvertBAK

bin/ in a ProvToolbox binary release contains provconvertBAK. The files differ slightly:

    $ diff bin/provconvert bin/provconvertBAK 
    86c86
    <   #### no exit ### Luc
    ---
    >   exit 1

Remove this as BAK implies it is a back-up file and should not be in a binary release.

### Remove references to openxml-validate

README-provxml-validate.txt in a binary ProvToolbox release describes another tool:

    > opmxml-validate opmFile.xml {schemaFile.xsd}*

There is no such tool in the binary release.

### Experiment with JAR MANIFEST Class-Path

bin/provconvert.bat sets up the CLASSPATH. Alternatively use a JAR with a Class-Path attribute in its MANIFEST. See [Adding Classes to the JAR File's Classpath](https://docs.oracle.com/javase/tutorial/deployment/jar/downman.html).

### Migrate TODO.txt to issues

TODO.txt in the Git repository has a list of TODOs. Migrate these to the ProvToolbox [issue tracker](https://github.com/lucmoreau/ProvToolbox/issues) to allow for a more systematic and organised approach to feature and bug management. Release notes and other documents can just provide a list of the issues corresponding to each known problem or resolved problem, plus their descriptive text. Users can then consult the issue tracker for more information.

### Make the tutorial bundle stand-alone

[ProvToolbox Tutorial 1: Creating and Saving a PROV Document](https://lucmoreau.wordpress.com/2014/08/01/provtoolbox-tutorial-1-creating-and-saving-a-prov-document/) links to tutorial code on [ProvToolbox-Tutorial1-0.6.1-src.zip](http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/ProvToolbox-Tutorial1/0.6.1/ProvToolbox-Tutorial1-0.6.1-src.zip).

The tutorial bundle could be made stand-alone, removing the need for a user to also view the blog post:

* Add content from the blog post as comments to the tutorial files Little.java and pom.xml to explain what each part of the code and configuration within these does.
* Provide the blog post text within README.txt.

### Fix and update the tutorial in the repository and releases 

Both the binary releases linked from [ProvToolbox](http://lucmoreau.github.io/ProvToolbox/) documentation:

* http://openprovenance.org/java/maven-releases/org/openprovenance/prov/toolbox/0.6.0/toolbox-0.6.0-release.zip
* http://search.maven.org/remotecontent?filepath=org/openprovenance/prov/toolbox/0.6.1/toolbox-0.6.1-release.zip

contain prov-toolbox-tutorial.pdf, a PDF with 29 blank pages. 

Within a source directory, after building ProvToolbox, toolbox/target/classes/8-prov-toolbox.pdf is also a blank PDF. toolbox/src/main/resources/8-prov-toolbox.pdf can be viewed, however it is out-of-date. It is a presentation that refers to:

* toolbox-1.1.X-release.zip
* http://openprovenance.org/java/maven-releases/org/openprovenance/toolbox/
* http://github.com/lucmoreau/OpenProvenanceModel

All of these were last updated ~2011.

This PDF should be removed from the repository.

---

## ProvJS

ProvJS is a small JavaScript utility for indexing and searching PROV-JSON objects within JavaScript objects. It models PROV in JavaScript and outputs PROV-JSON.

* Source code: https://github.com/prov-suite/provjs
* Licence: None though this is planned. Source code is publicly-visible.

### Provide a licence

ProvJS does not have any licence associated with them. Even though their source code are available to download from GitHub, they cannot be considered as open source as they do not have an associated open source licence. From GitHub's [Open source licensing](https://help.github.com/articles/open-source-licensing/)

> Generally speaking, the absence of a license means that the default copyright laws apply. This means that you retain all rights to your source code and that nobody else may reproduce, distribute, or create derivative works from your work. This might not be what you intend.

### List all package dependencies

There are a number of operating system-specific package dependencies that need to be installed using apt-get (if, for example, using a fresh Ubuntu 14.04.1 machine):

To get the most up-to-date source code needs:

* [Git](http://git-scm.com/)

To use an automated test framework needs:

* [Node.js](https://nodejs.org/) - platform to build scalable network applications using JavaScript.
* [npm](https://www.npmjs.com/) - Node.js package manager

### Provide information on how to update Jasmine

ProvJS comes with tests written in the [Jasmine](http://jasmine.github.io/) test framework. The version bundled is 1.3.0. The current Jasmine release is 2.3.2. Provide information to developers on how to update the version of Jasmine e.g.

    $ curl -L https://github.com/jasmine/jasmine/releases/download/v2.3.2/jasmine-standalone-2.3.2.zip -o jasmine2.3.2.zip 
    $ mkdir jasmine2.3.2/
    $ mv jasmine2.3.2.zip jasmine2.3.2/
    $ cd jasmine2.3.2
    $ unzip jasmine2.3.2.zip
    $ cp -r jasmine-2.3.2/ provjs/tests/lib/
    $ cp provjs/tests/tests.html provjs/tests/tests-2.3.2.html

Update the following lines in tests-2.3.2.html:

    <link rel="shortcut icon" type="image/png" href="lib/jasmine-2.3.2/jasmine_favicon.png">
    <link rel="stylesheet" type="text/css" href="lib/jasmine-2.3.2/jasmine.css">
    <script type="text/javascript" src="lib/jasmine-2.3.2/jasmine.js"></script>
    <script type="text/javascript" src="lib/jasmine-2.3.2/jasmine-html.js"></script>

And add the line:

    <script type="text/javascript" src="lib/jasmine-2.3.2/boot.js"></script>

### Adopt an automated test infrastructure

The Jasmine tests can only be run by viewing a web page within a browser. It can be useful to support a test infrastructure that can allows tests to be run from the command line. There are a number of possible options including the following.

**Jasmine Node**

[Jasmine Node](http://jasmine.github.io/2.0/node.html) is a package with helper code for running Jasmine via Node.js. For example:

    $ cd provjs
    $ npm install jasmine --save-dev
    $ cd provjs/tests
    $ jasmine init
    $ ls spec/support/

Edit jasmine.json:

    {
      "spec_dir": "spec",
      "spec_files": [
        "basic01.js"
      ],
      "helpers": [
        "helpers/**/*.js"
      ]
    }

Edit tests/spec/basic01.js, add as first line:

    var prov = require('../../prov.js');

Run:

    $ jasmine
    Started
    ......
    
    
    6 specs, 0 failures
    Finished in 0.003 seconds

**Grunt**

[GruntJS](http://gruntjs.com/), a JavaScript task runner can run Jasmine tests. It uses Node.js and npm. For example:

    $ sudo apt-get -y install nodejs
    $ sudo ln -s /usr/bin/nodejs /usr/bin/node
    $ sudo apt-get -y install npm
    $ npm install grunt-cli
    $ export PATH=~/node_modules/.bin:$PATH
    $ cd provjs

Create package.js:

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

Install dependencies:

    $ npm install grunt --save-dev
    $ npm install grunt-contrib-jshint --save-dev
    $ npm install grunt-contrib-nodeunit --save-dev
    $ npm install grunt-contrib-uglify --save-dev
    $ npm install grunt-contrib-jasmine --save-dev

Create Gruntfile.jasmine.js:

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
    
    6 specs in 0.008s.
    >> 0 failures
    
    Done, without errors.

**Karma**

[Karma](http://karma-runner.github.io/) is a JavaScript test runner. It can run tests using actual browsers and there are a number of test report plugins, and a test coverage plugin. For example, assuming Firefox is available:

    $ npm install karma-cli
    $ cd provjs
    $ npm install karma karma-jasmine karma-chrome-launcher karma-firefox-launcher karma-jasmine-html-reporter karma-coverage --save-dev

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

Run:

    $ karma start

Firefox will start, showing a page at http://localhost:9876. A Debug button shows the Jasmine test results. A coverage directory will be created with coverage information in HTML. Changes to the JavaScript result in the tests being rerun.

**Travis CI compatibility**

Each of these is compatible with Travis CI (though I have not tried these). See, for example:

* Travis CI [Building a Node.js project](http://docs.travis-ci.com/user/languages/javascript-with-nodejs/)
* [Using travis-ci with grunt 0.4.x](http://www.mattgoldspink.co.uk/2013/02/10/using-travis-ci-with-grunt-0-4-x/)
* StackOverflow [run grunt build command on travis ci]( http://stackoverflow.com/questions/21128478/run-grunt-build-command-on-travis-ci)
* Karma [Travis CI](http://karma-runner.github.io/0.8/plus/Travis-CI.html)
