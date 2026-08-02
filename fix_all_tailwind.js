const fs = require('fs');
const path = require('path');

function processDir(dir) {
  let modifiedCount = 0;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      modifiedCount += processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // flex-shrink-0 -> shrink-0
      content = content.replace(/\bflex-shrink-0\b/g, 'shrink-0');
      
      // bg-gradient-to-x -> bg-linear-to-x
      content = content.replace(/\bbg-gradient-to-([a-z]+)\b/g, 'bg-linear-to-$1');

      // size classes with px
      content = content.replace(/\b(w|h|max-w|min-w|max-h|min-h|top|bottom|left|right|mt|mb|ml|mr|pt|pb|pl|pr|gap|p|m)-\[(\d+)px\]/g, (match, prefix, px) => {
        if (px === '1') return `${prefix}-px`;
        const num = parseInt(px, 10);
        return `${prefix}-${num / 4}`;
      });

      // size classes with rem
      content = content.replace(/\b(w|h|max-w|min-w|max-h|min-h|top|bottom|left|right|mt|mb|ml|mr|pt|pb|pl|pr|gap|p|m)-\[([\d.]+)rem\]/g, (match, prefix, rem) => {
        const num = parseFloat(rem);
        return `${prefix}-${num * 4}`;
      });

      // negative top/bottom etc
      content = content.replace(/-top-\[(\d+)px\]/g, (match, px) => {
        return `-top-${parseInt(px) / 4}`;
      });
      content = content.replace(/-bottom-\[(\d+)px\]/g, (match, px) => {
        return `-bottom-${parseInt(px) / 4}`;
      });
      
      // scroll-mt-[px]
      content = content.replace(/\bscroll-mt-\[(\d+)px\]/g, (match, px) => {
        return `scroll-mt-${parseInt(px) / 4}`;
      });

      // z-index
      content = content.replace(/\bz-\[(\d+)\]/g, 'z-$1');
      
      // stroke
      content = content.replace(/\bstroke-\[(\d+)\]/g, 'stroke-$1');
      
      // font-family
      content = content.replace(/font-\[family-name:var\(--font-([a-zA-Z0-9_-]+)\)\]/g, 'font-(family-name:--font-$1)');
      content = content.replace(/font-\['([^']+)',_?sans-serif\]/g, "font-['$1',sans-serif]");

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        modifiedCount++;
        console.log('Fixed:', fullPath);
      }
    }
  }
  return modifiedCount;
}

const count = processDir(path.join(__dirname, 'app')) + processDir(path.join(__dirname, 'components'));
console.log('Total files modified:', count);
