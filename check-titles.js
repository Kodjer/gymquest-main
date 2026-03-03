const fs = require('fs');
const content = fs.readFileSync('src/lib/questBank.ts', 'utf8');
const titles = [...content.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);

// Keywords from LottieAnimation.tsx that are currently mapped
const keywords = [
  "push-up","pushup","отжимани","squat","приседани","plank","планк",
  "burpee","бёрпи","берпи","jumping jack","jumping-jack","jumpingjack","джампинг",
  "lunge","выпад","stretch","растяжк","cobra","кобра","yoga","йога","пилатес","шпагат","гибкост",
  "водный балан","водной балан","водный","выпей вод","drinking","water","вода","воду",
  "здоровый сон","сон","спать","sleep","ночной",
  "meditat","медитац","breath","дыхан",
  "run","cardio","treadmill","hiit","sprint","бег","кардио","дорожк","пробежк","пробег","спринт","ходьб","ходить",
  "jump rope","jump-rope","jumprope","rope","скакалк","прыжки",
  "pull-up","pullup","chin-up","подтягива",
  "lat pull","lat-pull","тяга верхн","верхняя тяг",
  "bicep","curl","бицепс","сгибани","молотков","гантел",
  "tricep","трицепс","разгибани рук","french",
  "deadlift","становая","румынск",
  "bench","жим лёж","жим лежа","chest press","разводк","флай",
  "dip","брусь",
  "shoulder","плеч","press","жим",
  "mountain","climber","скалолаз",
  "high knee","high-knee","колен",
  "leg ext","разгибани","step up","ступеньк",
  "cable row","тяга нижн","нижняя тяг","тяга к поясу","горизонт","inchworm",
  "crunch","abs","пресс","кранч","reverse",
  "тяга"
];

const unmatched = titles.filter(title => {
  const lower = title.toLowerCase();
  return !keywords.some(kw => lower.includes(kw.toLowerCase()));
});

console.log("=== TITLES WITH NO ANIMATION MATCH (show default burpee) ===");
unmatched.forEach(t => console.log(" -", t));
console.log("\nTotal unmatched:", unmatched.length, "of", titles.length);
