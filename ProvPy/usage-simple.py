import prov.model as prov
import datetime

document = prov.ProvDocument()

document.set_default_namespace('http://anotherexample.org/')
document.add_namespace('ex', 'http://example.org/')

e2 = document.entity('e2', (
    (prov.PROV_TYPE, "File"),
    ('ex:path', "/shared/crime.txt"),
    ('ex:creator', "Alice"),
    ('ex:content', "There was a lot of crime in London last month"),
))

a1 = document.activity('a1', datetime.datetime.now(), None, {prov.PROV_TYPE: "edit"})
# References can be qnames or ProvRecord objects themselves
document.wasGeneratedBy(e2, a1, None, {'ex:fct': "save"})
document.wasAssociatedWith('a1', 'ag2', None, None, {prov.PROV_ROLE: "author"})
document.agent('ag2', {prov.PROV_TYPE: 'prov:Person', 'ex:name': "Bob"})

print(document.get_provn()) # =>

# document
#   default <http://anotherexample.org/>
#   prefix ex <http://example.org/>
#
#   entity(e2, [prov:type="File", ex:creator="Alice",
#               ex:content="There was a lot of crime in London last month",
#               ex:path="/shared/crime.txt"])
#   activity(a1, 2014-07-09T16:39:38.795839, -, [prov:type="edit"])
#   wasGeneratedBy(e2, a1, -, [ex:fct="save"])
#   wasAssociatedWith(a1, ag2, -, [prov:role="author"])
#   agent(ag2, [prov:type="prov:Person", ex:name="Bob"])
# endDocument

