// rx-levels.js (starter)
// ❗ Використовуємо ESM-імпорти RxJS та утиліти з ui.js
import { interval, fromEvent, merge, of, timer, concat } from "https://cdn.skypack.dev/rxjs@7";
import { map, startWith, switchMap, tap, delay, repeat, withLatestFrom } from "https://cdn.skypack.dev/rxjs@7/operators";
import { setLight, setSubscription, showLevel } from "./ui.js";

/* ================================================================
   🟢 Рівень 1 — «Простий світлофор»
   Мета: зібрати нескінченний цикл станів:
         червоний → жовтий → зелений → червоний → ...
   Підказки:
   - створи інтервал (наприклад, 1000 мс)
   - мапи індекс i % 3 на колір
   - не забувай setSubscription(sub) після subscribe(...)
   ================================================================ */
export function level1() {
  showLevel("Рівень 1: Простий світлофор", { pedestrian: false, crossTraffic: false });

  // TODO(1): створити потік, який кожну секунду видає 0,1,2 по колу
  // const cycle$ = ...

  // TODO(2): підписатися і на основі значення встановлювати колір:
  // 0 -> 'red', 1 -> 'yellow', 2 -> 'green'
  // const sub = cycle$.subscribe(n => { ... });

  // TODO(3): зберегти підписку через setSubscription(sub)
  // setSubscription(sub);

  // Тимчасово (видали після реалізації): засвітимо червоне як placeholder
  setLight("traffic-light", "red");
}

/* ================================================================
   🟡 Рівень 2 — «Кнопка пішохода»
   Мета: при натисканні кнопки "Пішохідний перехід" світлофор має
         негайно стати червоним і тримати цей стан N мс (наприклад 2000),
         після чого звичайний цикл продовжується.
   Підказки:
   - fromEvent(btn, 'click') дає потік кліків
   - заведи "режим" normal/ped через switchMap + timer
   - комбінуй режим з базовим циклом через withLatestFrom
   ================================================================ */
export function level2() {
  showLevel("Рівень 2: Кнопка пішохода", { pedestrian: true, crossTraffic: false });

  const btn = document.getElementById("pedestrian-btn");

  // TODO(1): базовий цикл кольорів з інтервалом (як у рівні 1), можна startWith('red')
  // const cycle$ = ...

  // TODO(2): потік режимів:
  // - при кліку: негайно 'ped', потім через 2000 мс назад у 'normal'
  // const mode$ = fromEvent(btn, 'click').pipe(
  //   switchMap(() => concat(of('ped'), timer(2000).pipe(map(()=>'normal')))),
  //   startWith('normal')
  // );

  // TODO(3): комбінувати cycle$ з mode$ так, щоб при mode==='ped' завжди малювався 'red'
  // const sub = cycle$.pipe(
  //   withLatestFrom(mode$),
  //   map(([color, mode]) => mode === 'ped' ? 'red' : color)
  // ).subscribe(color => setLight('traffic-light', color));

  // TODO(4): зберегти підписку
  // setSubscription(sub);

  // Placeholder, щоб було видно кнопку (видали після реалізації)
  setLight("traffic-light", "yellow");
}

/* ================================================================
   🔴 Рівень 3 — «Перехрестя»
   Мета: синхронізувати два світлофори:
         A: зелений → жовтий → all-red → B: зелений → жовтий → all-red → (повтор)
         жодного разу не допускаючи двох зелених одночасно.
   Підказки:
   - можна зробити ланцюжок фаз через concat(of(...).pipe(tap(...), delay(...)), ...).repeat()
   - або зробити невеликий state machine через scan
   - між напрямками обов'язково коротка фаза "all-red"
   ================================================================ */
export function level3() {
  showLevel("Рівень 3: Перехрестя", { pedestrian: false, crossTraffic: true });

  // Рекомендовані тривалості (можеш змінювати)
  const G = 4000; // green ms
  const Y = 1200; // yellow ms
  const Rg = 400; // all-red ms

  // TODO(1): опиши фази як послідовність, у кожній фазі через tap(...) малюй потрібні кольори:
  // - A green: A=green, B=red
  // - A yellow: A=yellow, B=red
  // - all-red: A=red, B=red
  // - B green: A=red, B=green
  // - B yellow: A=red, B=yellow
  //
  // Після tap(...) додай delay(тривалість фази), щоб потримати стан.
  // З'єднай фази через concat(...).pipe(repeat())
  //
  // const sequence$ = concat(
  //   of('A_G').pipe(tap(()=>{ ... }), delay(G)),
  //   of('A_Y').pipe(tap(()=>{ ... }), delay(Y)),
  //   of('AR').pipe(tap(()=>{ ... }), delay(Rg)),
  //   of('B_G').pipe(tap(()=>{ ... }), delay(G)),
  //   of('B_Y').pipe(tap(()=>{ ... }), delay(Y)),
  //   of('AR').pipe(tap(()=>{ ... }), delay(Rg))
  // ).pipe(repeat());

  // TODO(2): підписка на sequence$ (значення не використовуємо, усе робимо в tap)
  // const sub = sequence$.subscribe();
  // setSubscription(sub);

  // Placeholder, щоб щось було видно (видали після реалізації)
  setLight("traffic-light", "green");
  setLight("cross-traffic", "red");
}
