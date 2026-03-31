const chaptersData = [
  {
    id: 1,
    title: 'JavaScript: Compiler & Runtime',
    Lessons: [
      {
        id: 1,
        title: 'Event Loop: Queues, Web APIs, Micro & Macro Tasks',
        content: `
          <h3>What is the Event Loop?</h3>
          <p>The Event Loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks the call stack and task queues, moving callbacks from queues to the stack when it's empty.</p>

          <h3>Event Loop Components</h3>
          <ul>
            <li><strong>Call Stack</strong> — where synchronous code executes. Works on LIFO (Last In, First Out) principle.</li>
            <li><strong>Web APIs</strong> — browser APIs (<code>setTimeout</code>, <code>fetch</code>, <code>DOM Events</code>) that perform operations asynchronously outside the main thread.</li>
            <li><strong>Callback Queue (Task Queue)</strong> — macro-task queue: <code>setTimeout</code>, <code>setInterval</code>, DOM events.</li>
            <li><strong>Microtask Queue</strong> — micro-task queue: <code>Promise.then()</code>, <code>queueMicrotask()</code>, <code>MutationObserver</code>.</li>
          </ul>

          <h3>Execution Order</h3>
          <ol>
            <li>All synchronous code in the Call Stack executes first.</li>
            <li><strong>All</strong> micro-tasks (Microtask Queue) are processed until empty.</li>
            <li><strong>One</strong> macro-task is taken from the Callback Queue.</li>
            <li>After executing the macro-task, all accumulated micro-tasks are processed again.</li>
            <li>The cycle repeats.</li>
          </ol>

          <h3>Example</h3>
          <pre><code>console.log('1'); // synchronous code

setTimeout(() => {
  console.log('2'); // macro-task
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // micro-task
});

console.log('4'); // synchronous code

// Output: 1, 4, 3, 2</code></pre>

          <div class="note">
            <p><strong>Important:</strong> Micro-tasks always execute before macro-tasks! Even if <code>setTimeout</code> with 0 delay was scheduled before <code>Promise.then()</code>.</p>
          </div>

          <h3>queueMicrotask()</h3>
          <p>Allows explicitly adding a callback to the micro-task queue:</p>
          <pre><code>queueMicrotask(() => {
  console.log('Micro-task');
});

setTimeout(() => {
  console.log('Macro-task');
}, 0);

// Output: Micro-task, Macro-task</code></pre>
        `,
        practice: {
          task: 'Determine the console output order. Write the result separated by commas (e.g.: 1, 2, 3):',
          initialCode: `// What will be the output order?\nconsole.log('A');\n\nsetTimeout(() => console.log('B'), 0);\n\nPromise.resolve()\n  .then(() => console.log('C'))\n  .then(() => console.log('D'));\n\nconsole.log('E');\n\n// Your answer (letter order, comma-separated):\n// `,
          solution: `// What will be the output order?\nconsole.log('A');\n\nsetTimeout(() => console.log('B'), 0);\n\nPromise.resolve()\n  .then(() => console.log('C'))\n  .then(() => console.log('D'));\n\nconsole.log('E');\n\n// Your answer (letter order, comma-separated):\n// A, E, C, D, B`,
          hint: 'First all synchronous code executes (A, E), then all micro-tasks (Promise.then → C, D), and only then macro-tasks (setTimeout → B).',
        },
      },
      {
        id: 2,
        title: 'Promises: Chaining, Error Handling, async/await',
        content: `
          <h3>What is a Promise?</h3>
          <p>A Promise is an object representing the result of an asynchronous operation. It can be in one of three states:</p>
          <ul>
            <li><strong>pending</strong> — initial state, operation not yet completed.</li>
            <li><strong>fulfilled</strong> — operation completed successfully.</li>
            <li><strong>rejected</strong> — operation completed with an error.</li>
          </ul>

          <h3>Creating a Promise</h3>
          <pre><code>const promise = new Promise((resolve, reject) => {
  const isSuccess = true;
  if (isSuccess) {
    resolve('Data received');
  } else {
    reject(new Error('Error'));
  }
});</code></pre>

          <h3>Promise Chaining</h3>
          <p>The <code>.then()</code> method always returns a new promise, enabling chains:</p>
          <pre><code>fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error('Error:', error));</code></pre>

          <h3>Error Handling</h3>
          <p><code>.catch()</code> catches errors from any previous chain link:</p>
          <pre><code>Promise.resolve(1)
  .then(val => { throw new Error('Oops!'); })
  .then(val => console.log('Won\\'t execute'))
  .catch(err => console.log(err.message)) // "Oops!"
  .then(() => console.log('Runs after catch'));</code></pre>

          <h3>async/await — Syntactic Sugar</h3>
          <p><code>async/await</code> makes asynchronous code look synchronous. Under the hood, an <code>async</code> function always returns a promise:</p>
          <pre><code>const fetchUser = async (id) => {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Loading error:', error);
    throw error;
  }
};</code></pre>

          <h3>Promise.all, Promise.race, Promise.allSettled</h3>
          <ul>
            <li><strong>Promise.all()</strong> — waits for all promises; rejects immediately if any rejects.</li>
            <li><strong>Promise.race()</strong> — returns the result of the first settled promise.</li>
            <li><strong>Promise.allSettled()</strong> — waits for all promises, returns each status.</li>
          </ul>
          <pre><code>const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments'),
]);
// [{status: 'fulfilled', value: ...}, {status: 'rejected', reason: ...}, ...]</code></pre>

          <div class="note">
            <p><strong>Tip:</strong> Always handle errors in promises! Unhandled rejections lead to <code>UnhandledPromiseRejection</code>.</p>
          </div>
        `,
        practice: {
          task: 'Write a function delay(ms) that returns a promise resolving after ms milliseconds.',
          initialCode: `const delay = (ms) => {\n  // Your code here\n};`,
          solution: `const delay = (ms) => {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n};`,
          hint: 'Use the new Promise() constructor with setTimeout inside. Call resolve inside setTimeout.',
        },
      },
      {
        id: 3,
        title: 'Context: this, bind/call/apply, Arrow Functions',
        content: `
          <h3>What is this?</h3>
          <p><code>this</code> is a keyword that refers to the object in whose context a function was called. The value of <code>this</code> is determined <strong>at call time</strong>, not at declaration time.</p>

          <h3>Rules for Determining this</h3>
          <ul>
            <li><strong>Global context:</strong> <code>this</code> === <code>window</code> (in browser) or <code>globalThis</code>.</li>
            <li><strong>Object method:</strong> <code>this</code> === the object on which the method was called.</li>
            <li><strong>Function (non-strict):</strong> <code>this</code> === <code>window</code>.</li>
            <li><strong>Function (strict mode):</strong> <code>this</code> === <code>undefined</code>.</li>
            <li><strong>new:</strong> <code>this</code> === the newly created object.</li>
            <li><strong>Arrow function:</strong> <code>this</code> is taken from the lexical environment (closure).</li>
          </ul>

          <h3>Examples</h3>
          <pre><code>const user = {
  name: 'Alice',
  greet() {
    console.log(\`Hello, \${this.name}\`);
  },
};

user.greet(); // "Hello, Alice"

const greet = user.greet;
greet(); // "Hello, undefined" (this is lost!)</code></pre>

          <h3>bind, call, apply</h3>
          <p>These methods allow explicitly setting the value of <code>this</code>:</p>
          <pre><code>const user = { name: 'Bob' };

const greet = function(greeting) {
  return \`\${greeting}, \${this.name}\`;
};

// call — invokes the function with specified this
greet.call(user, 'Hello'); // "Hello, Bob"

// apply — same, but arguments in array
greet.apply(user, ['Hi']); // "Hi, Bob"

// bind — returns a new function with bound this
const greetBob = greet.bind(user);
greetBob('Hey'); // "Hey, Bob"</code></pre>

          <h3>Arrow Functions and this</h3>
          <p>Arrow functions <strong>do not have their own this</strong>. They capture <code>this</code> from the surrounding lexical context:</p>
          <pre><code>const timer = {
  seconds: 0,
  start() {
    // Arrow function takes this from the start method
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start(); // 1, 2, 3, ...</code></pre>

          <div class="note">
            <p><strong>Important:</strong> Arrow functions cannot be used as constructors (with <code>new</code>) or as object methods when access to the object's own <code>this</code> is needed.</p>
          </div>
        `,
        practice: {
          task: 'Write a function bindContext that takes a function fn and an object context, and returns a new function with bound context. Do not use the built-in bind.',
          initialCode: `const bindContext = (fn, context) => {\n  // Your code here\n};`,
          solution: `const bindContext = (fn, context) => {\n  return (...args) => fn.apply(context, args);\n};`,
          hint: 'Return a new arrow function that calls fn.apply(context, args) or fn.call(context, ...args), passing all received arguments.',
        },
      },
      {
        id: 4,
        title: 'Closures and Lexical Environment',
        content: `
          <h3>What is a Closure?</h3>
          <p>A closure is a function that remembers its lexical environment even after the outer function has finished executing. Every function in JavaScript saves a reference to the lexical environment in which it was created.</p>

          <h3>Lexical Environment</h3>
          <p>When any function is called, a Lexical Environment object is created, containing:</p>
          <ul>
            <li><strong>Environment Record</strong> — storage for local variables.</li>
            <li><strong>Reference to outer environment</strong> (outer) — for variable lookup through the scope chain.</li>
          </ul>

          <h3>Closure Example</h3>
          <pre><code>const createCounter = () => {
  let count = 0; // "private" variable in closure

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
// count is not directly accessible!</code></pre>

          <h3>Module Pattern</h3>
          <p>Closures allow creating private variables and methods, encapsulating logic:</p>
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
logger.log('Start');    // [APP] #1: Start
logger.log('Loading');  // [APP] #2: Loading
logger.getLogCount();   // 2</code></pre>

          <h3>Currying</h3>
          <p>A technique of transforming a function with multiple arguments into a sequence of functions with single arguments:</p>
          <pre><code>// Regular function
const add = (a, b) => a + b;

// Curried version
const curriedAdd = (a) => (b) => a + b;

const add5 = curriedAdd(5);
add5(3); // 8
add5(10); // 15

// Universal curry function
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
            <p><strong>Practice:</strong> Closures are the foundation of many patterns: memoization, factories, partial application, and decorators.</p>
          </div>
        `,
        practice: {
          task: 'Write a function multiply using currying: multiply(2)(3) should return 6.',
          initialCode: `const multiply = // Your code here`,
          solution: `const multiply = (a) => (b) => a * b;`,
          hint: 'A curried function is a function that returns another function. The first takes a, the second takes b, and returns a * b.',
        },
      },
      {
        id: 5,
        title: 'Iterators and Generators',
        content: `
          <h3>Iteration Protocol</h3>
          <p>In JavaScript, an iterator is an object implementing a <code>next()</code> method that returns an object with <code>{ value, done }</code> fields.</p>
          <p>An iterable object implements the <code>[Symbol.iterator]()</code> method, returning an iterator.</p>

          <h3>Creating an Iterator Manually</h3>
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

// Also works with destructuring
const arr = [...createRange(1, 3)]; // [1, 2, 3]</code></pre>

          <h3>Generators</h3>
          <p>Generators are special functions that can pause their execution with <code>yield</code> and resume later:</p>
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

          <h3>yield* — Delegation</h3>
          <p>The <code>yield*</code> operator delegates iteration to another generator or iterable:</p>
          <pre><code>function* concat(...iterables) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

const result = [...concat([1, 2], [3, 4], [5])];
// [1, 2, 3, 4, 5]</code></pre>

          <h3>Two-way Communication via yield</h3>
          <pre><code>function* dialogue() {
  const name = yield 'What is your name?';
  const age = yield \`Hello, \${name}! How old are you?\`;
  return \`\${name}, \${age} years old — noted!\`;
}

const gen = dialogue();
gen.next();           // { value: 'What is your name?', done: false }
gen.next('Anna');     // { value: 'Hello, Anna! How old are you?', done: false }
gen.next(25);         // { value: 'Anna, 25 years old — noted!', done: true }</code></pre>

          <div class="note">
            <p><strong>Applications:</strong> Generators are used in Redux-Saga, for lazy evaluation, infinite sequences, and cooperative multitasking.</p>
          </div>
        `,
        practice: {
          task: 'Write a generator idGenerator that infinitely generates unique ids starting from 1.',
          initialCode: `function* idGenerator() {\n  // Your code here\n}`,
          solution: `function* idGenerator() {\n  let id = 1;\n  while (true) {\n    yield id++;\n  }\n}`,
          hint: 'Use an infinite while (true) loop with yield, incrementing a counter variable on each iteration.',
        },
      },
      {
        id: 6,
        title: 'Proxy and Reflect: Reactivity Without Vue',
        content: `
          <h3>Proxy</h3>
          <p><code>Proxy</code> is a wrapper around an object that allows intercepting and redefining fundamental operations: property reading, writing, deletion, function calls, and more.</p>

          <h3>Creating a Proxy</h3>
          <pre><code>const handler = {
  get(target, prop, receiver) {
    console.log(\`Reading: \${String(prop)}\`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(\`Writing: \${String(prop)} = \${value}\`);
    return Reflect.set(target, prop, value, receiver);
  },
};

const user = new Proxy({ name: 'John', age: 30 }, handler);

user.name;      // Reading: name → "John"
user.age = 31;  // Writing: age = 31</code></pre>

          <h3>Traps</h3>
          <p>Proxy supports many traps:</p>
          <ul>
            <li><strong>get</strong> — property reading</li>
            <li><strong>set</strong> — property writing</li>
            <li><strong>has</strong> — <code>in</code> operator</li>
            <li><strong>deleteProperty</strong> — <code>delete</code> operator</li>
            <li><strong>apply</strong> — function call</li>
            <li><strong>construct</strong> — <code>new</code> operator</li>
            <li><strong>ownKeys</strong> — <code>Object.keys()</code>, <code>for...in</code></li>
          </ul>

          <h3>Reflect</h3>
          <p><code>Reflect</code> is a built-in object with methods mirroring object operations. Used inside Proxy to invoke original behavior:</p>
          <pre><code>// Reflect.get(target, prop) === target[prop]
// Reflect.set(target, prop, value) === target[prop] = value
// Reflect.has(target, prop) === prop in target
// Reflect.deleteProperty(target, prop) === delete target[prop]</code></pre>

          <h3>Reactivity via Proxy</h3>
          <p>Vue 3's reactivity system is built on Proxy. Here's a simplified implementation:</p>
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

// Usage
const { proxy: state, subscribe } = reactive({ count: 0 });

subscribe('count', () => {
  console.log('count changed:', state.count);
});

state.count = 1; // "count changed: 1"
state.count = 2; // "count changed: 2"</code></pre>

          <h3>Validation via Proxy</h3>
          <pre><code>const createValidated = (target, validators) =>
  new Proxy(target, {
    set(target, prop, value, receiver) {
      const validator = validators[prop];
      if (validator && !validator(value)) {
        throw new TypeError(
          \`Invalid value for \${String(prop)}: \${value}\`
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

user.name = 'John'; // OK
user.age = 200;     // TypeError!</code></pre>

          <div class="note">
            <p><strong>Fact:</strong> Vue 2 used <code>Object.defineProperty</code> for reactivity (with limitations), while Vue 3 switched to <code>Proxy</code>, enabling tracking of property addition/deletion and array changes.</p>
          </div>
        `,
        practice: {
          task: 'Create a Proxy object that returns the string "Property not found" instead of undefined when reading a non-existent property.',
          initialCode: `const safeObject = new Proxy({}, {\n  // Your code here\n});`,
          solution: `const safeObject = new Proxy({}, {\n  get(target, prop, receiver) {\n    if (prop in target) {\n      return Reflect.get(target, prop, receiver);\n    }\n    return 'Property not found';\n  },\n});`,
          hint: 'In the get trap, check property existence via the "in" operator or Reflect.has(). If absent — return the string, otherwise — Reflect.get().',
        },
      },
    ],
  },
];

module.exports = chaptersData;

