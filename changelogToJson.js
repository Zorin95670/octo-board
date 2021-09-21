const fs = require('fs');

fs.readFile('./CHANGELOG', 'utf8', (err, data) => {
  if (err) {
    return;
  }
  const json = [];
  let passFirstPush = false;
  let version = {};
  let type;
  data.split('\n')
    .filter((line) => ['## ', '### ', '* '].some((s) => line.startsWith(s)))
    .forEach((line) => {
      let text = line;
      if (line.startsWith('## ')) {
        if (passFirstPush) {
          json.push(version);
        } else {
          passFirstPush = true;
        }
        text = line.substring(3)
          .replace(': version ', ' ')
          .split(' ');
        version = {
          date: text[0].trim(),
          version: text[1].trim(),
          misc: [],
          features: [],
          bugs: [],
        };
        return;
      }
      if (line.startsWith('### ')) {
        if (line.startsWith('Bug fixes', 4)) {
          type = 'bugs';
        } else if (line.startsWith('New features', 4)) {
          type = 'features';
        } else {
          type = 'misc';
        }
        return;
      }
      version[type].push(line.replace('* ', ''));
    });
  fs.writeFileSync('./public/changelog.json', JSON.stringify(json));
});
