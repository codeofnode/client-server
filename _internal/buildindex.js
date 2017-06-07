const fs = require('fs');

let strs = [], cssd = true, jsd = true;
fs.readFileSync(__dirname+'/../dist/static/index.html').toString().split('\n').forEach((line)=>{
  if(line.indexOf('link rel') !== -1){
    if(cssd){
      strs.push('  <link rel="stylesheet" href="/style.css"/>');
      cssd = false;
    }
  } else if(line.indexOf('script src') !== -1){
    if(jsd){
      strs.push('    <script src="/script.js"></script>');
      jsd = false;
    }
  } else {
    strs.push(line);
  }
});

fs.writeFileSync(__dirname+'/../dist/static/index.html',strs.join('\n'));
