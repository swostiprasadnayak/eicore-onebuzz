const fs = require('fs');
let code = fs.readFileSync('src/EicorePrototype.tsx', 'utf8');

// View tabs (Prototype / Case Study)
code = code.replace(
  /<button key=\{v\} onClick=\{\(\) => setView\(v\)\}/g,
  '<button className="nav-tab" key={v} onClick={() => setView(v)}'
);

// Any other transparent button tabs?
// "Clear" button (line ~421)
code = code.replace(
  /<button onClick=\{\(\) => setActiveLink\(null\)\} style=\{\{ marginLeft: "auto",/g,
  '<button className="nav-tab" onClick={() => setActiveLink(null)} style={{ marginLeft: "auto",'
);

fs.writeFileSync('src/EicorePrototype.tsx', code);
console.log('More classes added');
