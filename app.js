// Достаём RxJS из глобального rxjs (UMD)
const { fromEvent, merge } = rxjs;
const { debounceTime, map, filter, scan, startWith, tap } = rxjs.operators;

const input = document.getElementById('search');
const currentEl = document.getElementById('current');
const upperEl = document.getElementById('upper');
const lenEl = document.getElementById('len');
const clearBtn = document.getElementById('clear');

// Поток ввода
const input$ = fromEvent(input, 'input').pipe(
  map(e => e.target.value)
);

// Дебаунс, игнор пустого
const debounced$ = input$.pipe(
  debounceTime(400),
  filter(v => v.trim().length > 0)
);

// Отображаем текущее значение «как есть»
input$.subscribe(v => { currentEl.textContent = v || '—'; });

// В верхний регистр (map)
debounced$
  .pipe(map(v => v.toUpperCase()))
  .subscribe(v => { upperEl.textContent = v; });

// Считаем длину (scan на последнем значении)
merge(input$, debounced$)
  .pipe(
    map(v => v.length),
    startWith(0)
  )
  .subscribe(n => { lenEl.textContent = String(n); });

// Кнопка очистки
fromEvent(clearBtn, 'click').subscribe(() => {
  input.value = '';
  currentEl.textContent = '—';
  upperEl.textContent = '—';
  lenEl.textContent = '0';
  input.focus();
});
