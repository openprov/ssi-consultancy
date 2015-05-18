# ProvPy Developer's Guide

This page describes how to set up a development enviroment for ProvPy and other useful information for developers.

You should be familiar with the [User's Guide](./UsersGuide.md) and have installed the software listed in it. We recommend that developers use pyenv to manage multiple Python versions.

---

## Install Git

[Git](http://git-scm.com/) is a popular distributed version control system. It can be used to get the ProvToolbox source code repository.

Install:

    $ sudo apt-get -y install git
    $ git --version
    git version 1.9.1

---

## Install Python versions

ProvPy is tested using a number of Python versions. Install these within your pyenv:

    $ pyenv install 2.6.9
    $ pyenv install 2.7.6
    $ pyenv install 3.3.0
    $ pyenv install 3.4.0
    $ pyenv install pypy-2.5.1

---

## Install Flake8

[Flake8](https://pypi.python.org/pypi/flake8) is a wrapper around three code analysis tools:

* [PyFlakes](https://pypi.python.org/pypi/pyflakes) - checks Python source files for errors.
* [PEP-8](https://www.python.org/dev/peps/pep-0008/) - Python coding standards.
* [mccabe](https://pypi.python.org/pypi/mccabe) - checks code for McCabe [cycolmatic complexity](http://en.wikipedia.org/wiki/Cyclomatic_complexity).

Install for each Python version e.g. for 2.7.6:

    $ pyenv local 2.7.6
    $ pip install flake8

---

## Install Coverage

[coverage](https://pypi.python.org/pypi/coverage/4.0a5) measures code coverage during test execution.

Install for each Python version e.g. for 2.7.6:

    $ pyenv local 2.7.6
    $ pip install coverage
    $ coverage --version
    Coverage.py, version 3.7.1.  http://nedbatchelder.com/code/coverage

---

## Install Tox

[Tox](https://pypi.python.org/pypi/tox) is a generic virtual environment management and test tool.

    $ pip install tox
    $ tox --version
    2.0.1 imported from /home/ubuntu/.pyenv/versions/2.7.6/lib/python2.7/site-packages/tox/__init__.pyc

---

## Get ProvPy source code

Source code is hosted on [GitHub](https://github.com/trungdong/prov).

Get source code:

    $ git clone https://github.com/trungdong/prov
    $ cd prov

---

## Run tests

Run tests under the current Python version:

    $ python setup.py test
    ...
    ----------------------------------------------------------------------
    Ran 625 tests in 13.498s
    
    OK

---

## Check test coverage

Run tests and calculate test coverage under the current Python version:

    $ coverage run setup.py test
    ...
    $ coverage report
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

---

## Install ProvPy's prerequisite packages 

Install prerequisite packages under the current Python version:

    $ python setup.py test

---

## Run specific tests

Run a specific test class under the current Python version. This requires the prerequisite packages to have been installed.

    $ python -m unittest prov.tests.test_model
    ...
    ----------------------------------------------------------------------
    Ran 190 tests in 7.123s

    OK

---

## Run tests under all Python versions

Configure pyenv:

    $ pyenv local pypy-2.5.1 2.6.9 2.7.6 3.3.0 3.4.0

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

---
