let useSolutions = false;
let currentLevel = 'level1'; // 'level1' | 'level2' | 'level3'

// динамически подгружаем нужный модуль
async function loadLevels() {
  const modulePath = useSolutions ? './rx-levels.answers.js' : './rx-levels.js';
  return await import(modulePath);
}

// запуск указанного уровня
async function runLevel(levelFnName) {
  currentLevel = levelFnName;
  const levels = await loadLevels();
  // у levels есть level1/level2/level3 — вызываем выбранный
  levels[levelFnName]();
}

// кнопки уровней
document.getElementById("level1").addEventListener("click", () => runLevel('level1'));
document.getElementById("level2").addEventListener("click", () => runLevel('level2'));
document.getElementById("level3").addEventListener("click", () => runLevel('level3'));

// переключатель «Показати рішення»
const toggle = document.getElementById("toggle-solutions");
toggle.addEventListener("change", async (e) => {
  useSolutions = e.target.checked;
  // сразу перезапускаем текущий уровень в выбранном режиме
  await runLevel(currentLevel);
});

// старт по умолчанию (учебная версия)
runLevel('level1');
