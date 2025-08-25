const { interval, fromEvent, merge } = rxjs;
const { map, scan, startWith, switchMap } = rxjs.operators;

let currentLevel = 1;

// допоміжна функція для оновлення світлофора
function setLight(containerId, color) {
  const lights = document.querySelectorAll(`#${containerId} .light`);
  lights.forEach(l => l.classList.remove('active'));
  if (color) {
    const el = document.querySelector(`#${containerId} .${color}`);
    if (el) el.classList.add('active');
  }
}

// --- Level 1 ---
function level1() {
  document.getElementById('pedestrian-btn').style.display = 'none';
  document.getElementById('cross-traffic').style.display = 'none';
  document.getElementById('level-title').textContent = 'Рівень 1: Простий світлофор';

  interval(1000).pipe(
    map(i => i % 3) // 0,1,2
  ).subscribe(n => {
    if (n === 0) setLight('traffic-light', 'red');
    if (n === 1) setLight('traffic-light', 'yellow');
    if (n === 2) setLight('traffic-light', 'green');
  });
}

// --- Level 2 ---
function level2() {
  document.getElementById('pedestrian-btn').style.display = 'inline-block';
  document.getElementById('cross-traffic').style.display = 'none';
  document.getElementById('level-title').textContent = 'Рівень 2: Кнопка пішохода';

  const btn$ = fromEvent(document.getElementById('pedestrian-btn'), 'click').pipe(
    map(() => 'red')
  );

  const cycle$ = interval(1000).pipe(
    map(i => i % 3 === 0 ? 'red' : i % 3 === 1 ? 'yellow' : 'green')
  );

  merge(cycle$, btn$).subscribe(color => {
    setLight('traffic-light', color);
  });
}

// --- Level 3 ---
function level3() {
  document.getElementById('pedestrian-btn').style.display = 'none';
  document.getElementById('cross-traffic').style.display = 'block';
  document.getElementById('level-title').textContent = 'Рівень 3: Перехрестя';

  interval(2000).pipe(
    map(i => i % 2) // 0,1
  ).subscribe(n => {
    if (n === 0) {
      setLight('traffic-light', 'green');
      setLight('cross-traffic', 'red');
    } else {
      setLight('traffic-light', 'red');
      setLight('cross-traffic', 'green');
    }
  });
}

// --- Перемикач рівнів ---
document.getElementById('level1').addEventListener('click', () => { level1(); });
document.getElementById('level2').addEventListener('click', () => { level2(); });
document.getElementById('level3').addEventListener('click', () => { level3(); });

// старт з першого рівня
level1();
