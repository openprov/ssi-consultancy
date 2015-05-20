# ProvPy notes

## pydot versions

.travis.yml:

    install:
      - pip install -r requirements.txt
      - pip install coverage coveralls

tox.ini:

    [tox]
    envlist = pypy, py26, py27, py33, py34

    [testenv]
    setenv =
        PYTHONPATH = {toxinidir}:{toxinidir}/prov
    commands = python setup.py test
    deps =
        -r{toxinidir}/requirements.txt

python setup.py test:

    requirements = [
        'python-dateutil',
        'networkx',
        'lxml',
        'six>=1.9.0'
    ]

    test_requirements = [
        'pydot'
    ]

pydot fails to install under Python 3 due to deprecated comma-syntax error.

https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip installs under Python 2 but fails when prov-convert is run:

    $ ./scripts/prov-convert -f dot example.json example.dot
    Couldn't import dot_parser, loading of dot files will not be possible.
    prov-convert: str() takes at most 1 argument (2 given)

The problem arises at the line:

    content = dot.create(format=output_format)

This problem does not arise when running tests using tox, Travis CI or setup.py as there is no test that invokes dot.create.

---

## coveralls

.travis.yml does:

    script:
      - coverage run setup.py test

    after_success:
      - coveralls

https://pypi.python.org/pypi/coveralls

> Coveralls.io is service to publish your coverage stats online with a lot of nice features. This package provides seamless integration with coverage.py in your python projects. Only projects hosted on Github are supported.

## pyenv and virtualenv

    $ pyenv virtualenv <name>
    $ pyenv activate <name>
    $ pyenv deactivate

## prov-convert examples

    $ echo "{\"prefix\": {\"default\": \"http://example.org/0/\", \"ex2\": \"http://example.org/2/\", \"ex1\": \"http://example.org/1/\"}, \"bundle\": {\"e001\": {\"prefix\": {\"default\": \"http://example.org/2/\"}, \"entity\": {\"e001\": {}}}}, \"entity\": {\"e001\": {}}}" > example.json
    $ cat example.json
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

    $ ./scripts/prov-convert -f svg example.json example.svg

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

## Set up virtualenvwrapper

    export WORKON_HOME=~/Envs
    source /usr/local/bin/virtualenvwrapper.sh

## Set up pyenv

    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"

## Set up user environment

    # User prerequisites
    sudo apt-get -y install graphviz
    dot -V
    sudo apt-get -y install git
    git --version
    sudo apt-get -y install curl
    curl --version
    sudo apt-get -y install libxslt1-dev 
    sudo apt-get -y install zlib1g-dev

### System-wide Python and virtualenvwrapper

    sudo apt-get -y install python
    python --version
    sudo apt-get -y install python-pip
    pip -V
    sudo apt-get -y install python-setuptools
    sudo pip install virtualenvwrapper

    sudo apt-get -y install python3
    python3 --version
    sudo apt-get -y install python3-pip
    pip3 -V
    sudo apt-get -y install python3-setuptools
    sudo pip3 install virtualenvwrapper

    mkdir ~/Envs
    export WORKON_HOME=~/Envs
    source /usr/local/bin/virtualenvwrapper.sh

Edit ~/.bash_profile and add:

    export WORKON_HOME=~/Envs
    source /usr/local/bin/virtualenvwrapper.sh

Set environment:

    source ~/bash_profile

Create virtual environments:

    mkvirtualenv prov2.7
    mkvirtualenv --python=/usr/bin/python3.4 prov3.4

    # To switch
    workon 2.7
    workon 3.4

### Local Python and pyenv

    sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm
    curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash

Edit ~/.bash_profile and add:
    
    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"

Set environment:

    source ~/.bash_profile

    pyenv update
    pyenv install -l
    pyenv install 2.6.9
    pyenv local 2.6.9
    python --version
    # Repeat for...
    pyenv install 2.7.6
    pyenv install 3.3.0
    pyenv install 3.4.0
    pyenv install pypy-2.5.1

    pyenv versions

    # To switch
    pyenv local pypy-2.5.1
    pyenv local 2.6.9
    pyenv local 2.7.6
    pyenv local 3.3.0
    pyenv local 3.4.0

### Install prov

    # Do for each Python version
    # EITHER
    pip install prov
    pip list | grep prov
    pip show prov
    # OR
    easy_install prov

    # Remove installed packages
    pip uninstall -y decorator lxml networkx prov pydot pyparsing python-dateutil six
    pip list

## Set up developer environment

    # Do for each Python version
    pip install flake8 coverage tox
    tox --version
    coverage --version
    flake8 --version

    # Source code repository
    git clone https://github.com/trungdong/prov
    cd prov
    git checkout 1.3.1

    # Update requirements.txt
    pydot; python_version < '3'
    https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip; python_version >= '3'

    # Update tox.ini
    envlist = pypy, py26, py27, py33, py34

    # Update scripts/prov-convert
    #!/usr/bin/env python
    GRAPHVIZ_SUPPORTED_FORMATS = [
        ...
    ]
    parser.add_argument('outfile', nargs='?', type=FileType('wb'), ...
    except Exception as e:

    # Do for each Python version
    # Python 3 only
    pip install https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip
    python setup.py test
    coverage run setup.py test
    coverage report
    flake8 prov

    # Run across all Python versions
    pyenv local pypy-2.5.1 2.6.9 2.7.6 3.3.0 3.4.0
    tox

    # Do for each Python version
    # Remember this installs prerequisites
    python setup.py develop
    # Python 2 only
    pip install pydot
    # Python 3 only
    pip install https://bitbucket.org/prologic/pydot/get/ac76697320d6.zip

    # Python 2.7.6 and Python 3
    python -m unittest prov.tests.test_model
    # Python 2.6.9 only
    python prov/tests/test_model.py

    # Python 2.7.6 only
    echo "{\"prefix\": {\"default\": \"http://example.org/0/\", \"ex2\": \"http://example.org/2/\", \"ex1\": \"http://example.org/1/\"}, \"bundle\": {\"e001\": {\"prefix\": {\"default\": \"http://example.org/2/\"}, \"entity\": {\"e001\": {}}}}, \"entity\": {\"e001\": {}}}" > example.json
    cat example.json
    ./scripts/prov-convert -f json example.json example.provn
    cat example.provn 
    ./scripts/prov-convert -f xml example.json example.xml
    cat example.xml 
    ./scripts/prov-convert -f pdf example.json example.pdf
    ./scripts/prov-convert -f svg example.json example.svg
    ./scripts/prov-convert -f dot example.json example.dot
    cat example.dot

    # Uninstall
    pip uninstall -y decorator lxml networkx prov pydot pyparsing python-dateutil six
