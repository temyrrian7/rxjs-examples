import { level1, level2, level3 } from "./rx-levels.js";

// --- Перемикач рівнів ---
document.getElementById("level1").addEventListener("click", () => { level1(); });
document.getElementById("level2").addEventListener("click", () => { level2(); });
document.getElementById("level3").addEventListener("click", () => { level3(); });

// старт з першого рівня
level1();
