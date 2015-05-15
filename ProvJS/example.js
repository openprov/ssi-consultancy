 var prov=require('./prov.js');
 var primer=require('./primer.js');
function example() {
    var def = prov.setDefaultNamespace("http://default.example.com/");
    var ex = prov.addNamespace("ex", "http://www.example.org/");
    var e1 = prov.entity("ex:e1");
    e1.attr("ex:foo", ex.qn("bar"))
      .attr("ex:baz", ["abc", "xsd:string"])
      .attr("ex:bah", ["1", "xsd:integer"])
      .attr("ex:bam", ["bam", undefined, "en"])
      .attr(ex.qn("bam"), prov.literal("bam", undefined, "en"));
    console.log(e1);

    var d_e1 = prov.entity("d_e1");

    var e2 = prov.entity("ex:e2")
        .attr("ex:dat", new Date(Date.now()))
        .attr("ex:int", 1)
        .attr("ex:nint", -1)
        .attr("ex:flt", 1.02)
        .attr("ex:str", "def")
        .attr("ex:bool", true);
    console.log(e2);
    
    var der1 = prov.wasDerivedFrom("ex:e2", "ex:e1")
        .attr("prov:type", ["prov:Revision", "xsd:QName"])
        .id(ex.qn('d1'));
    var der1 = prov.wasDerivedFrom("ex:e2", "ex:e1");
    der1.attr(prov.ns.qn("type"), prov.ns.qn("Revision"));
    der1.id(ex.qn('d1'));
    //der1.activity = ex.qn('a1');
    der1.attr(prov.ns.qn("type"), prov.ns.qn("Revision"));
    console.log(der1);
    
    var der2 = prov.wasDerivedFrom("ex:e2", "ex:e1", ["prov:type", prov.ns.qn("Revision")]);
    console.log(der2);

    var bundle = prov.bundle("ex:bundle");
    bundle.entity("ex:e2").attr("prov:type", ["prov:Revision", "xsd:QName"]);
    var bundle2 = prov.bundle("ex:bundle2");
    console.log(bundle);

    // var doc = prov.document().document();
    // doc.entity("ex:foo");
    // console.console.log(doc);
    prov.wasDerivedFrom("ex:e2", "ex:e1").generatedEntity("ex:e4");
};

example();
