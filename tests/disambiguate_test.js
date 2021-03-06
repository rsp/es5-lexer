function assertDisambiguated(golden, source) {
  var tokenStream = es5Lexer.disambiguateTokenStream(
    es5Lexer.makeScanner(source));
  var tokens = [];
  for (var token; (token = tokenStream());) {
    tokens.push(token);
  }
  assertEquals(golden, tokens.join(""));
}

function assertUnambiguous(source) {
  assertDisambiguated(source, source);
}

function testEmpty() {
  assertUnambiguous("");
}

function testSimpleJs() {
  assertUnambiguous("Hello, World!");
  assertUnambiguous("// Hello, World!");
  assertUnambiguous("1 + 1 * 2 - 3 % 4");
}

function testSlashAmbiguity() {
  assertDisambiguated("a = b *1/ c", "a = b / c");
  assertDisambiguated("a /=\n b", "a /= b");
}

function testNoCommentIntroduced() {
  assertDisambiguated(
    // If we did not wrap /foo/ for whatever reason, then
    // the / at the end of /foo/ might combine with the
    // asterisk to be /*1/bar...
    "a = (/./.constructor(/foo/)*1/bar)",
    // A regex literal divided by bar
    "a = (/foo//bar)");
}

function testCloseParenBeforeRegexp() {
  assertDisambiguated(
    // This is a known failure, but fails in a safe way.
    "if (c) *1/x*1/i.test(s) && f()",
    // An if statement that leaves a close parenthesis before the regexp.
    "if (c) /x/i.test(s) && f()");
  assertDisambiguated(
    // This is strangely correct.
    "x.if (c) *1/x*1/i.test(s) && f()",
    // A method call involved in a division.
    "x.if (c) /x/i.test(s) && f()");
}

function testProblematicRegex() {
  assertDisambiguated(
    "a = /./.constructor(\"foo\\\\\\\"[/]\",\"\")",
    "a = /foo\\\"[/]/");
}

function testInvalidRegexpFlags() {
  // See testInvalidRegexpFlags in scanner_test for an explanation of the
  // strange handling of flags.
  // The important thing here is that the regular expression does not run
  // into the keyword.
  assertDisambiguated(
    "/./.constructor(/foo/i)nstanceof RegExp",
    "/foo/instanceof RegExp");
  assertDisambiguated(
    "do x = /./.constructor(/foo/)while \n (true)",
    "do x = /foo/while \n (true)");
}

function testAmbiguousThis() {
  assertDisambiguated(
    "this",
    "thi\\u0073");
  assertDisambiguated(
    "this",
    "\\u0074\\u0068\\u0069\\u0073");
  assertDisambiguated("in", "\\u0069\\u006e");
  assertDisambiguated("in", "\\u0069\\u006E");
  // But definitely don't do this where there might be prior ambiguity.
  assertUnambiguous("'\\u005c'");  // Not '\'
  assertUnambiguous("\"\\u005c\"");  // Not '\'
  assertDisambiguated(
    "/./.constructor(\"[/\\\\u005c]\",\"i\")",
    "/[/\\u005c]/i");
}

function assertEvalToSameDisambiguated(expr) {
  if (!/return/.test(expr)) { expr = "return " + expr; }

  var tokenStream = es5Lexer.disambiguateTokenStream(
    es5Lexer.makeScanner(expr));
  var tokens = [];
  for (var token; (token = tokenStream());) {
    tokens.push(token);
  }
  var disambiguatedExpr = tokens.join("");
  var goldenResult = new Function(expr)();
  assertTrue(goldenResult != void 0);
  var actualResult = new Function(disambiguatedExpr)();
  var pass = false;
  try {
    assertEquals(JSON.stringify(goldenResult), JSON.stringify(actualResult));
    pass = true;
  } finally {
    if (!pass && "undefined" !== typeof console) {
      console.log("expr=" + expr);
      console.log("disambiguatedExpr=" + disambiguatedExpr);
    }
  }
}

function testOperatorPrecedences() {
  assertEvalToSameDisambiguated("3 / 4 > 2 / 3 && 1 / 2 < 2 / 1");
  assertEvalToSameDisambiguated("1 + 2 / 3");
  assertEvalToSameDisambiguated("2 / 3 - 1");
  assertEvalToSameDisambiguated("~3 / 4");
  assertEvalToSameDisambiguated("3 / ~4");
  assertEvalToSameDisambiguated("3 / +4");
  assertEvalToSameDisambiguated("3 / ~4 + 2");
  assertEvalToSameDisambiguated("var x = 10, y = 2; return x / y++");
  assertEvalToSameDisambiguated("var x = 10, y = 2; return x / ++y");
  assertEvalToSameDisambiguated("var x = 10, y = 2; return x++ / y");
  assertEvalToSameDisambiguated("var x = 10, y = 2; return ++x / y");
  assertEvalToSameDisambiguated(
    "var x = 11, y = 2, z = 3, w = 7;"
    + " return x / y > z / w ? x++ / y : z / w++");
  assertEvalToSameDisambiguated(
    "var x = 11, y = 2, z = 3, w = 7;"
    + " return x / y < z / w ? x++ / y : z / w++");
  assertEvalToSameDisambiguated("var x = 10; x /= 2; return x");
  assertEvalToSameDisambiguated("var x = 10; x /= 4, x += 5; return x");
  assertEvalToSameDisambiguated("var x = 10, y = 2; x /= y + 2; return x");
  assertEvalToSameDisambiguated("var x = 10, y = 2; x /= y * 2; return x");
  assertEvalToSameDisambiguated("var x = 10, y = 2; x /= y ^ 2; return x");
  assertEvalToSameDisambiguated("var x = 10, y = 2; x /= y || 1; return x");
  assertEvalToSameDisambiguated("var x = 10; x /= new Date(1); return x");
  assertEvalToSameDisambiguated("var x = 10, y = 2; x /= -y; return x");
  assertEvalToSameDisambiguated("var x = 10, y = 2; x /= y++; return [x, y]");
  assertEvalToSameDisambiguated("var x = 10, y = 2; x /= ++y; return [x, y]");
}

function testDisambiguateComments() {
  assertUnambiguous("/**/");
  assertUnambiguous("/*foo*/");
  assertUnambiguous("/*foo\nbar*/");
  assertUnambiguous("//");
  assertUnambiguous("// foo");
}

// TODO: very long tokens.
