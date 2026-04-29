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
  {
    id: 2,
    title: 'Типизация и TypeScript Advanced',
    Lessons: [
      {
        id: 7,
        title: 'Utility Types: Partial, Pick, Omit, Exclude и другие',
        content: `
          <h3>Что такое Utility Types?</h3>
          <p>TypeScript поставляется с набором встроенных утилитарных типов, которые позволяют трансформировать существующие типы. Они реализованы через маппинг и условные типы прямо в стандартной библиотеке.</p>

          <h3>Partial&lt;T&gt; — все поля необязательны</h3>
          <pre><code>interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial&lt;User&gt;;
// { id?: number; name?: string; email?: string }

// Применение: обновление части объекта
const updateUser = (user: User, patch: Partial&lt;User&gt;): User => ({
  ...user,
  ...patch,
});</code></pre>

          <h3>Required&lt;T&gt; — все поля обязательны</h3>
          <pre><code>interface Config {
  host?: string;
  port?: number;
}

type StrictConfig = Required&lt;Config&gt;;
// { host: string; port: number }</code></pre>

          <h3>Pick&lt;T, K&gt; — выбрать поля</h3>
          <pre><code>type UserPreview = Pick&lt;User, 'id' | 'name'&gt;;
// { id: number; name: string }

// Полезно для DTO и API-ответов</code></pre>

          <h3>Omit&lt;T, K&gt; — исключить поля</h3>
          <pre><code>type UserWithoutId = Omit&lt;User, 'id'&gt;;
// { name: string; email: string }

// Создание нового пользователя (без id — его генерирует БД)
const createUser = (data: Omit&lt;User, 'id'&gt;): User => ({
  id: Math.random(),
  ...data,
});</code></pre>

          <h3>Exclude&lt;T, U&gt; и Extract&lt;T, U&gt;</h3>
          <pre><code>type Status = 'loading' | 'success' | 'error' | 'idle';

type ActiveStatus = Exclude&lt;Status, 'idle'&gt;;
// 'loading' | 'success' | 'error'

type ErrorStatus = Extract&lt;Status, 'error' | 'idle'&gt;;
// 'error' | 'idle'</code></pre>

          <h3>Record&lt;K, V&gt;, NonNullable&lt;T&gt;, ReturnType&lt;T&gt;</h3>
          <pre><code>// Record — создать объект с заданными ключами и типом значений
type StatusMap = Record&lt;Status, string&gt;;
// { loading: string; success: string; error: string; idle: string }

// NonNullable — убрать null и undefined
type Defined = NonNullable&lt;string | null | undefined&gt;; // string

// ReturnType — тип возвращаемого значения функции
const fetchUser = async (): Promise&lt;User&gt; => ({ id: 1, name: 'Иван', email: 'i@i.com' });
type FetchResult = ReturnType&lt;typeof fetchUser&gt;; // Promise&lt;User&gt;</code></pre>

          <div class="note">
            <p><strong>Совет:</strong> Utility Types не требуют дополнительных импортов — они доступны глобально в любом TypeScript проекте.</p>
          </div>
        `,
        practice: {
          task: 'Есть интерфейс Product. Создайте три типа: ProductPreview (только id и title), ProductUpdate (все поля необязательны, без id), ProductStatus (только статус из заданного union-типа, без null).',
          initialCode: `interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | null;
}

// Ваш код:
type ProductPreview = // только id и title

type ProductUpdate = // все поля необязательны, без id

type ProductStatus = // только ненулевой статус`,
          solution: `interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | null;
}

type ProductPreview = Pick<Product, 'id' | 'title'>;

type ProductUpdate = Partial<Omit<Product, 'id'>>;

type ProductStatus = NonNullable<Product['status']>;`,
          hint: 'Используйте Pick для выбора полей, Omit для исключения id, Partial для необязательных полей, NonNullable для удаления null.',
        },
      },
      {
        id: 8,
        title: 'Условные типы: extends ? : и дистрибутивность',
        content: `
          <h3>Синтаксис условного типа</h3>
          <p>Условные типы позволяют выбирать тип на основе условия — аналог тернарного оператора для типов:</p>
          <pre><code>type IsString&lt;T&gt; = T extends string ? 'да' : 'нет';

type A = IsString&lt;string&gt;;  // 'да'
type B = IsString&lt;number&gt;;  // 'нет'</code></pre>

          <h3>Дистрибутивность</h3>
          <p>Когда условный тип применяется к union-типу через обобщённый параметр, он <strong>распределяется</strong> по каждому члену union:</p>
          <pre><code>type ToArray&lt;T&gt; = T extends any ? T[] : never;

type Result = ToArray&lt;string | number&gt;;
// string[] | number[]  ← дистрибутивность!

// Чтобы отключить дистрибутивность — оберните в кортеж:
type ToArrayNonDist&lt;T&gt; = [T] extends [any] ? T[] : never;
type Result2 = ToArrayNonDist&lt;string | number&gt;;
// (string | number)[]</code></pre>

          <h3>Практические паттерны</h3>
          <pre><code>// Получить все ключи, значение которых — строка
type StringKeys&lt;T&gt; = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserStringKeys = StringKeys&lt;User&gt;; // 'name' | 'email'</code></pre>

          <pre><code>// Flatten — убрать один уровень массива
type Flatten&lt;T&gt; = T extends Array&lt;infer Item&gt; ? Item : T;

type A = Flatten&lt;string[]&gt;;   // string
type B = Flatten&lt;number[][]&gt;; // number[]
type C = Flatten&lt;boolean&gt;;    // boolean</code></pre>

          <h3>never в условных типах</h3>
          <p><code>never</code> при использовании в union исчезает, что делает его отличным инструментом для фильтрации:</p>
          <pre><code>// Исключить из union все типы, не являющиеся функциями
type FunctionKeys&lt;T&gt; = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

class Api {
  baseUrl: string = '';
  fetchUser(id: number) {}
  postData(data: unknown) {}
}

type ApiMethods = FunctionKeys&lt;Api&gt;; // 'fetchUser' | 'postData'</code></pre>

          <div class="note">
            <p><strong>Важно:</strong> Условные типы вычисляются лениво. TypeScript может оставить тип в "невычисленном" виде, если параметр T ещё не известен.</p>
          </div>
        `,
        practice: {
          task: 'Напишите тип DeepReadonly&lt;T&gt;, который рекурсивно делает все поля объекта readonly. Для примитивов — оставить как есть.',
          initialCode: `type DeepReadonly<T> = // Ваш код

// Проверка:
interface Config {
  host: string;
  db: {
    port: number;
    name: string;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
// Должно быть: readonly host, readonly db, readonly db.port, readonly db.name`,
          solution: `type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;`,
          hint: 'Используйте условный тип: если T extends object — применить readonly к каждому ключу рекурсивно, иначе вернуть T.',
        },
      },
      {
        id: 9,
        title: 'infer: выведение типов внутри условных типов',
        content: `
          <h3>Что такое infer?</h3>
          <p><code>infer</code> используется только внутри условных типов (в ветке <code>extends</code>). Он позволяет "захватить" часть типа в переменную для использования в результирующем типе.</p>

          <pre><code>// Без infer — мы не можем извлечь тип элемента массива
type ElementType&lt;T&gt; = T extends Array&lt;infer Item&gt; ? Item : never;

type A = ElementType&lt;string[]&gt;;  // string
type B = ElementType&lt;number[][]&gt;; // number[]
type C = ElementType&lt;boolean&gt;;   // never</code></pre>

          <h3>infer для функций</h3>
          <pre><code>// Тип первого аргумента функции
type FirstArg&lt;T&gt; = T extends (first: infer F, ...args: any[]) => any ? F : never;

const greet = (name: string, age: number) => {};
type Name = FirstArg&lt;typeof greet&gt;; // string

// Тип возвращаемого значения (аналог ReturnType)
type MyReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : never;

const add = (a: number, b: number): number => a + b;
type Result = MyReturnType&lt;typeof add&gt;; // number</code></pre>

          <h3>infer для промисов</h3>
          <pre><code>// Распаковать Promise
type Awaited&lt;T&gt; = T extends Promise&lt;infer R&gt; ? Awaited&lt;R&gt; : T;
// (встроен в TS 4.5+ как Awaited&lt;T&gt;)

type A = Awaited&lt;Promise&lt;string&gt;&gt;;           // string
type B = Awaited&lt;Promise&lt;Promise&lt;number&gt;&gt;&gt;;   // number</code></pre>

          <h3>infer для кортежей и объектов</h3>
          <pre><code>// Последний элемент кортежа
type Last&lt;T extends any[]&gt; = T extends [...infer _, infer L] ? L : never;

type A = Last&lt;[1, 2, 3]&gt;;       // 3
type B = Last&lt;[string, number]&gt;; // number

// Тип значений объекта (аналог Record)
type ValueOf&lt;T&gt; = T extends { [key: string]: infer V } ? V : never;

type Vals = ValueOf&lt;{ a: string; b: number }&gt;; // string | number</code></pre>

          <h3>Несколько infer в одном условии</h3>
          <pre><code>// Разделить кортеж на голову и хвост
type Head&lt;T extends any[]&gt; = T extends [infer H, ...any[]] ? H : never;
type Tail&lt;T extends any[]&gt; = T extends [any, ...infer T] ? T : never;

type H = Head&lt;[1, 2, 3]&gt;; // 1
type T = Tail&lt;[1, 2, 3]&gt;; // [2, 3]</code></pre>

          <div class="note">
            <p><strong>Запомните:</strong> <code>infer</code> можно использовать только в правой части <code>extends</code> внутри условного типа. Снаружи условия он недоступен.</p>
          </div>
        `,
        practice: {
          task: 'Напишите тип Parameters&lt;T&gt; (аналог встроенного), который возвращает кортеж типов параметров функции.',
          initialCode: `type MyParameters<T> = // Ваш код

// Проверка:
const createUser = (name: string, age: number, admin: boolean) => {};

type Params = MyParameters<typeof createUser>;
// Ожидается: [name: string, age: number, admin: boolean]`,
          solution: `type MyParameters<T> = T extends (...args: infer P) => any ? P : never;`,
          hint: 'Используйте infer P в позиции аргументов функции: T extends (...args: infer P) => any ? P : never',
        },
      },
      {
        id: 10,
        title: 'Маппинг типов (Mapped Types)',
        content: `
          <h3>Что такое Mapped Types?</h3>
          <p>Маппинг типов позволяет создавать новые типы, итерируя по ключам существующего типа. Синтаксис: <code>{ [K in keyof T]: ... }</code>.</p>

          <pre><code>// Ручная реализация Readonly
type MyReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K];
};

// Ручная реализация Partial
type MyPartial&lt;T&gt; = {
  [K in keyof T]?: T[K];
};

// Снять readonly (+/- модификаторы)
type Mutable&lt;T&gt; = {
  -readonly [K in keyof T]: T[K];
};

// Сделать все поля обязательными
type MyRequired&lt;T&gt; = {
  [K in keyof T]-?: T[K];
};</code></pre>

          <h3>Переименование ключей через as</h3>
          <pre><code>// Добавить префикс get к каждому ключу
type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string & K&gt;}\`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters&lt;User&gt;;
// { getName: () => string; getAge: () => number }</code></pre>

          <h3>Фильтрация ключей через as + never</h3>
          <pre><code>// Оставить только ключи с определённым типом значения
type PickByValue&lt;T, V&gt; = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface Form {
  name: string;
  age: number;
  email: string;
  isAdmin: boolean;
}

type StringFields = PickByValue&lt;Form, string&gt;;
// { name: string; email: string }</code></pre>

          <h3>Вложенный маппинг</h3>
          <pre><code>// Рекурсивно сделать все поля необязательными
type DeepPartial&lt;T&gt; = {
  [K in keyof T]?: T[K] extends object ? DeepPartial&lt;T[K]&gt; : T[K];
};

interface Config {
  server: { host: string; port: number };
  db: { name: string; user: string };
}

type PartialConfig = DeepPartial&lt;Config&gt;;
// server?: { host?: string; port?: number }</code></pre>

          <h3>Mapped Types + Template Literal Types</h3>
          <pre><code>type EventMap&lt;T extends string&gt; = {
  [K in T as \`on\${Capitalize&lt;K&gt;}\`]: (event: K) => void;
};

type ButtonEvents = EventMap&lt;'click' | 'focus' | 'blur'&gt;;
// { onClick: ...; onFocus: ...; onBlur: ... }</code></pre>

          <div class="note">
            <p><strong>Ключевое правило:</strong> Модификатор <code>as</code> применяется после <code>in keyof T</code>. Если <code>as</code> возвращает <code>never</code>, ключ исключается из результата.</p>
          </div>
        `,
        practice: {
          task: 'Напишите тип Nullable&lt;T&gt;, который делает все поля объекта допускающими null. Затем напишите тип OmitNever&lt;T&gt;, который убирает из объекта все поля с типом never.',
          initialCode: `// Сделать все поля допускающими null
type Nullable<T> = // Ваш код

// Убрать поля с типом never
type OmitNever<T> = // Ваш код

// Проверка:
interface User { id: number; name: string; }
type NullableUser = Nullable<User>;
// { id: number | null; name: string | null }

type WithNever = { a: string; b: never; c: number };
type Clean = OmitNever<WithNever>;
// { a: string; c: number }`,
          solution: `type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};`,
          hint: 'Для Nullable добавьте | null к T[K]. Для OmitNever используйте as с условием: если T[K] extends never — возвращайте never (ключ исчезнет), иначе K.',
        },
      },
      {
        id: 11,
        title: 'Перегрузка функций (Function Overloads)',
        content: `
          <h3>Зачем нужна перегрузка?</h3>
          <p>Перегрузка позволяет описать несколько сигнатур для одной функции — TypeScript выберет подходящую на основе переданных аргументов. Это даёт точную типизацию при разных вариантах вызова.</p>

          <h3>Синтаксис перегрузки</h3>
          <pre><code>// Сигнатуры перегрузки (только типы, без реализации)
function format(value: string): string;
function format(value: number, decimals: number): string;
function format(value: Date): string;

// Реализация (не экспортируется как отдельная сигнатура)
function format(value: string | number | Date, decimals?: number): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return value.toFixed(decimals ?? 2);
  return value.toLocaleDateString('ru-RU');
}

format('  hello  ');   // string ✓
format(3.14159, 2);    // string ✓
format(new Date());    // string ✓
// format(true);       // Ошибка ✓</code></pre>

          <h3>Перегрузка с разными типами возврата</h3>
          <pre><code>function createElement(tag: 'a'): HTMLAnchorElement;
function createElement(tag: 'canvas'): HTMLCanvasElement;
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const link = createElement('a');
// TypeScript знает, что link — HTMLAnchorElement
link.href = 'https://example.com'; // ✓</code></pre>

          <h3>Перегрузка методов класса</h3>
          <pre><code>class EventEmitter {
  on(event: 'data', listener: (data: string) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: 'close', listener: () => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    // реализация
    return this;
  }
}</code></pre>

          <h3>Альтернатива: условные типы</h3>
          <p>Иногда вместо перегрузки можно использовать дженерик с условным типом — это более гибко:</p>
          <pre><code>type ParseResult&lt;T extends string | number&gt; =
  T extends string ? number : string;

function parse&lt;T extends string | number&gt;(value: T): ParseResult&lt;T&gt; {
  if (typeof value === 'string') return Number(value) as ParseResult&lt;T&gt;;
  return String(value) as ParseResult&lt;T&gt;;
}

const num = parse('42');  // number
const str = parse(42);    // string</code></pre>

          <div class="note">
            <p><strong>Правило:</strong> Сигнатуры перегрузки идут до реализации. Реализация должна быть совместима со всеми сигнатурами. TypeScript показывает только сигнатуры перегрузок в подсказках — реализацию скрывает.</p>
          </div>
        `,
        practice: {
          task: 'Напишите перегруженную функцию toArray, которая: при передаче строки — возвращает string[], при передаче числа — возвращает number[], при передаче boolean — возвращает boolean[].',
          initialCode: `// Объявите сигнатуры перегрузки и реализацию:
function toArray(value: string): string[];
// ... остальные сигнатуры

function toArray(value: any): any[] {
  // Ваша реализация
}

// Проверка:
const a = toArray('hello'); // string[]
const b = toArray(42);      // number[]
const c = toArray(true);    // boolean[]`,
          solution: `function toArray(value: string): string[];
function toArray(value: number): number[];
function toArray(value: boolean): boolean[];
function toArray(value: string | number | boolean): (string | number | boolean)[] {
  return [value];
}`,
          hint: 'Напишите три сигнатуры перегрузки, затем одну реализацию с union-типом параметра. Реализация принимает все возможные типы.',
        },
      },
      {
        id: 12,
        title: 'Дженерики в React-компонентах с TypeScript',
        content: `
          <h3>Зачем дженерики в компонентах?</h3>
          <p>Дженерик-компоненты позволяют создавать переиспользуемые UI-компоненты, которые сохраняют информацию о типах данных, с которыми работают.</p>

          <h3>Дженерик-компонент: базовый пример</h3>
          <pre><code>interface ListProps&lt;T&gt; {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List&lt;T&gt;({ items, renderItem, keyExtractor }: ListProps&lt;T&gt;) {
  return (
    &lt;ul&gt;
      {items.map((item) => (
        &lt;li key={keyExtractor(item)}&gt;{renderItem(item)}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}

// Использование — TypeScript выводит T автоматически:
&lt;List
  items={[{ id: 1, name: 'Иван' }]}
  keyExtractor={(u) => String(u.id)}  // u: { id: number; name: string }
  renderItem={(u) => &lt;span&gt;{u.name}&lt;/span&gt;}
/&gt;</code></pre>

          <h3>Дженерик Select с типизированным onChange</h3>
          <pre><code>interface SelectProps&lt;T&gt; {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function Select&lt;T extends string | number&gt;({
  options,
  value,
  onChange,
}: SelectProps&lt;T&gt;) {
  return (
    &lt;select
      value={String(value)}
      onChange={(e) => onChange(e.target.value as T)}
    &gt;
      {options.map((opt) => (
        &lt;option key={String(opt.value)} value={String(opt.value)}&gt;
          {opt.label}
        &lt;/option&gt;
      ))}
    &lt;/select&gt;
  );
}</code></pre>

          <h3>useLocalStorage — дженерик-хук</h3>
          <pre><code>function useLocalStorage&lt;T&gt;(key: string, initialValue: T) {
  const [value, setValue] = React.useState&lt;T&gt;(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  const set = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, set] as const;
}

// Использование:
const [user, setUser] = useLocalStorage&lt;User&gt;('user', defaultUser);
// user: User, setUser: (v: User) => void</code></pre>

          <h3>Дженерик с ограничением (constraint)</h3>
          <pre><code>interface WithId {
  id: number;
}

function DataTable&lt;T extends WithId&gt;({ rows }: { rows: T[] }) {
  return (
    &lt;table&gt;
      {rows.map((row) => (
        &lt;tr key={row.id}&gt;
          {/* TypeScript знает, что row.id существует */}
        &lt;/tr&gt;
      ))}
    &lt;/table&gt;
  );
}</code></pre>

          <div class="note">
            <p><strong>Синтаксис в .tsx файлах:</strong> Пишите <code>&lt;T,&gt;</code> или <code>&lt;T extends unknown&gt;</code> вместо <code>&lt;T&gt;</code> — иначе парсер воспринимает угловые скобки как JSX-тег.</p>
          </div>
        `,
        practice: {
          task: 'Напишите дженерик-хук useFetch&lt;T&gt;, который принимает URL, делает fetch-запрос и возвращает объект { data: T | null, loading: boolean, error: string | null }.',
          initialCode: `import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  // Ваш код здесь
}

// Проверка:
interface Post { id: number; title: string; }

const { data, loading, error } = useFetch<Post>('/api/posts/1');
// data: Post | null
// loading: boolean
// error: string | null`,
          solution: `import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then((json) => { setData(json); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}`,
          hint: 'Используйте useState<T | null>(null) для data, useState(true) для loading, useState<string | null>(null) для error. В useEffect делайте fetch и обновляйте состояние.',
        },
      },
      {
        id: 13,
        title: 'Branded Types: номинальная типизация в TypeScript',
        content: `
          <h3>Проблема структурной типизации</h3>
          <p>TypeScript использует структурную типизацию — два типа совместимы, если их структуры совпадают. Это создаёт проблемы с семантически разными, но структурно одинаковыми типами:</p>
          <pre><code>type UserId = number;
type OrderId = number;

const getUserById = (id: UserId) => { /* ... */ };
const orderId: OrderId = 42;

getUserById(orderId); // TypeScript не выдаст ошибку!
// Но семантически это неверно</code></pre>

          <h3>Решение: Branded Types</h3>
          <p>Branded (nominal) типы добавляют "метку" к примитивному типу через пересечение с уникальным символом:</p>
          <pre><code>type Brand&lt;T, B&gt; = T & { readonly __brand: B };

type UserId  = Brand&lt;number, 'UserId'&gt;;
type OrderId = Brand&lt;number, 'OrderId'&gt;;

// Конструкторы (только здесь мы "создаём" branded-значение)
const UserId  = (id: number): UserId  => id as UserId;
const OrderId = (id: number): OrderId => id as OrderId;

const getUserById = (id: UserId) => { /* ... */ };

const userId  = UserId(1);
const orderId = OrderId(42);

getUserById(userId);   // ✓
getUserById(orderId);  // Ошибка: OrderId ≠ UserId ✓
getUserById(42);       // Ошибка: number ≠ UserId ✓</code></pre>

          <h3>Строковые Branded Types</h3>
          <pre><code>type Email = Brand&lt;string, 'Email'&gt;;
type Url   = Brand&lt;string, 'Url'&gt;;

const toEmail = (value: string): Email => {
  if (!value.includes('@')) throw new Error('Невалидный email');
  return value as Email;
};

const sendEmail = (to: Email, subject: string) => { /* ... */ };

sendEmail(toEmail('user@example.com'), 'Тема'); // ✓
sendEmail('user@example.com', 'Тема');          // Ошибка ✓</code></pre>

          <h3>Опaque Types через unique symbol</h3>
          <pre><code>declare const __brand: unique symbol;
type Brand&lt;T, B&gt; = T & { readonly [__brand]: B };

// unique symbol гарантирует уникальность метки
// даже если имена совпадают в разных модулях</code></pre>

          <h3>Применение: валидированные данные</h3>
          <pre><code>type PositiveNumber = Brand&lt;number, 'PositiveNumber'&gt;;
type Percentage    = Brand&lt;number, 'Percentage'&gt;;

const toPositive = (n: number): PositiveNumber => {
  if (n &lt;= 0) throw new Error('Должно быть положительным');
  return n as PositiveNumber;
};

const toPercent = (n: number): Percentage => {
  if (n &lt; 0 || n &gt; 100) throw new Error('0–100');
  return n as Percentage;
};

const applyDiscount = (price: PositiveNumber, discount: Percentage): number =>
  price * (1 - discount / 100);

applyDiscount(toPositive(1000), toPercent(20)); // ✓
applyDiscount(1000, 20); // Ошибка: number ≠ PositiveNumber ✓</code></pre>

          <div class="note">
            <p><strong>Соглашение:</strong> Значения с brand нельзя создавать напрямую через <code>as</code> в бизнес-коде. Только через валидирующие конструкторы — это и есть суть номинальной типизации: доверять можно только "освящённым" значениям.</p>
          </div>
        `,
        practice: {
          task: 'Создайте Branded тип Celsius и Fahrenheit для температуры. Напишите функцию конвертации toCelsius(f: Fahrenheit): Celsius. Убедитесь, что TypeScript не позволяет перепутать единицы.',
          initialCode: `type Brand<T, B> = T & { readonly __brand: B };

// Создайте типы:
type Celsius = // ...
type Fahrenheit = // ...

// Конструкторы:
const Celsius = (value: number): Celsius => // ...
const Fahrenheit = (value: number): Fahrenheit => // ...

// Конвертация:
const toCelsius = (f: Fahrenheit): Celsius => // ...

// Проверка:
const bodyTemp = Fahrenheit(98.6);
const inCelsius = toCelsius(bodyTemp); // ✓
// toCelsius(36.6);      // Должна быть ошибка
// toCelsius(Celsius(37)); // Должна быть ошибка`,
          solution: `type Brand<T, B> = T & { readonly __brand: B };

type Celsius = Brand<number, 'Celsius'>;
type Fahrenheit = Brand<number, 'Fahrenheit'>;

const Celsius = (value: number): Celsius => value as Celsius;
const Fahrenheit = (value: number): Fahrenheit => value as Fahrenheit;

const toCelsius = (f: Fahrenheit): Celsius =>
  Celsius((f - 32) * 5 / 9);`,
          hint: 'Используйте type Brand<T, B> = T & { readonly __brand: B }. Конструкторы приводят число к branded-типу через as. Функция toCelsius принимает только Fahrenheit и возвращает Celsius.',
        },
      },
    ],
  },
];

module.exports = chaptersData;

