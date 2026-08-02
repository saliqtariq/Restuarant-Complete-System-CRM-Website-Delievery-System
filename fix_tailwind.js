const fs = require('fs');
const problems = [
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\(admin)\\dashboard\\drivers\\page.tsx", "message": "The class `max-w-[200px]` can be written as `max-w-50`", "startLine": 121 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\(admin)\\dashboard\\page.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 83 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\admin\\login\\page.tsx", "message": "The class `max-w-[380px]` can be written as `max-w-95`", "startLine": 49 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\admin\\login\\page.tsx", "message": "The class `bg-gradient-to-r` can be written as `bg-linear-to-r`", "startLine": 60 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\checkout\\page.tsx", "message": "The class `bg-gradient-to-br` can be written as `bg-linear-to-br`", "startLine": 205 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\checkout\\page.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 244 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\checkout\\page.tsx", "message": "The class `min-w-[90px]` can be written as `min-w-22.5`", "startLine": 445 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\signin\\page.tsx", "message": "The class `max-w-[400px]` can be written as `max-w-100`", "startLine": 92 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\signin\\page.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 128 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\signin\\page.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 214 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\app\\signin\\page.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 239 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Header.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 160 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Header.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 175 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Header.tsx", "message": "The class `min-w-[16px]` can be written as `min-w-4`", "startLine": 205 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Header.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 258 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Header.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 275 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Header.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 298 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Sidebar.tsx", "message": "The class `min-w-[20px]` can be written as `min-w-5`", "startLine": 116 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Sidebar.tsx", "message": "The class `w-[220px]` can be written as `w-55`", "startLine": 142 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\Sidebar.tsx", "message": "The class `w-[260px]` can be written as `w-65`", "startLine": 156 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `h-[200px]` can be written as `h-50`", "startLine": 18 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `h-[200px]` can be written as `h-50`", "startLine": 22 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `h-[140px]` can be written as `h-35`", "startLine": 58 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `w-[140px]` can be written as `w-35`", "startLine": 63 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `h-[140px]` can be written as `h-35`", "startLine": 63 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 90 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `max-w-[90px]` can be written as `max-w-22.5`", "startLine": 92 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `h-[140px]` can be written as `h-35`", "startLine": 113 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\AnalyticsWidgets.tsx", "message": "The class `max-w-[120px]` can be written as `max-w-30`", "startLine": 126 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\LiveOrdersTable.tsx", "message": "The class `max-w-[120px]` can be written as `max-w-30`", "startLine": 173 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\LiveOrdersTable.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 193 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\LiveOrdersTable.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 199 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\LiveOrdersTable.tsx", "message": "The class `max-w-[80px]` can be written as `max-w-20`", "startLine": 200 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\ReviewsTable.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 92 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\RightSidebarWidgets.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 22 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\RightSidebarWidgets.tsx", "message": "The class `max-w-[80px]` can be written as `max-w-20`", "startLine": 54 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\RightSidebarWidgets.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 96 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\RightSidebarWidgets.tsx", "message": "The class `xl:w-[300px]` can be written as `xl:w-75`", "startLine": 117 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\admin\\widgets\\SummaryCards.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 71 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\FeedbackForm.tsx", "message": "The class `max-w-[200px]` can be written as `max-w-50`", "startLine": 84 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\FeedbackForm.tsx", "message": "The class `h-[1px]` can be written as `h-px`", "startLine": 85 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\FeedbackForm.tsx", "message": "The class `h-[1px]` can be written as `h-px`", "startLine": 87 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\FeedbackForm.tsx", "message": "The class `min-h-[120px]` can be written as `min-h-30`", "startLine": 132 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Footer.tsx", "message": "The class `w-[168px]` can be written as `w-42`", "startLine": 87 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Footer.tsx", "message": "The class `h-[52px]` can be written as `h-13`", "startLine": 94 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Footer.tsx", "message": "The class `w-[120px]` can be written as `w-30`", "startLine": 157 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Footer.tsx", "message": "The class `h-[40px]` can be written as `h-10`", "startLine": 157 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Footer.tsx", "message": "The class `w-[120px]` can be written as `w-30`", "startLine": 160 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Footer.tsx", "message": "The class `h-[40px]` can be written as `h-10`", "startLine": 160 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `z-[100]` can be written as `z-100`", "startLine": 107 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `max-w-[1400px]` can be written as `max-w-350`", "startLine": 108 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `md:w-[420px]` can be written as `md:w-105`", "startLine": 111 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `lg:w-[460px]` can be written as `lg:w-115`", "startLine": 111 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `max-w-[260px]` can be written as `max-w-65`", "startLine": 218 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `max-w-[240px]` can be written as `max-w-60`", "startLine": 235 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `max-w-[220px]` can be written as `max-w-55`", "startLine": 238 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\LocationModal.tsx", "message": "The class `max-w-[200px]` can be written as `max-w-50`", "startLine": 346 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\CartSidebar.tsx", "message": "The class `top-[100px]` can be written as `top-25`", "startLine": 19 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\CartSidebar.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 57 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\CartSidebar.tsx", "message": "The class `bg-gradient-to-r` can be written as `bg-linear-to-r`", "startLine": 123 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\CrowdPleasers.tsx", "message": "The class `bg-gradient-to-t` can be written as `bg-linear-to-t`", "startLine": 75 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\ExploreMenu.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 61 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\ExploreMenu.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 81 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\ExploreMenu.tsx", "message": "The class `top-[-50px]` can be written as `-top-12.5`", "startLine": 91 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\ExploreMenu.tsx", "message": "The class `bottom-[85px]` can be written as `bottom-21.25`", "startLine": 91 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\ExploreMenu.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 121 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\MenuCategoryList.tsx", "message": "The class `top-[16px]` can be written as `top-4`", "startLine": 88 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\MenuCategoryList.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 94 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\MenuCategoryList.tsx", "message": "The class `scroll-mt-[150px]` can be written as `scroll-mt-37.5`", "startLine": 111 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\MenuCategoryList.tsx", "message": "The class `xl:w-[380px]` can be written as `xl:w-95`", "startLine": 199 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\PopularItems.tsx", "message": "The class `min-w-[1.5rem]` can be written as `min-w-6`", "startLine": 94 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\menu\\PopularItems.tsx", "message": "The class `stroke-[3]` can be written as `stroke-3`", "startLine": 132 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 66 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `font-[family-name:var(--font-anton)]` can be written as `font-(family-name:--font-anton)`", "startLine": 80 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `h-[3px]` can be written as `h-0.75`", "startLine": 86 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `h-[3px]` can be written as `h-0.75`", "startLine": 90 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `h-[3px]` can be written as `h-0.75`", "startLine": 94 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `h-[3px]` can be written as `h-0.75`", "startLine": 98 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `font-['Avenir_Next',_sans-serif]` can be written as `font-['Avenir_Next',sans-serif]`", "startLine": 104 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `max-w-[250px]` can be written as `max-w-62.5`", "startLine": 106 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `xl:max-w-[300px]` can be written as `xl:max-w-75`", "startLine": 106 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `max-w-[160px]` can be written as `max-w-40`", "startLine": 113 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `xl:max-w-[200px]` can be written as `xl:max-w-50`", "startLine": 113 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `font-[family-name:var(--font-anton)]` can be written as `font-(family-name:--font-anton)`", "startLine": 200 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 315 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `min-w-[1.5rem]` can be written as `min-w-6`", "startLine": 350 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Navbar.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 368 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Toast.tsx", "message": "The class `min-w-[340px]` can be written as `min-w-85`", "startLine": 62 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Toast.tsx", "message": "The class `max-w-[420px]` can be written as `max-w-105`", "startLine": 62 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Toast.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 69 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Toast.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 84 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Toast.tsx", "message": "The class `flex-shrink-0` can be written as `shrink-0`", "startLine": 111 },
  { "path": "c:\\Users\\Dell\\Desktop\\demorestaurant\\components\\Toast.tsx", "message": "The class `z-[100]` can be written as `z-100`", "startLine": 127 }
];

let filesModified = new Set();
problems.forEach(p => {
  if (p.message.includes('can be written as')) {
    let match = p.message.match(/The class `([^`]+)` can be written as `([^`]+)`/);
    if (match) {
      let oldClass = match[1];
      let newClass = match[2];
      try {
        let content = fs.readFileSync(p.path, 'utf8');
        let lines = content.split('\n');
        let lineIdx = p.startLine - 1;
        if (lines[lineIdx].includes(oldClass)) {
          lines[lineIdx] = lines[lineIdx].replace(oldClass, newClass);
          fs.writeFileSync(p.path, lines.join('\n'), 'utf8');
          filesModified.add(p.path);
          console.log(`Replaced ${oldClass} with ${newClass} in ${p.path}:${p.startLine}`);
        } else {
          console.log(`Could not find ${oldClass} in ${p.path}:${p.startLine}`);
        }
      } catch (e) {
        console.error('Error on', p.path, e.message);
      }
    }
  }
});
console.log('Modified files:', filesModified.size);
