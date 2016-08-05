var util = require('util');
var ms = require('./index.js').default;
var markdown = [
  '# header level 1',
  '## header level 2',
  '### header level 3',
  '#### header level 4',
  '##### header level 5',
  '###### header level 6',
  '# [header link 1](www.google.com)',
  '** bolded text **',
  '## **yo yo yo **',
  'just whatever',
  'you know, more stuff',
  '# more headers',
  '* emphasis? *',
  '_emphasis!_',
  '~~strikethrough ~~',
  '~~ *strikethrough* ~~',
].join('\n');

console.log(util.inspect(ms(markdown), false, null));
