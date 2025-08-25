// rx-levels.js
import { interval, fromEvent, merge, of, timer, concat } from "https://cdn.skypack.dev/rxjs@7";
import { map, startWith, switchMap, tap, delay, repeat, withLatestFrom } from "https://cdn.skypack.dev/rxjs@7/operators";
import { setLight, setSubscription, showLevel } from "./ui.js";

/* -------------------- Level 1 -------------------- */
export function level1() {
  showLevel("Рівень 1: Простий світлофор", { pedestrian: false, crossTraffic: false });

  const sub = interval(1000).pipe(
    map(i => i % 3) // 0,1,2
  ).subscribe(n => {
    if (n === 0) setLight("traffic-light", "red");
    if (n === 1) setLight("traffic-light", "yellow");
    if (n === 2) setLight("traffic-light", "green");
  });

  setSubscription(sub);
}

/* -------------------- Level 2 -------------------- */
/* Кнопка пішохода: при кліку тримаємо ЧЕРВОНИЙ 2000 мс, потім цикл продовжується */
export function level2() {
  showLevel("Рівень 2: Кнопка пішохода", { pedestrian: true, crossTraffic: false });

  const btn = document.getElementById("pedestrian-btn");

  // Базовий цикл
  const cycle$ = interval(1000).pipe(
    map(i => i % 3 === 0 ? "red" : i % 3 === 1 ? "yellow" : "green"),
    startWith("red")
  );

  // Режим: normal | ped (клік => 2 секунди ped, потім normal)
  const mode$ = fromEvent(btn, "click").pipe(
    switchMap(() =>
      concat(
        of("ped"),                // негайно увійшли у режим пішохода
        timer(2000).pipe(map(() => "normal")) // через 2с повернулись у normal
      )
    ),
    startWith("normal")
  );

  // Малюємо за тіком циклу, але якщо mode === 'ped' — примусово ЧЕРВОНИЙ
  const sub = cycle$.pipe(
    withLatestFrom(mode$),
    map(([color, mode]) => (mode === "ped" ? "red" : color))
  ).subscribe(color => setLight("traffic-light", color));

  setSubscription(sub);
}

/* -------------------- Level 3 -------------------- */
/* Два світлофори з міжфазними паузами:
   A: зелений → жовтий → all-red → B: зелений → жовтий → all-red → (повтор)
*/
export function level3() {
  showLevel("Рівень 3: Перехрестя", { pedestrian: false, crossTraffic: true });

  // Тривалості (мс) – можна підкрутити
  const G = 4000;   // green
  const Y = 1200;   // yellow
  const Rg = 400;   // all-red (між напрямками)

  // Допоміжні функції для відмалювання фаз
  const A_GREEN = () => { setLight("traffic-light", "green"); setLight("cross-traffic", "red");   assertNoConflict(); };
  const A_YELLW = () => { setLight("traffic-light", "yellow"); setLight("cross-traffic", "red");  assertNoConflict(); };
  const ALL_RED = () => { setLight("traffic-light", "red"); setLight("cross-traffic", "red");     assertNoConflict(); };
  const B_GREEN = () => { setLight("traffic-light", "red"); setLight("cross-traffic", "green");   assertNoConflict(); };
  const B_YELLW = () => { setLight("traffic-light", "red"); setLight("cross-traffic", "yellow");  assertNoConflict(); };

  // Ланцюжок фаз, що повторюється нескінченно.
  // Використовуємо tap() щоб малювати одразу при вході у фазу,
  // а delay() — щоб потримати фазу потрібний час, перш ніж перейти далі.
  const sequence$ = concat(
    of("A_G").pipe( tap(A_GREEN), delay(G) ),
    of("A_Y").pipe( tap(A_YELLW), delay(Y) ),
    of("AR").pipe( tap(ALL_RED),  delay(Rg) ),
    of("B_G").pipe( tap(B_GREEN), delay(G) ),
    of("B_Y").pipe( tap(B_YELLW), delay(Y) ),
    of("AR").pipe( tap(ALL_RED),  delay(Rg) )
  ).pipe(repeat());

  const sub = sequence$.subscribe(); // значення не використовуємо, усе в tap()

  setSubscription(sub);
}

/* --------- утиліта для виявлення конфлікту (два зелених) --------- */
function assertNoConflict() {
  const aGreen = document.querySelector('#traffic-light .green')?.classList.contains('active');
  const bGreen = document.querySelector('#cross-traffic .green')?.classList.contains('active');
  if (aGreen && bGreen) {
    console.error("❌ Конфлікт: два зелених одночасно!");
  }
}
