/**
 * @fileoverview
 * Defines the lexical grammar of EcmaScript.
 * This defines several regular expressions.
 * There is a mini parser compiler built in.
 * Normally this file is regenerated via the Makefile so that this extra code
 * does not need to be shipped.
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

var ES5_TOKEN, ES5_IGNORABLE_TOKEN_PREFIX;

(
function () {
  // Define regular expression parts corresponding to definitions in
  // the EcmaScript 5 lexical grammar.

  // The naming convention *_CHARS denotes regular expression text that
  // can appear inside a [...] RegExp charset.

  // The naming convention *_RANGES denotes an array of pairs of ints
  // that represent the inclusive bounds of a range of UTF 16 code units.
  // E.g., var FOO_RANGES = [[65, 90]]
  // is an array with one range encompassing the upper-case Latin letters.

  var WHITE_SPACE_CHARS =
    "\\t\\x0B\\x0C \\xA0\\u1680\\u180E\\u2000-\\u200A"
    + "\\u202F\\u205F\\u3000\\uFEFF";

  var WHITE_SPACE = "[" + WHITE_SPACE_CHARS + "]+";

  var LINE_TERMINATOR_CHARS = "\\n\\r\\u2028\\u2029";

  var LINE_TERMINATOR_SEQUENCE = "(?:\\r\\n?|[\\n\\u2028\\u2029])";

  var MULTI_LINE_COMMENT = "\\/\\*[\\s\\S]*?\\*\\/";

  var SINGLE_LINE_COMMENT = "\\/\\/[^" + LINE_TERMINATOR_CHARS + "]*";

  var COMMENT = "(?:" + MULTI_LINE_COMMENT + "|" + SINGLE_LINE_COMMENT + ")";

  var UNICODE_LETTER_RANGES = [
    [0x41, 0x5a], [0x61, 0x7a], [0xaa, 0xaa], [0xb5, 0xb5],
    [0xba, 0xba], [0xc0, 0xd6], [0xd8, 0xf6], [0xf8, 0x236],
    [0x250, 0x2c1], [0x2c6, 0x2d1], [0x2e0, 0x2e4], [0x2ee, 0x2ee],
    [0x37a, 0x37a], [0x386, 0x386], [0x388, 0x38a], [0x38c, 0x38c],
    [0x38e, 0x3a1], [0x3a3, 0x3ce], [0x3d0, 0x3f5], [0x3f7, 0x3fb],
    [0x400, 0x481], [0x48a, 0x4ce], [0x4d0, 0x4f5], [0x4f8, 0x4f8],
    [0x4f9, 0x4f9], [0x500, 0x50f], [0x531, 0x556], [0x559, 0x559],
    [0x561, 0x587], [0x5d0, 0x5ea], [0x5f0, 0x5f2], [0x621, 0x63a],
    [0x640, 0x64a], [0x66e, 0x66e], [0x66f, 0x66f], [0x671, 0x6d3],
    [0x6d5, 0x6d5], [0x6e5, 0x6e5], [0x6e6, 0x6e6], [0x6ee, 0x6ee],
    [0x6ef, 0x6ef], [0x6fa, 0x6fc], [0x6ff, 0x6ff], [0x710, 0x710],
    [0x712, 0x72f], [0x74d, 0x74f], [0x780, 0x7a5], [0x7b1, 0x7b1],
    [0x904, 0x939], [0x93d, 0x93d], [0x950, 0x950], [0x958, 0x961],
    [0x985, 0x98c], [0x98f, 0x98f], [0x990, 0x990], [0x993, 0x9a8],
    [0x9aa, 0x9b0], [0x9b2, 0x9b2], [0x9b6, 0x9b9], [0x9bd, 0x9bd],
    [0x9dc, 0x9dc], [0x9dd, 0x9dd], [0x9df, 0x9e1], [0x9f0, 0x9f0],
    [0x9f1, 0x9f1], [0xa05, 0xa0a], [0xa0f, 0xa0f], [0xa10, 0xa10],
    [0xa13, 0xa28], [0xa2a, 0xa30], [0xa32, 0xa32], [0xa33, 0xa33],
    [0xa35, 0xa35], [0xa36, 0xa36], [0xa38, 0xa38], [0xa39, 0xa39],
    [0xa59, 0xa5c], [0xa5e, 0xa5e], [0xa72, 0xa74], [0xa85, 0xa8d],
    [0xa8f, 0xa91], [0xa93, 0xaa8], [0xaaa, 0xab0], [0xab2, 0xab2],
    [0xab3, 0xab3], [0xab5, 0xab9], [0xabd, 0xabd], [0xad0, 0xad0],
    [0xae0, 0xae0], [0xae1, 0xae1], [0xb05, 0xb0c], [0xb0f, 0xb0f],
    [0xb10, 0xb10], [0xb13, 0xb28], [0xb2a, 0xb30], [0xb32, 0xb32],
    [0xb33, 0xb33], [0xb35, 0xb39], [0xb3d, 0xb3d], [0xb5c, 0xb5c],
    [0xb5d, 0xb5d], [0xb5f, 0xb61], [0xb71, 0xb71], [0xb83, 0xb83],
    [0xb85, 0xb8a], [0xb8e, 0xb90], [0xb92, 0xb95], [0xb99, 0xb99],
    [0xb9a, 0xb9a], [0xb9c, 0xb9c], [0xb9e, 0xb9e], [0xb9f, 0xb9f],
    [0xba3, 0xba3], [0xba4, 0xba4], [0xba8, 0xbaa], [0xbae, 0xbb5],
    [0xbb7, 0xbb9], [0xc05, 0xc0c], [0xc0e, 0xc10], [0xc12, 0xc28],
    [0xc2a, 0xc33], [0xc35, 0xc39], [0xc60, 0xc60], [0xc61, 0xc61],
    [0xc85, 0xc8c], [0xc8e, 0xc90], [0xc92, 0xca8], [0xcaa, 0xcb3],
    [0xcb5, 0xcb9], [0xcbd, 0xcbd], [0xcde, 0xcde], [0xce0, 0xce0],
    [0xce1, 0xce1], [0xd05, 0xd0c], [0xd0e, 0xd10], [0xd12, 0xd28],
    [0xd2a, 0xd39], [0xd60, 0xd60], [0xd61, 0xd61], [0xd85, 0xd96],
    [0xd9a, 0xdb1], [0xdb3, 0xdbb], [0xdbd, 0xdbd], [0xdc0, 0xdc6],
    [0xe01, 0xe30], [0xe32, 0xe32], [0xe33, 0xe33], [0xe40, 0xe46],
    [0xe81, 0xe81], [0xe82, 0xe82], [0xe84, 0xe84], [0xe87, 0xe87],
    [0xe88, 0xe88], [0xe8a, 0xe8a], [0xe8d, 0xe8d], [0xe94, 0xe97],
    [0xe99, 0xe9f], [0xea1, 0xea3], [0xea5, 0xea5], [0xea7, 0xea7],
    [0xeaa, 0xeaa], [0xeab, 0xeab], [0xead, 0xeb0], [0xeb2, 0xeb2],
    [0xeb3, 0xeb3], [0xebd, 0xebd], [0xec0, 0xec4], [0xec6, 0xec6],
    [0xedc, 0xedc], [0xedd, 0xedd], [0xf00, 0xf00], [0xf40, 0xf47],
    [0xf49, 0xf6a], [0xf88, 0xf8b],
    [0x1000, 0x1021], [0x1023, 0x1027], [0x1029, 0x1029], [0x102a, 0x102a],
    [0x1050, 0x1055], [0x10a0, 0x10c5], [0x10d0, 0x10f8], [0x1100, 0x1159],
    [0x115f, 0x11a2], [0x11a8, 0x11f9], [0x1200, 0x1206], [0x1208, 0x1246],
    [0x1248, 0x1248], [0x124a, 0x124d], [0x1250, 0x1256], [0x1258, 0x1258],
    [0x125a, 0x125d], [0x1260, 0x1286], [0x1288, 0x1288], [0x128a, 0x128d],
    [0x1290, 0x12ae], [0x12b0, 0x12b0], [0x12b2, 0x12b5], [0x12b8, 0x12be],
    [0x12c0, 0x12c0], [0x12c2, 0x12c5], [0x12c8, 0x12ce], [0x12d0, 0x12d6],
    [0x12d8, 0x12ee], [0x12f0, 0x130e], [0x1310, 0x1310], [0x1312, 0x1315],
    [0x1318, 0x131e], [0x1320, 0x1346], [0x1348, 0x135a], [0x13a0, 0x13f4],
    [0x1401, 0x166c], [0x166f, 0x1676], [0x1681, 0x169a], [0x16a0, 0x16ea],
    [0x16ee, 0x16f0], [0x1700, 0x170c], [0x170e, 0x1711], [0x1720, 0x1731],
    [0x1740, 0x1751], [0x1760, 0x176c], [0x176e, 0x1770], [0x1780, 0x17b3],
    [0x17d7, 0x17d7], [0x17dc, 0x17dc], [0x1820, 0x1877], [0x1880, 0x18a8],
    [0x1900, 0x191c], [0x1950, 0x196d], [0x1970, 0x1974], [0x1d00, 0x1d6b],
    [0x1e00, 0x1e9b], [0x1ea0, 0x1ef9], [0x1f00, 0x1f15], [0x1f18, 0x1f1d],
    [0x1f20, 0x1f45], [0x1f48, 0x1f4d], [0x1f50, 0x1f57], [0x1f59, 0x1f59],
    [0x1f5b, 0x1f5b], [0x1f5d, 0x1f5d], [0x1f5f, 0x1f7d], [0x1f80, 0x1fb4],
    [0x1fb6, 0x1fbc], [0x1fbe, 0x1fbe], [0x1fc2, 0x1fc4], [0x1fc6, 0x1fcc],
    [0x1fd0, 0x1fd3], [0x1fd6, 0x1fdb], [0x1fe0, 0x1fec], [0x1ff2, 0x1ff4],
    [0x1ff6, 0x1ffc], [0x2071, 0x2071], [0x207f, 0x207f], [0x2102, 0x2102],
    [0x2107, 0x2107], [0x210a, 0x2113], [0x2115, 0x2115], [0x2119, 0x211d],
    [0x2124, 0x2124], [0x2126, 0x2126], [0x2128, 0x2128], [0x212a, 0x212d],
    [0x212f, 0x2131], [0x2133, 0x2139], [0x213d, 0x213f], [0x2145, 0x2149],
    [0x2160, 0x2183], [0x3005, 0x3007], [0x3021, 0x3029], [0x3031, 0x3035],
    [0x3038, 0x303c], [0x3041, 0x3096], [0x309d, 0x309f], [0x30a1, 0x30fa],
    [0x30fc, 0x30ff], [0x3105, 0x312c], [0x3131, 0x318e], [0x31a0, 0x31b7],
    [0x31f0, 0x31ff], [0x3400, 0x4db5], [0x4e00, 0x9fa5], [0xa000, 0xa48c],
    [0xac00, 0xd7a3], [0xf900, 0xfa2d], [0xfa30, 0xfa6a], [0xfb00, 0xfb06],
    [0xfb13, 0xfb17], [0xfb1d, 0xfb1d], [0xfb1f, 0xfb28], [0xfb2a, 0xfb36],
    [0xfb38, 0xfb3c], [0xfb3e, 0xfb3e], [0xfb40, 0xfb40], [0xfb41, 0xfb41],
    [0xfb43, 0xfb43], [0xfb44, 0xfb44], [0xfb46, 0xfbb1], [0xfbd3, 0xfd3d],
    [0xfd50, 0xfd8f], [0xfd92, 0xfdc7], [0xfdf0, 0xfdfb], [0xfe70, 0xfe74],
    [0xfe76, 0xfefc], [0xff21, 0xff3a], [0xff41, 0xff5a], [0xff66, 0xffbe],
    [0xffc2, 0xffc7], [0xffca, 0xffcf], [0xffd2, 0xffd7], [0xffda, 0xffdc]
  ];
  var OTHER_IDENTIFIER_START_RANGES = [
    ["_".charCodeAt(0), "_".charCodeAt(0)],
    ["$".charCodeAt(0), "$".charCodeAt(0)]
  ];
  var UNICODE_DIGIT_RANGES = [
    [0x30, 0x39], [0x660, 0x669], [0x6f0, 0x6f9], [0x966, 0x96f],
    [0x9e6, 0x9ef], [0xa66, 0xa6f], [0xae6, 0xaef], [0xb66, 0xb6f],
    [0xbe7, 0xbef], [0xc66, 0xc6f], [0xce6, 0xcef], [0xd66, 0xd6f],
    [0xe50, 0xe59], [0xed0, 0xed9], [0xf20, 0xf29], [0x1040, 0x1049],
    [0x1369, 0x1371], [0x17e0, 0x17e9], [0x1810, 0x1819], [0x1946, 0x194f],
    [0xff10, 0xff19]
  ];
  var UNICODE_COMBINING_MARK_RANGES = [
    [0x300, 0x357], [0x35d, 0x36f], [0x483, 0x486], [0x591, 0x5a1],
    [0x5a3, 0x5b9], [0x5bb, 0x5bd], [0x5bf, 0x5bf], [0x5c1, 0x5c1],
    [0x5c2, 0x5c2], [0x5c4, 0x5c4], [0x610, 0x615], [0x64b, 0x658],
    [0x670, 0x670], [0x6d6, 0x6dc], [0x6df, 0x6e4], [0x6e7, 0x6e7],
    [0x6e8, 0x6e8], [0x6ea, 0x6ed], [0x711, 0x711], [0x730, 0x74a],
    [0x7a6, 0x7b0], [0x901, 0x903], [0x93c, 0x93c], [0x93e, 0x94d],
    [0x951, 0x954], [0x962, 0x962], [0x963, 0x963], [0x981, 0x983],
    [0x9bc, 0x9bc], [0x9be, 0x9c4], [0x9c7, 0x9c7], [0x9c8, 0x9c8],
    [0x9cb, 0x9cd], [0x9d7, 0x9d7], [0x9e2, 0x9e2], [0x9e3, 0x9e3],
    [0xa01, 0xa03], [0xa3c, 0xa3c], [0xa3e, 0xa42], [0xa47, 0xa47],
    [0xa48, 0xa48], [0xa4b, 0xa4d], [0xa70, 0xa70], [0xa71, 0xa71],
    [0xa81, 0xa83], [0xabc, 0xabc], [0xabe, 0xac5], [0xac7, 0xac9],
    [0xacb, 0xacd], [0xae2, 0xae2], [0xae3, 0xae3], [0xb01, 0xb03],
    [0xb3c, 0xb3c], [0xb3e, 0xb43], [0xb47, 0xb47], [0xb48, 0xb48],
    [0xb4b, 0xb4d], [0xb56, 0xb56], [0xb57, 0xb57], [0xb82, 0xb82],
    [0xbbe, 0xbc2], [0xbc6, 0xbc8], [0xbca, 0xbcd], [0xbd7, 0xbd7],
    [0xc01, 0xc03], [0xc3e, 0xc44], [0xc46, 0xc48], [0xc4a, 0xc4d],
    [0xc55, 0xc55], [0xc56, 0xc56], [0xc82, 0xc82], [0xc83, 0xc83],
    [0xcbc, 0xcbc], [0xcbe, 0xcc4], [0xcc6, 0xcc8], [0xcca, 0xccd],
    [0xcd5, 0xcd5], [0xcd6, 0xcd6], [0xd02, 0xd02], [0xd03, 0xd03],
    [0xd3e, 0xd43], [0xd46, 0xd48], [0xd4a, 0xd4d], [0xd57, 0xd57],
    [0xd82, 0xd82], [0xd83, 0xd83], [0xdca, 0xdca], [0xdcf, 0xdd4],
    [0xdd6, 0xdd6], [0xdd8, 0xddf], [0xdf2, 0xdf2], [0xdf3, 0xdf3],
    [0xe31, 0xe31], [0xe34, 0xe3a], [0xe47, 0xe4e], [0xeb1, 0xeb1],
    [0xeb4, 0xeb9], [0xebb, 0xebb], [0xebc, 0xebc], [0xec8, 0xecd],
    [0xf18, 0xf18], [0xf19, 0xf19], [0xf35, 0xf35], [0xf37, 0xf37],
    [0xf39, 0xf39], [0xf3e, 0xf3e], [0xf3f, 0xf3f], [0xf71, 0xf84],
    [0xf86, 0xf86], [0xf87, 0xf87], [0xf90, 0xf97], [0xf99, 0xfbc],
    [0xfc6, 0xfc6],
    [0x102c, 0x1032], [0x1036, 0x1039], [0x1056, 0x1059], [0x1712, 0x1714],
    [0x1732, 0x1734], [0x1752, 0x1752], [0x1753, 0x1753], [0x1772, 0x1772],
    [0x1773, 0x1773], [0x17b6, 0x17d3], [0x17dd, 0x17dd], [0x180b, 0x180d],
    [0x18a9, 0x18a9], [0x1920, 0x192b], [0x1930, 0x193b], [0x20d0, 0x20dc],
    [0x20e1, 0x20e1], [0x20e5, 0x20ea], [0x302a, 0x302f], [0x3099, 0x3099],
    [0x309a, 0x309a], [0xfb1e, 0xfb1e], [0xfe00, 0xfe0f], [0xfe20, 0xfe23]
  ];
  var UNICODE_CONNECTOR_PUNCTUATION_RANGES = [
    [0x5f, 0x5f], [0x203f, 0x203f], [0x2040, 0x2040], [0x2054, 0x2054],
    [0x30fb, 0x30fb], [0xfe33, 0xfe33], [0xfe34, 0xfe34], [0xfe4d, 0xfe4f],
    [0xff3f, 0xff3f], [0xff65, 0xff65]
  ];
  // Zero-width non-joiner and zero-width joiner.
  var ZWNJ_ZWJ_RANGES = [[0x200C, 0x200D]];

  var IDENTIFIER_START_RANGES = (
      "undefined" !== typeof EMPIRICAL_IDENTIFIER_START_RANGES)
      ? EMPIRICAL_IDENTIFIER_START_RANGES
      : UNICODE_LETTER_RANGES.concat(OTHER_IDENTIFIER_START_RANGES);
  var IDENTIFIER_PART_RANGES = (
      "undefined" !== typeof EMPIRICAL_IDENTIFIER_PART_RANGES)
      ? EMPIRICAL_IDENTIFIER_PART_RANGES
      : UNICODE_LETTER_RANGES.concat(OTHER_IDENTIFIER_START_RANGES)
        .concat(UNICODE_DIGIT_RANGES)
        .concat(UNICODE_COMBINING_MARK_RANGES)
        .concat(UNICODE_CONNECTOR_PUNCTUATION_RANGES)
        .concat(ZWNJ_ZWJ_RANGES);

  var IDENTIFIER_START = charsetAndTrieFromCharsetsAndEscapes(
      IDENTIFIER_START_RANGES);
  var IDENTIFIER_PART = charsetAndTrieFromCharsetsAndEscapes(
      IDENTIFIER_PART_RANGES);
  var IDENTIFIER_NAME = "(?:" + IDENTIFIER_START + IDENTIFIER_PART + "*)";
  var ESCAPE_SEQUENCE_OR_LINE_CONTINUATION
    = "\\\\(?:\\r\\n?|[^\\rux89]|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2})";
  var STRING_LITERAL = "(?:"
    + "\"(?:[^\"\\\\" + LINE_TERMINATOR_CHARS + "]|"
      + ESCAPE_SEQUENCE_OR_LINE_CONTINUATION + ")*\""
    + "|'(?:[^\'\\\\" + LINE_TERMINATOR_CHARS + "]|"
      + ESCAPE_SEQUENCE_OR_LINE_CONTINUATION + ")*'"
    + ")";
  var DECIMAL_LITERAL
    = "(?:(?:0[0-7]*(?![89])|[1-9][0-9]*)(?:\\.[0-9]*)?|\\.[0-9]+)"
    + "(?:[eE][+-]?[0-9]+)?";
  var HEX_INTEGER_LITERAL = "0[xX][0-9A-Fa-f]+";
  var NUMERIC_LITERAL
    = "(?:" + HEX_INTEGER_LITERAL + "|" + DECIMAL_LITERAL + ")";
  var PUNCTUATOR
    = "[{}()\\[\\].;,?:]|&&|\\|\\||\\+\\+|--"
    + "|(?:[*%^\\~+&|\\-]|>{1,3}|<<?|[!=]=?)=?";
  var TOKEN = "(?:" + IDENTIFIER_NAME + "|" + NUMERIC_LITERAL + "|" + PUNCTUATOR
    + "|" + STRING_LITERAL + "|" + COMMENT + "|" + WHITE_SPACE
    + "|" + LINE_TERMINATOR_SEQUENCE + ")";

  ES5_TOKEN = new RegExp("^" + TOKEN);

  ES5_IGNORABLE_TOKEN_PREFIX = new RegExp(
    "^(?:[" + WHITE_SPACE_CHARS + LINE_TERMINATOR_CHARS + "]|\\/[*/])");

  /**
   * Given an array of character ranges, produces a regular expression that
   * matches any character in those ranges or a UnicodeEscapeSequence
   * corresponding to a character in those ranges.
   */
  function charsetAndTrieFromCharsetsAndEscapes(ranges) {
    var HAS_OWN_PROPERTY = Object.hasOwnProperty;

    function collapseRanges(ranges) {
      // Sort ranges by first index so we can collapse overlapping ranges in a
      // single forward pass.
      ranges = ranges.slice();
      ranges.sort(function (a, b) {
                    return a[0] - b[0];
                  });
      // Ranges without overlap or gaps.
      var collapsedRanges = [];
      var lastEnd = -Infinity;
      for (var i = 0, n = ranges.length, k = -1; i < n; ++i) {
        var range = ranges[i];
        if (lastEnd + 1 >= range[0]) {
          if (lastEnd < range[1]) {
            collapsedRanges[k][1] = lastEnd = range[1];
          }
        } else {
          collapsedRanges[++k] = range;
          lastEnd = range[1];
        }
      }
      return collapsedRanges;
    }
    ranges = collapseRanges(ranges);

    var trie = {};
    for (var i = 0, n = ranges.length; i < n; ++i) {
      var range = ranges[i];
      var start = range[0], end = range[1];
      for (var ch = start; ch <= end; ++ch) {
        var esc = unicodeEscape(ch);
        addToTrie(trie, esc);
      }
    }

    function unicodeEscape(utf16CodeUnit) {
      var hex = utf16CodeUnit.toString(16);
      return "\\u000".substring(0, 6 - hex.length) + hex;
    }

    function escapeForRegex(utf16CodeUnit) {
      if ("number" !== typeof utf16CodeUnit) { throw new Error(utf16CodeUnit); }
      return (utf16CodeUnit < 48/*0*/
              || (57/*9*/ < utf16CodeUnit && utf16CodeUnit < 65/*A*/)
              || (90/*Z*/ < utf16CodeUnit && utf16CodeUnit < 97/*a*/)
              || (122/*z*/ < utf16CodeUnit))
          ? unicodeEscape(utf16CodeUnit)
          : String.fromCharCode(utf16CodeUnit);
    }

    function rangesToCharsetParts(ranges) {
      var charset = [];
      for (var i = 0, n = ranges.length; i < n; ++i) {
        var range = ranges[i];
        var start = range[0], end = range[1];
        switch (end - start) {
        case 0:
          charset.push(escapeForRegex(start));
          break;
        case 1:
          charset.push(escapeForRegex(start), escapeForRegex(end));
          break;
        default:
          charset.push(escapeForRegex(start), "-", escapeForRegex(end));
          break;
        }
      }
      return charset.length === 1 ? charset[0] : "[" + charset.join("") + "]";
    }

    /**
     * Builds a trie of unicode escape sequences that are valid identifier
     * characters only.
     * This allows the IdentifierName production to match
     *    foo
     * and valid identifiers with escaped characters
     *    \u0066\u006F\u006F
     * but neither invalid identifiers
     *    a-b
     * nor invalid identifiers whose invalid parts are escaped
     *    a\u002Db
     *
     * The output form of the trie is an object mapping character codes to
     * tries.  The only terminal state is an empty object, so if both a string
     * and its prefix is added to the trie, information that the prefix was
     * added is lost.  This works, because this is only called by clients that
     * pass in strings of length 6.
     */
    function addToTrie(trie, s, i) {
      i = i || 0;
      if (i < s.length) {
        var cc = s.charCodeAt(i);
        var key = "" + cc;
        if (!HAS_OWN_PROPERTY.call(trie, key)) {
          trie[key] = {};  // Make sure the character at i is present.
        }
        addToTrie(trie[key], s, i + 1);  // Add the suffix.
        // Since this is only used to build a trie of unicode escapes, we
        // want to normalize the hex digits.  An input of "\\uabcd" should
        // match all case permutations of the hex digit sequence abcd without
        // affecting the case of the 'u'.
        if (65/*A*/ <= cc && cc <= 70/*F*/) {
          cc |= 32;  // Convert upper case hex digit to lower case.
        } else if (97/*a*/ <= cc && cc <= 102/*f*/) {
          cc &= ~32;  // Convert lower case hex digit to upper case
        } else {
          return;
        }
        key = "" + cc;
        if (!HAS_OWN_PROPERTY.call(trie, key)) {
          trie[key] = {};
        }
        addToTrie(trie[key], s, i + 1);
      }
    }

    /**
     * Convert a trie in a form such as that produced above to a string of
     * RegExp source.
     *
     * E.g. the trie { 65: { 66: {}, 67: { 69: {} }, { 68: {} } } }
     * where 65 is the character code of 'A' and so on
     * corresponds to the regex "A(?:[BD]|CE)".
     */
    function trieToRegex(trie) {
      // First, identify all characters in this trie, and recurse, so we can
      // find the maximal set of preceders that are followed by the same
      // sequence.
      // If both letters 'A' and 'B' are followed by the trie that compiles to
      // the regex "foo", then we only need one foo since we can output
      // "[AB]foo" to cover both 'A' and 'B' branches.
      var childrenToRanges = {}, child;
      for (var k in trie) {
        if (!HAS_OWN_PROPERTY.call(trie, k)) { continue; }
        child = trieToRegex(trie[k]);
        if (!HAS_OWN_PROPERTY.call(childrenToRanges, child)) {
          childrenToRanges[child] = [];
        }
        childrenToRanges[child].push([+k, +k]);
      }
      // For every distinct suffix, produce a character set of its preceders
      // followed by the suffix.
      var options = [];
      for (child in childrenToRanges) {
        if (!HAS_OWN_PROPERTY.call(childrenToRanges, child)) { continue; }
        var ranges = collapseRanges(childrenToRanges[child]);
        options.push(rangesToCharsetParts(ranges) + child);
      }
      // Smooth out unreliable iteration order of for..in loop above.
      options.sort();
      // Produce an (..|..|..) construct that alternates between each
      // preceder charset and unique suffix pair.
      if (options.length < 2) {
        return options.join("");
      } else {
        return "(?:" + options.join("|") + ")";
      }
    }

    return "(?:" + rangesToCharsetParts(ranges) + "|" + trieToRegex(trie) + ")";
  }
}());
