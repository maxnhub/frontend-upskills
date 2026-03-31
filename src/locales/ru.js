const chaptersData = [
  {
    id: 1,
    title: 'JavaScript: Компилятор и среда выполнения',
    Lessons: [
      {
        id: 1,
        title: 'Event Loop: очереди, Web APIs, микро- и макро-таски',
        content: `
          <h3>Что такое Event Loop?</h3>
          <p>Event Loop (цикл событий) — это механизм, который позволяет JavaScript выполнять неблокирующие операции, несмотря на то что язык является однопоточным. Он постоянно проверяет стек вызовов и очереди задач, перемещая колбэки из очередей в стек, когда тот пустой.</p>

          <h3>Компоненты Event Loop</h3>
          <ul>
            <li><strong>Call Stack</strong> — стек вызовов, где выполняется синхронный код. Работает по принципу LIFO (Last In, First Out).</li>
            <li><strong>Web APIs</strong> — браузерные API (<code>setTimeout</code>, <code>fetch</code>, <code>DOM Events</code>), которые выполняют операции асинхронно вне основного потока.</li>
            <li><strong>Callback Queue (Task Queue)</strong> — очередь макро-задач: <code>setTimeout</code>, <code>setInterval</code>, события DOM.</li>
            <li><strong>Microtask Queue</strong> — очередь микро-задач: <code>Promise.then()</code>, <code>queueMicrotask()</code>, <code>MutationObserver</code>.</li>
          </ul>

          <h3>Порядок выполнения</h3>
          <ol>
            <li>Выполняется весь синхронный код в Call Stack.</li>
            <li>Обрабатываются <strong>все</strong> микро-задачи (Microtask Queue) до опустошения.</li>
            <li>Берётся <strong>одна</strong> макро-задача из Callback Queue.</li>
            <li>После выполнения макро-задачи снова обрабатываются все накопившиеся микро-задачи.</li>
            <li>Цикл повторяется.</li>
          </ol>

          <h3>Пример</h3>
          <pre><code>console.log('1'); // синхронный код

setTimeout(() => {
  console.log('2'); // макро-задача
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // микро-задача
});

console.log('4'); // синхронный код

// Вывод: 1, 4, 3, 2</code></pre>

          <div class="note">
            <p><strong>Важно:</strong> Микро-задачи всегда выполняются раньше макро-задач! Даже если <code>setTimeout</code> с задержкой 0 был поставлен раньше <code>Promise.then()</code>.</p>
          </div>

          <h3>queueMicrotask()</h3>
          <p>Позволяет явно добавить колбэк в очередь микро-задач:</p>
          <pre><code>queueMicrotask(() => {
  console.log('Микро-задача');
});

setTimeout(() => {
  console.log('Макро-задача');
}, 0);

// Вывод: Микро-задача, Макро-задача</code></pre>
        `,
        practice: {
          task: 'Определите порядок вывода в консоль. Напишите результат через запятую (например: 1, 2, 3):',
          initialCode: `// Какой будет порядок вывода?\nconsole.log('A');\n\nsetTimeout(() => console.log('B'), 0);\n\nPromise.resolve()\n  .then(() => console.log('C'))\n  .then(() => console.log('D'));\n\nconsole.log('E');\n\n// Ваш ответ (порядок букв через запятую):\n// `,
          solution: `// Какой будет порядок вывода?\nconsole.log('A');\n\nsetTimeout(() => console.log('B'), 0);\n\nPromise.resolve()\n  .then(() => console.log('C'))\n  .then(() => console.log('D'));\n\nconsole.log('E');\n\n// Ваш ответ (порядок букв через запятую):\n// A, E, C, D, B`,
          hint: 'Сначала выполняется весь синхронный код (A, E), затем все микро-задачи (Promise.then → C, D), и только потом макро-задачи (setTimeout → B).',
        },
      },
      {
        id: 2,
        title: 'Промисы: цепочки, обработка ошибок, async/await',
        content: `
          <h3>Что такое Promise?</h3>
          <p>Promise — это объект, представляющий результат асинхронной операции. Он может находиться в одном из трёх состояния:</p>
          <ul>
            <li><strong>pending</strong> — начальное состояние, операция ещё не завершена.</li>
            <li><strong>fulfilled</strong> — операция успешно завершена.</li>
            <li><strong>rejected</strong> — операция завершена с ошибкой.</li>
          </ul>

          <h3>Создание промиса</h3>
          <pre><code>const promise = new Promise((resolve, reject) => {
  const isSuccess = true;
  if (isSuccess) {
    resolve('Данные получены');
  } else {
    reject(new Error('Ошибка'));
  }
});</code></pre>

          <h3>Цепочки промисов</h3>
          <p>Метод <code>.then()</code> всегда возвращает новый промис, что позволяет строить цепочки:</p>
          <pre><code>fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error('Ошибка:', error));</code></pre>

          <h3>Обработка ошибок</h3>
          <p><code>.catch()</code> перехватывает ошибки из любого предыдущего звена цепочки:</p>
          <pre><code>Promise.resolve(1)
  .then(val => { throw new Error('Упс!'); })
  .then(val => console.log('Не выполнится'))
  .catch(err => console.log(err.message)) // "Упс!"
  .then(() => console.log('Выполнится после catch'));</code></pre>

          <h3>async/await — синтаксический сахар</h3>
          <p><code>async/await</code> делает асинхронный код похожим на синхронный. Под капотом <code>async</code>-функция всегда возвращает промис:</p>
          <pre><code>const fetchUser = async (id) => {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    throw error;
  }
};</code></pre>

          <h3>Promise.all, Promise.race, Promise.allSettled</h3>
          <ul>
            <li><strong>Promise.all()</strong> — ждёт выполнения всех промисов; при reject любого — сразу reject.</li>
            <li><strong>Promise.race()</strong> — возвращает результат первого завершившегося промиса.</li>
            <li><strong>Promise.allSettled()</strong> — ждёт завершения всех промисов, возвращает статус каждого.</li>
          </ul>
          <pre><code>const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments'),
]);
// [{status: 'fulfilled', value: ...}, {status: 'rejected', reason: ...}, ...]</code></pre>

          <div class="note">
            <p><strong>Совет:</strong> Всегда обрабатывайте ошибки в промисах! Необработанный reject приведёт к <code>UnhandledPromiseRejection</code>.</p>
          </div>
        `,
        practice: {
          task: 'Напишите функцию delay(ms), которая возвращает промис, разрешающийся через ms миллисекунд.',
          initialCode: `const delay = (ms) => {\n  // Ваш код здесь\n};`,
          solution: `const delay = (ms) => {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n};`,
          hint: 'Используйте конструктор new Promise() и setTimeout внутри него. Вызовите resolve внутри setTimeout.',
        },
      },
      {
        id: 3,
        title: 'Контекст: this, bind/call/apply, стрелочные функции',
        content: `
          <h3>Что такое this?</h3>
          <p><code>this</code> — это ключевое слово, которое ссылается на объект, в контексте которого была вызвана функция. Значение <code>this</code> определяется <strong>в момент вызова</strong>, а не в момент объявления.</p>

          <h3>Правила определения this</h3>
          <ul>
            <li><strong>Глобальный контекст:</strong> <code>this</code> === <code>window</code> (в браузере) или <code>globalThis</code>.</li>
            <li><strong>Метод объекта:</strong> <code>this</code> === объект, на котором вызван метод.</li>
            <li><strong>Функция (не strict):</strong> <code>this</code> === <code>window</code>.</li>
            <li><strong>Функция (strict mode):</strong> <code>this</code> === <code>undefined</code>.</li>
            <li><strong>new:</strong> <code>this</code> === новый создаваемый объект.</li>
            <li><strong>Стрелочная функция:</strong> <code>this</code> берётся из лексического окружения (замыкания).</li>
          </ul>

          <h3>Примеры</h3>
          <pre><code>const user = {
  name: 'Алиса',
  greet() {
    console.log(\`Привет, \${this.name}\`);
  },
};

user.greet(); // "Привет, Алиса"

const greet = user.greet;
greet(); // "Привет, undefined" (this потерян!)</code></pre>

          <h3>bind, call, apply</h3>
          <p>Эти методы позволяют явно задать значение <code>this</code>:</p>
          <pre><code>const user = { name: 'Боб' };

const greet = function(greeting) {
  return \`\${greeting}, \${this.name}\`;
};

// call — вызывает функцию с указанным this
greet.call(user, 'Привет'); // "Привет, Боб"

// apply — то же, но аргументы в массиве
greet.apply(user, ['Здравствуй']); // "Здравствуй, Боб"

// bind — возвращает новую функцию с привязанным this
const greetBob = greet.bind(user);
greetBob('Хей'); // "Хей, Боб"</code></pre>

          <h3>Стрелочные функции и this</h3>
          <p>Стрелочные функции <strong>не имеют собственного this</strong>. Они захватывают <code>this</code> из окружающего лексического контекста:</p>
          <pre><code>const timer = {
  seconds: 0,
  start() {
    // Стрелочная функция берёт this из метода start
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start(); // 1, 2, 3, ...</code></pre>

          <div class="note">
            <p><strong>Важно:</strong> Стрелочные функции нельзя использовать как конструкторы (с <code>new</code>) и как методы объектов, если нужен доступ к <code>this</code> самого объекта.</p>
          </div>
        `,
        practice: {
          task: 'Напишите функцию bindContext, которая принимает функцию fn и объект context, и возвращает новую функцию с привязанным контекстом. Не используйте встроенный bind.',
          initialCode: `const bindContext = (fn, context) => {\n  // Ваш код здесь\n};`,
          solution: `const bindContext = (fn, context) => {\n  return (...args) => fn.apply(context, args);\n};`,
          hint: 'Верните новую стрелочную функцию, которая вызывает fn.apply(context, args) или fn.call(context, ...args), передавая все полученные аргументы.',
        },
      },
      {
        id: 4,
        title: 'Замыкания и лексическое окружение',
        content: `
          <h3>Что такое замыкание?</h3>
          <p>Замыкание (closure) — это функция, которая запоминает своё лексическое окружение даже после того, как внешняя функция завершила выполнение. Каждая функция в JavaScript при создании сохраняет ссылку на лексическое окружение, в котором была создана.</p>

          <h3>Лексическое окружение</h3>
          <p>При вызове любой функции создаётся объект лексического окружения (Lexical Environment), который содержит:</p>
          <ul>
            <li><strong>Environment Record</strong> — хранилище локальных переменных.</li>
            <li><strong>Ссылку на внешнее окружение</strong> (outer) — для поиска переменных по цепочке scope chain.</li>
          </ul>

          <h3>Пример замыкания</h3>
          <pre><code>const createCounter = () => {
  let count = 0; // "приватная" переменная в замыкании

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
};

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
// count недоступна напрямую!</code></pre>

          <h3>Паттерн «Модуль»</h3>
          <p>Замыкания позволяют создавать приватные переменные и методы, инкапсулируя логику:</p>
          <pre><code>const createLogger = (prefix) => {
  let logCount = 0;

  const formatMessage = (message) =>
    \`[\${prefix}] #\${++logCount}: \${message}\`;

  return {
    log: (message) => console.log(formatMessage(message)),
    getLogCount: () => logCount,
  };
};

const logger = createLogger('APP');
logger.log('Старт');     // [APP] #1: Старт
logger.log('Загрузка');  // [APP] #2: Загрузка
logger.getLogCount();    // 2</code></pre>

          <h3>Каррирование (Currying)</h3>
          <p>Техника преобразования функции с несколькими аргументами в последовательность функций с одним аргументом:</p>
          <pre><code>// Обычная функция
const add = (a, b) => a + b;

// Каррированная версия
const curriedAdd = (a) => (b) => a + b;

const add5 = curriedAdd(5);
add5(3); // 8
add5(10); // 15

// Универсальная функция каррирования
const curry = (fn) => {
  const curried = (...args) => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
  return curried;
};</code></pre>

          <div class="note">
            <p><strong>Практика:</strong> Замыкания — основа многих паттернов: мемоизация, создание фабрик, частичное применение и декораторы.</p>
          </div>
        `,
        practice: {
          task: 'Напишите функцию multiply, используя каррирование: multiply(2)(3) должна вернуть 6.',
          initialCode: `const multiply = // Ваш код здесь`,
          solution: `const multiply = (a) => (b) => a * b;`,
          hint: 'Каррированная функция — это функция, возвращающая другую функцию. Первая принимает a, вторая — b, и возвращает a * b.',
        },
      },
      {
        id: 5,
        title: 'Итераторы и генераторы',
        content: `
          <h3>Протокол итерации</h3>
          <p>В JavaScript итератор — это объект, реализующий метод <code>next()</code>, который возвращает объект с полями <code>{ value, done }</code>.</p>
          <p>Итерируемый объект (iterable) — объект, реализующий метод <code>[Symbol.iterator]()</code>, возвращающий итератор.</p>

          <h3>Создание итератора вручную</h3>
          <pre><code>const createRange = (start, end) => ({
  [Symbol.iterator]() {
    let current = start;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      },
    };
  },
});

for (const num of createRange(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Также работает с деструктуризацией
const arr = [...createRange(1, 3)]; // [1, 2, 3]</code></pre>

          <h3>Генераторы</h3>
          <p>Генераторы — это специальные функции, которые могут приостанавливать своё выполнение с помощью <code>yield</code> и возобновлять его позже:</p>
          <pre><code>function* fibonacci() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next(); // { value: 0, done: false }
fib.next(); // { value: 1, done: false }
fib.next(); // { value: 1, done: false }
fib.next(); // { value: 2, done: false }
fib.next(); // { value: 3, done: false }</code></pre>

          <h3>yield* — делегирование</h3>
          <p>Оператор <code>yield*</code> позволяет делегировать итерацию другому генератору или итерируемому объекту:</p>
          <pre><code>function* concat(...iterables) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

const result = [...concat([1, 2], [3, 4], [5])];
// [1, 2, 3, 4, 5]</code></pre>

          <h3>Двусторонняя связь через yield</h3>
          <pre><code>function* dialogue() {
  const name = yield 'Как вас зовут?';
  const age = yield \`Привет, \${name}! Сколько вам лет?\`;
  return \`\${name}, \${age} лет — запомнил!\`;
}

const gen = dialogue();
gen.next();           // { value: 'Как вас зовут?', done: false }
gen.next('Анна');     // { value: 'Привет, Анна! Сколько вам лет?', done: false }
gen.next(25);         // { value: 'Анна, 25 лет — запомнил!', done: true }</code></pre>

          <div class="note">
            <p><strong>Применение:</strong> Генераторы используются в Redux-Saga, для ленивых вычислений, бесконечных последовательностей и кооперативной многозадачности.</p>
          </div>
        `,
        practice: {
          task: 'Напишите генератор idGenerator, который бесконечно генерирует уникальные id, начиная с 1.',
          initialCode: `function* idGenerator() {\n  // Ваш код здесь\n}`,
          solution: `function* idGenerator() {\n  let id = 1;\n  while (true) {\n    yield id++;\n  }\n}`,
          hint: 'Используйте бесконечный цикл while (true) с yield, увеличивая переменную-счётчик на каждой итерации.',
        },
      },
      {
        id: 6,
        title: 'Proxy и Reflect: реактивность без Vue',
        content: `
          <h3>Proxy</h3>
          <p><code>Proxy</code> — это обёртка над объектом, которая позволяет перехватывать и переопределять фундаментальные операции: чтение свойств, запись, удаление, вызов функций и другие.</p>

          <h3>Создание Proxy</h3>
          <pre><code>const handler = {
  get(target, prop, receiver) {
    console.log(\`Чтение: \${String(prop)}\`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(\`Запись: \${String(prop)} = \${value}\`);
    return Reflect.set(target, prop, value, receiver);
  },
};

const user = new Proxy({ name: 'Иван', age: 30 }, handler);

user.name;      // Чтение: name → "Иван"
user.age = 31;  // Запись: age = 31</code></pre>

          <h3>Ловушки (Traps)</h3>
          <p>Proxy поддерживает множество ловушек:</p>
          <ul>
            <li><strong>get</strong> — чтение свойства</li>
            <li><strong>set</strong> — запись свойства</li>
            <li><strong>has</strong> — оператор <code>in</code></li>
            <li><strong>deleteProperty</strong> — оператор <code>delete</code></li>
            <li><strong>apply</strong> — вызов функции</li>
            <li><strong>construct</strong> — оператор <code>new</code></li>
            <li><strong>ownKeys</strong> — <code>Object.keys()</code>, <code>for...in</code></li>
          </ul>

          <h3>Reflect</h3>
          <p><code>Reflect</code> — это встроенный объект с методами, дублирующими операции над объектами. Используется внутри Proxy для вызова оригинального поведения:</p>
          <pre><code>// Reflect.get(target, prop) === target[prop]
// Reflect.set(target, prop, value) === target[prop] = value
// Reflect.has(target, prop) === prop in target
// Reflect.deleteProperty(target, prop) === delete target[prop]</code></pre>

          <h3>Реактивность через Proxy</h3>
          <p>Именно на Proxy построена система реактивности Vue 3. Вот упрощённая реализация:</p>
          <pre><code>const reactive = (target) => {
  const subscribers = new Map();

  const notify = (prop) => {
    const subs = subscribers.get(prop);
    if (subs) {
      subs.forEach((fn) => fn());
    }
  };

  const subscribe = (prop, fn) => {
    if (!subscribers.has(prop)) {
      subscribers.set(prop, new Set());
    }
    subscribers.get(prop).add(fn);
  };

  const proxy = new Proxy(target, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      return value;
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);
      notify(prop);
      return result;
    },
  });

  return { proxy, subscribe };
};

// Использование
const { proxy: state, subscribe } = reactive({ count: 0 });

subscribe('count', () => {
  console.log('count изменился:', state.count);
});

state.count = 1; // "count изменился: 1"
state.count = 2; // "count изменился: 2"</code></pre>

          <h3>Валидация через Proxy</h3>
          <pre><code>const createValidated = (target, validators) =>
  new Proxy(target, {
    set(target, prop, value, receiver) {
      const validator = validators[prop];
      if (validator && !validator(value)) {
        throw new TypeError(
          \`Невалидное значение для \${String(prop)}: \${value}\`
        );
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });

const user = createValidated(
  { name: '', age: 0 },
  {
    name: (v) => typeof v === 'string' && v.length > 0,
    age: (v) => Number.isInteger(v) && v >= 0 && v <= 150,
  }
);

user.name = 'Иван'; // OK
user.age = 200;     // TypeError!</code></pre>

          <div class="note">
            <p><strong>Факт:</strong> Vue 2 использовал <code>Object.defineProperty</code> для реактивности (с ограничениями), а Vue 3 перешёл на <code>Proxy</code>, что позволило отслеживать добавление/удаление свойств и изменения массивов.</p>
          </div>
        `,
        practice: {
          task: 'Создайте Proxy-объект, который при чтении несуществующего свойства возвращает строку "Свойство не найдено" вместо undefined.',
          initialCode: `const safeObject = new Proxy({}, {\n  // Ваш код здесь\n});`,
          solution: `const safeObject = new Proxy({}, {\n  get(target, prop, receiver) {\n    if (prop in target) {\n      return Reflect.get(target, prop, receiver);\n    }\n    return 'Свойство не найдено';\n  },\n});`,
          hint: 'В ловушке get проверьте наличие свойства через оператор "in" или Reflect.has(). Если свойства нет — верните строку, иначе — Reflect.get().',
        },
      },
    ],
  },
];

module.exports = chaptersData;

