const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\ohioa\\Projects\\React\\testing\\components\\HomeClient.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove simulated stock variables
content = content.replace(
  /const itemsLeft = Math\.floor\(Math\.random\(\) \* 50\) \+ 1; \/\/ Simulated stock\n\s*const totalItems = itemsLeft \+ Math\.floor\(Math\.random\(\) \* 50\);\n\s*const percentLeft = Math\.round\(\(itemsLeft \/ totalItems\) \* 100\);/,
  '// Real stock data used below'
);

// 2. Replace items left text
content = content.replace(
  /\{itemsLeft\} items left/g,
  '{deal.stockSold >= (deal.stockTotal || 100) ? "Sold Out" : `${(deal.stockTotal || 100) - deal.stockSold} items left`}'
);

// 3. Replace progress bar width
content = content.replace(
  /style=\{\{ width: `\$\{percentLeft\}%` \}\}/g,
  'style={{ width: `${Math.min(Math.max((deal.stockSold / (deal.stockTotal || 100)) * 100, 5), 100)}%` }}'
);

fs.writeFileSync(filePath, content);
console.log('Successfully updated HomeClient.tsx');
