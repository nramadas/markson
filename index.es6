const TYPES = {
  HEADER:           'h',
  ANCHOR:           'a',
  STRONG:           'strong',
  EMPHASIS:         'em',
  DELETE:           'del',
  QUOTE:            'quote',
  INLINE_CODE:      'inlineCode',
  UNORDERED_LIST:   'ul',
  ORDERED_LIST:     'ol',
  BLOCKQUOTE:       'blockquote',
  HORIZONTAL_RULE:  'horizRule',
  PARAGRAPH:        'p',
};

const EXPRESSIONS = [
  [TYPES.HEADER,           /(#+)(.*)/],
  [TYPES.ANCHOR,           /\[([^\[]+)\]\(([^\)]+)\)/],
  [TYPES.STRONG,           /(\*\*|__)(.*?)\1/],
  [TYPES.EMPHASIS,         /(\*|_)(.*?)\1/],
  [TYPES.DELETE,           /(\~\~)(.*?)\1/],
  [TYPES.QUOTE,            /(\:\")(.*?)\"\:/],
  [TYPES.INLINE_CODE,      /`(.*?)`/],
  [TYPES.UNORDERED_LIST,   /`(.*?)`/],
  [TYPES.ORDERED_LIST,     /\n[0-9]+\.(.*)/],
  [TYPES.BLOCKQUOTE,       /\n[0-9]+\.(.*)/],
  [TYPES.HORIZONTAL_RULE,  /\n-{5,}/],
  // [TYPES.PARAGRAPH,        /\n([^\n]+)\n/],
];

/*
  func clamp: clamp a number between a min and a max
  @param  {number} min - lowest the result can be
  @param  {number} max - highest the result can be
  @return {number}     - a number clamped between min and max
*/
const clamp = (num, min, max) => Math.min(max, Math.max(min, num));

/*
  func md: Takes a valid markdown string and converts it into an
  object tree that represents the markdown.
  @param  {string} md           - A string of valid markdown
  @return {array<object|array>} - An object tree representing the markdown
                                  structure
*/
export default function parseMarkdown(md) {
  if (!md) return [];

  const result = runParser(md);

  return Array.isArray(result)
    ? result
    : [{ type: TYPES.PARAGRAPH, children: result, text: result }];
};

/*
  func runParser: takes valid markdown text and parses it
  @param  {string} text                - A string of valid markdown
  @return {array<object|array>|string} - Either an object tree representing the
                                         markdown structure, or a string which
                                         is the markdown itself
*/
const runParser = text => {
  const parsed = parseText(text);

  if (Array.isArray(parsed)) {
    const [pre, matched, remaining] = parsed;

    return (pre ? [{ type: TYPES.PARAGRAPH, children: pre.replace(/\n/g, ' '), text: pre }] : [])
      .concat(matched)
      .concat(parseMarkdown(remaining));
  } else {
    return text.replace(/\n/g, ' ');
  }
};

/*
  func parseStatement: Take a subset of a line of markdown and parse it
  @param  {string} inputText            - Some valid markdown text
  @return {array<object|array>|string}  - An object representation of that line
                                          of markdown or the statment itself if
                                          there are no matches
*/
const parseText = inputText => {
  let currentResult = null;
  let currentType = '';

  for (let index in EXPRESSIONS) {
    const [type, reg] = EXPRESSIONS[index];
    const result = reg.exec(inputText);
    if (result && (!currentResult || (result.index < currentResult.index))) {
      currentResult = result;
      currentType = type;
    }
  }

  if (currentResult) {
    const [matchedText, ...matchedArgs] = currentResult.map(x => x.trim());
    const [preMatch, remaining] = inputText.split(matchedText).map(x => x.trim());

    let nodeType = currentType;
    let children = '';

    switch (currentType) {
      case TYPES.HEADER: {
        const headerNum = clamp(matchedArgs[0].length, 1, 6);
        const headerText = matchedArgs[1];

        nodeType = `${TYPES.HEADER}${headerNum}`;
        children = runParser(headerText);
      }
      case TYPES.ANCHOR: {
        const [text, url] = matchedArgs;
        children = { text, url };
      }
      case TYPES.STRONG:
      case TYPES.EMPHASIS:
      case TYPES.DELETE: {
        children = runParser(matchedArgs[1]);
      }
      default: {
        console.log(matchedText, matchedArgs);
      }
    }

    const node = { type: nodeType, text: matchedText, children };
    return [preMatch, node, remaining];
  }

  // no matches
  return inputText;
};
