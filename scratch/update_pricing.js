const fs = require('fs');

const filePath = 'c:\\Users\\ohioa\\Projects\\React\\testing\\components\\HomeClient.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the slider card pricing section:
// Old: shows product.price and product.originalPrice
// New: shows deal.flashPrice (or product.price fallback) with original price struck through

content = content.replace(
  /(<h3 className="text-sm text-foreground\/80 font-medium line-clamp-1 mb-1" title=\{product\.name\}>\{product\.name\}<\/h3>\s*)<div className="font-black text-lg text-foreground mb-0\.5">\{product\.price\}<\/div>\s*\{product\.originalPrice && <div className="text-xs text-foreground\/40 line-through mb-2">\{product\.originalPrice\}<\/div>\}/,
  `$1<div className="font-black text-lg text-foreground mb-0.5">
                        {deal.flashPrice ? \`₦\${Number(deal.flashPrice).toLocaleString()}\` : product.price}
                      </div>
                      {deal.flashPrice && (
                        <div className="text-xs text-foreground/40 line-through mb-2">₦{Number(product.rawPrice).toLocaleString()}</div>
                      )}`
);

fs.writeFileSync(filePath, content);
console.log('Successfully updated slider pricing in HomeClient.tsx');
