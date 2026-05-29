const fs = require('fs');

let code = fs.readFileSync('src/EicorePrototype.tsx', 'utf8');

// 1. Sidebar step cards: <div key={step.id} onClick={() => setCurrentStep(step.id)}
code = code.replace(
  /<div key=\{step\.id\} onClick=\{\(\) => setCurrentStep\(step\.id\)\}/g,
  '<div key={step.id} onClick={() => setCurrentStep(step.id)} className="sidebar-step-card"'
);

// 2. Drag drop zone: style={{ border: `1px dashed ${drag ? C.brand : C.borderStrong}`,
code = code.replace(
  /style=\{\{ border: `1px dashed \$\{drag \? C\.brand : C\.borderStrong\}`,/g,
  'className="upload-zone" style={{ border: `1px dashed ${drag ? C.brand : C.borderStrong}`,'
);

// 3. Nav tabs for docs (line ~430)
// <button key={i} onClick={() => setDocTab(i)} style={{ padding: "10px 14px",
code = code.replace(
  /<button key=\{i\} onClick=\{\(\) => setDocTab\(i\)\} style=\{\{ padding: "10px 14px",/g,
  '<button className="nav-tab" key={i} onClick={() => setDocTab(i)} style={{ padding: "10px 14px",'
);

fs.writeFileSync('src/EicorePrototype.tsx', code);
console.log('Classes added');
