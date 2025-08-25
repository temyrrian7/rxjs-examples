import { interval, fromEvent, merge } from "https://cdn.skypack.dev/rxjs@7";
import { map } from "https://cdn.skypack.dev/rxjs@7/operators";
import { setLight, setSubscription, showLevel } from "./ui.js";

// --- Level 1 ---
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

// --- Level 2 ---
export function level2() {
  showLevel("Рівень 2: Кнопка пішохода", { pedestrian: true, crossTraffic: false });

  const btn$ = fromEvent(document.getElementById("pedestrian-btn"), "click").pipe(
    map(() => "red")
  );

  const cycle$ = interval(1000).pipe(
    map(i => i % 3 === 0 ? "red" : i % 3 === 1 ? "yellow" : "green")
  );

  const sub = merge(cycle$, btn$).subscribe(color => {
    setLight("traffic-light", color);
  });

  setSubscription(sub);
}

// --- Level 3 ---
export function level3() {
  showLevel("Рівень 3: Перехрестя", { pedestrian: false, crossTraffic: true });

  const sub = interval(2000).pipe(
    map(i => i % 2) // 0,1
  ).subscribe(n => {
    if (n === 0) {
      setLight("traffic-light", "green");
      setLight("cross-traffic", "red");
    } else {
      setLight("traffic-light", "red");
      setLight("cross-traffic", "green");
    }
  });

  setSubscription(sub);
}
