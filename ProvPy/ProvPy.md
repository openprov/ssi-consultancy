# ProvPy

ProvPy is a Python library supporting import and export of PROV-DM data as PROV-JSON and PROV-XML.

* Source code: https://github.com/trungdong/prov
* Licence: MIT Public License.
* Documentation: http://prov.readthedocs.org/
* Issue tracker: https://github.com/trungdong/prov/issues
* Travis CI: https://travis-ci.org/trungdong/prov
* PyPi prov 1.3.1: https://pypi.python.org/pypi/prov

## PyPi package

Install pre-requisites:

    $ python --version
    Python 2.7.6
    $ python2 --version
    Python 2.7.6

    $ sudo apt-get install python-pip
    $ pip -V
    pip 1.5.4 from /usr/lib/python2.7/dist-packages (python 2.7)
    $ pip2 -V
    pip 1.5.4 from /usr/lib/python2.7/dist-packages (python 2.7)

    $ python3 --version
    Python 3.4.0

    $ sudo apt-get install python3-pip
    $ pip3 -V
    pip 1.5.4 from /usr/lib/python3/dist-packages (python 3.4)

Follow Dong's GoogleDoc instructions:

    $ sudo pip install prov
    $ pip list | grep prov
    prov (1.3.1)
    $ pip show prov
    ---
    Name: prov
    Version: 1.3.1
    Location: /usr/local/lib/python2.7/dist-packages
    Requires: six, python-dateutil, lxml, networkx

    $ sudo pip3 install prov
    $ pip3 list | grep prov
    prov (1.3.1)
    $ pip3 show prov
    ---
    Name: prov
    Version: 1.3.1
    Location: /usr/local/lib/python3.4/dist-packages
    Requires: python-dateutil, lxml, six, networkx

http://prov.readthedocs.org/en/latest/usage.html

Copy "Simple PROV document" into usage-simple.py.

Change last line to:

    print(document.get_provn()) # =>

Run:

    $ python usage-simple.py 
    document
      default <http://anotherexample.org/>
      prefix ex <http://example.org/>
      
      entity(e2, [prov:type="File", ex:content="There was a lot of crime in London last month", ex:creator="Alice", ex:path="/shared/crime.txt"])
      activity(a1, 2015-05-07T07:45:28.698831, -, [prov:type="edit"])
      wasGeneratedBy(e2, a1, -)
      wasAssociatedWith(a1, ag2, -, [prov:role="author"])
      agent(ag2, [prov:type="prov:Person", ex:name="Bob"])
    endDocument

Copy "PROV document with a bundle" into usage-bundle.py.

Change last lines to:

    print (document.get_provn()) # =>
    print (document.serialize()) # =>

Run:

    $ python usage-bundle.py 
    document
      default <http://example.org/0/>
      prefix ex2 <http://example.org/2/>
      prefix ex1 <http://example.org/1/>
      
      entity(e001)
      bundle e001
        default <http://example.org/2/>
        
        entity(e001)
      endBundle
    endDocument
    {"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}
    
    $ python3 usage-simple.py 
    OK
    $ python3 usage-bundle.py 
    OK

http://prov.readthedocs.org/en/latest/installation.html recommends easy_install:

    $ sudo pip uninstall prov
    $ sudo easy_install prov
    $ pip show prov
    ---
    Name: prov
    Version: 1.3.1
    Location: /usr/local/lib/python2.7/dist-packages/prov-1.3.1-py2.7.egg
    Requires: python-dateutil, networkx, lxml, six
    $ python usage-simple.py 
    OK
    $ python usage-bundle.py 
    OK

    $ sudo pip3 uninstall prov
    $ sudo easy_install3 prov
    $ pip3 show prov
    ---
    Name: prov
    Version: 1.3.1
    Location: /usr/local/lib/python3.4/dist-packages/prov-1.3.1-py3.4.egg
    Requires: python-dateutil, networkx, lxml, six
    $ python3 usage-simple.py 
    OK
    $ python3 usage-bundle.py 
    OK

## PyPi and virtualenvwrapper

http://prov.readthedocs.org/en/latest/installation.html also recommends:

    $ mkvirtualenv prov
    $ pip install prov

https://pypi.python.org/pypi/virtualenv

http://docs.python-guide.org/en/latest/dev/virtualenvs/

> virtualenv is a tool to create isolated Python environments.

> virtualenv creates a folder which contains all the necessary executables to use the packages that a Python project would need.

https://virtualenvwrapper.readthedocs.org/en/latest/

> virtualenvwrapper is a set of extensions to Ian Bicking's virtualenv tool. The extensions include wrappers for creating and deleting virtual environments and otherwise managing your development workflow, making it easier to work on more than one project at a time without introducing conflicts in their dependencies.

    $ virtualenv --version
    12.1.1
    $ sudo pip install virtualenvwrapper
    $ export WORKON_HOME=~/Envs
    $ mkdir -p $WORKON_HOME
    $ source /usr/local/bin/virtualenvwrapper.sh

    $ mkvirtualenv prov
    (prov)$ pip install prov

https://virtualenvwrapper.readthedocs.org/en/latest/command_ref.html#managing-environments

    (prov)$ ls ~/Envs/prov/lib/python2.7/site-packages/prov
    (prov)$ echo $VIRTUAL_ENV
    /home/ubuntu/Envs/prov
    (prov)$ lsvirtualenv
    prov
    ====
    (prov)$ showvirtualenv
    (prov)$ workon
    prov
    (prov)$ deactivate

    $ workon prov
    (prov)$ which python
    /home/ubuntu/Envs/prov/bin/python

    (prov)$ mkvirtualenv --python=/usr/bin/python3.4 prov3
    (prov3)$ python --version
    Python 3.4.0
    (prov3)$ pip install prov

    (prov3)$ workon prov
    (prov)$ python --version
    Python 2.7.6

    (prov)$ workon prov3
    (prov3)$ python --version
    Python 3.4.0

## Source code 

Install pre-requisites:

    $ sudo apt-get install git
    $ git --version
    git version 1.9.1
    $ git clone https://github.com/trungdong/prov
    $ cd prov
    $ git branch -a
    * master
      remotes/origin/0.5.x
      remotes/origin/HEAD -> origin/master
      remotes/origin/master
      remotes/origin/rdf
    $ git tag 
    1.0.0
    ...
    1.3.1
    v.0.4.8
    ...
    v0.5.5
    $ git checkout 1.3.1

Remove prov so it doesn't get in the way:

    $ sudo pip uninstall prov
    (prov)$ pip uninstall prov
    (prov)$ python usage-simple.py 
    OK
    (prov)$ python usage-bundle.py 
    OK
    
    $ sudo pip3 uninstall prov
    (prov3)$ pip uninstall prov
    (prov3)$ python3 usage-simple.py 
    OK
    (prov3)$ python3 usage-bundle.py 
    OK

Following Dong's instructions:

    (prov)$ python setup.py test
    ...
    Couldn't import dot_parser, loading of dot files will not be possible.
    ...
    ----------------------------------------------------------------------
    Ran 625 tests in 13.498s
    
    OK
    
    $ sudo apt-get install graphviz
    $ dot -V
    dot - graphviz version 2.36.0 (20140111.2315)
    (prov)$ python setup.py test
    ...
    Couldn't import dot_parser, loading of dot files will not be possible.
    ...
    (prov)$ sudo pip install pydot
    (prov)$ python setup.py test
    ...
    Couldn't import dot_parser, loading of dot files will not be possible.
    ...

http://stackoverflow.com/questions/15951748/pydot-and-graphviz-error-couldnt-import-dot-parser-loading-of-dot-files-will

https://pypi.python.org/pypi/pydot2/1.0.33 provides a patch fix to this issue.

Update setup.py to use this sorts the problem:

    test_requirements = [
        'pydot2>=1.0.33'
    ]

Run again:

    (prov)$ python setup.py test
    ...
    ----------------------------------------------------------------------
    Ran 625 tests in 22.487s
    
    OK

    (prov3)$ python setup.py test
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

pydot2 supports Python 3, and the fix above resolves this problem too:

    (prov3)$ python setup.py test

    ----------------------------------------------------------------------
    Ran 625 tests in 2.752s

    OK

## Tox

https://pypi.python.org/pypi/tox

https://tox.readthedocs.org/en/latest/

> Tox is a generic virtualenv management and test command line tool.

    $ sudo pip install tox
    $ tox --version
    1.9.2 imported from /usr/local/lib/python2.7/dist-packages/tox/__init__.pyc
    $ tox
    GLOB sdist-make: /home/ubuntu/prov/setup.py
    py26 create: /home/ubuntu/prov/.tox/py26
    ERROR: InterpreterNotFound: python2.6
    py27 create: /home/ubuntu/prov/.tox/py27
    py27 installdeps: -r/home/ubuntu/prov/requirements.txt
    ...
    ERROR: /bin/sh: 1: xslt-config: not found
    ** make sure the development packages of libxml2 and libxslt are installed **
    ...
    src/lxml/lxml.etree.c:8:22: fatal error: pyconfig.h: No such file or directory
    ...
    py33 create: /home/ubuntu/prov/.tox/py33
    ERROR: InterpreterNotFound: python3.3
    py34 create: /home/ubuntu/prov/.tox/py34
    py34 installdeps: -r/home/ubuntu/prov/requirements.txt
    ...
    ERROR: /bin/sh: 1: xslt-config: not found
    ** make sure the development packages of libxml2 and libxslt are installed **
    ...
    src/lxml/lxml.etree.c:8:22: fatal error: pyconfig.h: No such file or directory
    ...
    $ sudo apt-get install libxslt1-dev 
    $ sudo apt-get install python-dev
    $ tox
    ...
    /usr/bin/ld: cannot find -lz
    collect2: error: ld returned 1 exit status
    ...
    $ sudo apt-get install zlib1g-dev
    $ tox
    ...
    Couldn't import dot_parser, loading of dot files will not be possible.
    ...
    Couldn't import dot_parser, loading of dot files will not be possible.
    ...
    ERROR:   py26: InterpreterNotFound: python2.6
      py27: commands succeeded
    ERROR:   py33: InterpreterNotFound: python3.3
      py34: commands succeeded
    
Update requirements.txt:
    
    lxml>=3.3.5
    networkx>=1.9.1
    python-dateutil>=2.2
    six>=1.9.0
    pydot2>=1.0.33

Run again:

    $ tox
    ERROR:   py26: InterpreterNotFound: python2.6
      py27: commands succeeded
    ERROR:   py33: InterpreterNotFound: python3.3
      py34: commands succeeded

## Get started!

http://prov.readthedocs.org/en/latest/contributing.html#get-started

https://pypi.python.org/pypi/flake8

http://flake8.readthedocs.org/en/latest/

> Flake8 is a wrapper around these tools:
>
> * PyFlakes - A simple program which checks Python source files for errors.
> * pep8 
> * Ned Batchelder's McCabe script - check McCabe complexity.

* https://pypi.python.org/pypi/pyflakes
* https://www.python.org/dev/peps/pep-0008/
* http://en.wikipedia.org/wiki/Cyclomatic_complexity
* https://pypi.python.org/pypi/mccabe

Run:

    (prov)$ pip install flake8
    (prov)$ flake8 prov tests

    (prov3)$ ...as above...

    (prov)$ python setup.py develop
    pip list
    decorator (3.4.2)
    lxml (3.4.4)
    networkx (1.9.1)
    pip (6.1.1)
    prov (1.3.1, /home/ubuntu/prov)
    python-dateutil (2.4.2)
    setuptools (15.0)
    six (1.9.0)

    (prov3)$ ...as above...

setup.py develop also supports --uninstall.

Run tests:

    (prov)$ python -m unittest tests.test_prov
    Traceback (most recent call last):
      File "/usr/lib/python2.7/runpy.py", line 162, in _run_module_as_main
        "__main__", fname, loader, pkg_name)
      File "/usr/lib/python2.7/runpy.py", line 72, in _run_code
        exec code in run_globals
      File "/usr/lib/python2.7/unittest/__main__.py", line 12, in <module>
        main(module=None)
      File "/usr/lib/python2.7/unittest/main.py", line 94, in __init__
        self.parseArgs(argv)
      File "/usr/lib/python2.7/unittest/main.py", line 149, in parseArgs
        self.createTests()
      File "/usr/lib/python2.7/unittest/main.py", line 158, in createTests
        self.module)
      File "/usr/lib/python2.7/unittest/loader.py", line 130, in loadTestsFromNames
        suites = [self.loadTestsFromName(name, module) for name in names]
      File "/usr/lib/python2.7/unittest/loader.py", line 91, in loadTestsFromName
        module = __import__('.'.join(parts_copy))
    ImportError: No module named tests
    
    (prov)$ python -m unittest prov.tests.test_model
    ..............................................................................................................................................................................................
    ----------------------------------------------------------------------
    Ran 190 tests in 0.962s
    
    OK

## Travis CI

.travis.yml does:

    script:
      - coverage run setup.py test

    after_success:
      - coveralls

https://pypi.python.org/pypi/coveralls

> Coveralls.io is service to publish your coverage stats online with a lot of nice features. This package provides seamless integration with coverage.py in your python projects. Only projects hosted on Github are supported.

https://pypi.python.org/pypi/coverage/4.0a5

> Coverage.py measures code coverage, typically during test execution.

    (prov)$ pip install coverage
    (prov)$ coverage --version
    Coverage.py, version 3.7.1.  http://nedbatchelder.com/code/coverage
    (prov)$ coverage run setup.py test
    (prov)$ coverage report
    Name                        Stmts   Miss  Cover
    -----------------------------------------------
    prov/__init__                  20     12    40%
    prov/constants                 92      0   100%
    prov/dot                      127     44    65%
    prov/graph                     23      4    83%
    prov/identifier                67      6    91%
    prov/model                    805     91    89%
    prov/serializers/__init__      26      3    88%
    prov/serializers/provjson     192     14    93%
    prov/serializers/provn         14      0   100%
    prov/serializers/provxml      196      3    98%
    -----------------------------------------------
    TOTAL                        1562    177    89%

    (prov)$ workon prov3
    (prov3)$ ...as above...

## Multi-Python version testing

.travis.yml specifies Python versions:

    python:
      - 2.6
      - 2.7
      - 3.3
      - 3.4
      - "pypy"

How to install multiple Python versions?

https://github.com/yyuu/pyenv

> pyenv lets you easily switch between multiple versions of Python. It's simple, unobtrusive, and follows the UNIX tradition of single-purpose tools that do one thing well.

https://github.com/yyuu/pyenv-installer

    $ curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash
    
    WARNING: seems you still have not added 'pyenv' to the load path.
    
    # Load pyenv automatically by adding
    # the following to ~/.bash_profile:
    
    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
    
    $ export PATH="$HOME/.pyenv/bin:$PATH"
    $ eval "$(pyenv init -)"
    $ eval "$(pyenv virtualenv-init -)"
    $ pyenv update
    $ pyenv install -l
    $ pyenv install 2.6.9
    WARNING: The Python readline extension was not compiled. Missing the GNU readline lib?
    WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?
    WARNING: The Python sqlite3 extension was not compiled. Missing the SQLite3 lib?
    ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?
    ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?
    
https://github.com/yyuu/pyenv/wiki/Common-build-problems

    $ sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm

    $ pyenv install 2.7.6
    $ pyenv install 3.3.0
    $ pyenv install 3.4.0
    $ pyenv local 2.6.9
    $ python --version
    Python 2.6.9
    $ pyenv local 3.3.0
    $ python --version
    Python 3.3.0
    $ pyenv local
    3.3.0
    $ pip --version
    pip 6.1.1 from /home/ubuntu/.pyenv/versions/3.3.0/lib/python3.3/site-packages (python 3.3)
    $ pyenv local 3.4.0
    $ pip --version
    pip 1.5.4 from /home/ubuntu/.pyenv/versions/3.4.0/lib/python3.4/site-packages (python 3.4)
    $ pyenv versions
      system
      2.6.9
      2.7.6
      3.3.0
    * 3.4.0 (set by /home/ubuntu/.python-version)
    $ pyenv local --unset

Can use with virtualenv:
    
    $ pyenv virtualenv <name>
    $ pyenv activate <name>
    $ pyenv deactivate

Run tox:

    $ tox
    GLOB sdist-make: /home/ubuntu/prov/setup.py
    py26 create: /home/ubuntu/prov/.tox/py26
    ERROR: InvocationError: Failed to get version_info for python2.6: pyenv: python2.6: command not found
    
    The `python2.6' command exists in these Python versions:
      2.6.9
    ...
 
Google for solution:

    $ pyenv local 2.6.9 2.7.6 3.3.0 3.4.0
    $ tox
    ...
      py26: commands succeeded
      py27: commands succeeded
      py33: commands succeeded
      py34: commands succeeded
      congratulations :)

http://docs.travis-ci.com/user/languages/python/

"pypy" in .travis.yml refers to PyPy 2.x

http://pypy.org/

> PyPy is a fast, compliant alternative implementation of the Python language (2.7.8 and 3.2.5).
   
    $ pyenv install pypy-2.5.1
    $ pyenv local pypy-2.5.1
    $ python --version
    Python 2.7.9 (9c4588d731b7, Mar 23 2015, 16:30:30)
    [PyPy 2.5.1 with GCC 4.6.3]
    $ pyenv local pypy-2.5.1 2.6.9 2.7.6 3.3.0 3.4.0

Add pypy to tox.ini. Change:

    envlist = py26, py27, py33, py34

to:

    envlist = pypy, py26, py27, py33, py34

Run tox:

    $ tox
    ...
    ----------------------------------------------------------------------
    Ran 625 tests in 9.586s
    
    OK
    ___________________________________ summary ____________________________________
      pypy: commands succeeded
      py26: commands succeeded
      py27: commands succeeded
      py33: commands succeeded
      py34: commands succeeded
      congratulations :)

## provconvert

Using fixed setup.py:

    $ export WORKON_HOME=~/Envs
    $ source /usr/local/bin/virtualenvwrapper.sh
    $ ./scripts/provconvert
    ...
    ImportError: No module named six
    $ python setup.py develop
    $ ./scripts/prov-convert 
    CTRL-C
    $ 
    $ ./scripts/prov-convert -h
    usage: prov-convert [-h] [-f FORMAT] [-V] [infile] [outfile]
    ...
    convert -- Convert PROV-JSON to PROV-N, PROV-XML, or graphical formats (SVG, PDF, PNG)
    ...
      -f FORMAT, --format FORMAT
                        output format: json, xml, provn, or one supported by
                        GraphViz (e.g. svg, pdf)
      -V, --version         show program's version number and exit
    ...
    $ ./scripts/prov-convert -V
    prov-convert v0.1 (2015-02-03)

    $ python usage-bundle.py 
  
Paste output into example.json:

    {"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}

What is default format?

    $ ./scripts/prov-convert example.json example.out.json
    $ cat example.out.json
    {"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}

Seems default is JSON.

    $ ./scripts/prov-convert -f json example.json example.out.json
    $ cat example.out.json
    {"prefix": {"default": "http://example.org/0/", "ex2": "http://example.org/2/", "ex1": "http://example.org/1/"}, "bundle": {"e001": {"prefix": {"default": "http://example.org/2/"}, "entity": {"e001": {}}}}, "entity": {"e001": {}}}

    $ ./scripts/prov-convert -f provn example.json example.provn
    $ cat example.provn 
    document
      default <http://example.org/0/>
      prefix ex2 <http://example.org/2/>
      prefix ex1 <http://example.org/1/>
  
      entity(e001)
      bundle e001
        default <http://example.org/2/>
    
        entity(e001)
      endBundle
    endDocument

    $ ./scripts/prov-convert -f xml example.json example.xml
    $ cat example.xml 
    <?xml version='1.0' encoding='UTF-8'?>
    <prov:document xmlns:prov="http://www.w3.org/ns/prov#" xmlns:ex2="http://example.org/2/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:ex1="http://example.org/1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://example.org/0/">
      <prov:entity prov:id="e001"/>
      <prov:bundleContent prov:id="e001">
        <prov:entity prov:id="e001"/>
      </prov:bundleContent>
    </prov:document>
    
    $ ./scripts/prov-convert -f pdf example.json example.pdf
    prov-convert: No module named pydot
                  for help use --help
    
    $ ./scripts/prov-convert -f svg example.json example.svg
    prov-convert: No module named pydot
                  for help use --help(

    $ pip install pydot2

    $ ./scripts/prov-convert -f pdf example.json example.pdf
    OK
    $ ./scripts/prov-convert -f svg example.json example.svg
    OK
    $ ./scripts/prov-convert -f dot example.json example.dot
    $ cat example.dot 
    digraph G {
    	graph [bb="0,0,145,91",
    		charset="utf-8",
    		rankdir=BT
    	];
    	node [label="\N"];
    	subgraph cluster_c1 {
    		graph [URL="http://example.org/2/e001",
    			bb="65,8,137,83",
    			label=e001,
    			lheight=0.21,
    			lp="101,19.5",
    			lwidth=0.38
    		];
    		n2		 [URL="http://example.org/2/e001",
    			color="#808080",
    			fillcolor="#FFFC87",
    			height=0.5,
    			label=e001,
    			pos="101,57",
    			shape=oval,
    			style=filled,
    			width=0.77632];
    $ ./scripts/prov-convert -f png example.json example.png
    OK

If no GraphViz:

    $ ./scripts/prov-convert -f png example.json example.png
    prov-convert: GraphViz's executables not found
              for help use --help
    $ ./scripts/prov-convert -f dot example.json example.dot
    ...as above...

---

## Setup virtualenvwrapper

    export WORKON_HOME=~/Envs
    source /usr/local/bin/virtualenvwrapper.sh

## Setup pyenv

    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"

## Set up environment

    # Prerequisites
    sudo apt-get -y install graphviz
    dot -V
    sudo apt-get -y install git
    git --version
    sudo apt-get -y install libxslt1-dev 
    sudo apt-get -y install python-dev
    sudo apt-get -y install zlib1g-dev

    # Package manager Python 2
    python --version
    python2 --version
    sudo apt-get install python-pip
    pip -V
    pip2 -V
    # Package manager Python 3
    python3 --version
    sudo apt-get install python3-pip
    pip3 -V

    # virtualenvwrapper
    virtualenv --version
    sudo pip install virtualenvwrapper
    export WORKON_HOME=~/Envs
    mkdir -p $WORKON_HOME
    source /usr/local/bin/virtualenvwrapper.sh

    mkvirtualenv prov2.7
    mkvirtualenv --python=/usr/bin/python3.4 prov3.4

    workon prov2.7
    echo $VIRTUAL_ENV
    workon prov3.4
    echo $VIRTUAL_ENV

    # pyenv and prerequisites
    sudo apt-get -y install make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm
    curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash
    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
    pyenv update
    pyenv install -l
    pyenv install 2.6.9
    pyenv install 2.7.6
    pyenv install 3.3.0
    pyenv install 3.4.0
    pyenv install pypy-2.5.1
    pyenv local 2.6.9
    python --version
    pyenv local 2.7.6
    python --version
    pyenv local 3.3.0
    python --version
    pyenv local 3.4.0
    python --version
    pyenv local pypy-2.5.1
    python --version

    # prov prerequisites
    # Do for each Python version within virtualenvwrapper or pyenv
    which python
    python --version
    pip install tox
    tox --version
    pip install flake8
    pip install coverage
    coverage --version

    # Package manager install 
    # Do for each Python version within virtualenvwrapper or pyenv
    pip install prov
    pip show prov

    # Source code repository
    git clone https://github.com/trungdong/prov
    cd prov
    git checkout 1.3.1

    # Update setup.py
    test_requirements = [
        'pydot2>=1.0.33'
    ]
    # Update requirements.txt:
    lxml>=3.3.5
    networkx>=1.9.1
    python-dateutil>=2.2
    six>=1.9.0
    pydot2>=1.0.33

    python setup.py test
    flake8 prov tests  
    coverage run setup.py test
    coverage report

    # Update tox.ini:
    envlist = pypy, py26, py27, py33, py34

    tox

    # Remember this pip installs prerequisites permanently
    python setup.py develop
    python -m unittest prov.tests.test_model

    # Sample file
    echo "{\"prefix\": {\"default\": \"http://example.org/0/\", \"ex2\": \"http://example.org/2/\", \"ex1\": \"http://example.org/1/\"}, \"bundle\": {\"e001\": {\"prefix\": {\"default\": \"http://example.org/2/\"}, \"entity\": {\"e001\": {}}}}, \"entity\": {\"e001\": {}}}" > example.json
    cat example.json

    ./scripts/prov-convert -h
    ./scripts/prov-convert -V
    ./scripts/prov-convert example.json example.out.json
    ./scripts/prov-convert -f json example.json example.out.json
    ./scripts/prov-convert -f provn example.json example.provn
    ./scripts/prov-convert -f xml example.json example.xml
    ./scripts/prov-convert -f pdf example.json example.pdf
    ./scripts/prov-convert -f svg example.json example.svg
    ./scripts/prov-convert -f svg example.json example.dot
