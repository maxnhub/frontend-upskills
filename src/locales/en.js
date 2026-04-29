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
  {
    id: 2,
    title: 'TypeScript Advanced: Types & Patterns',
    Lessons: [
      {
        id: 7,
        title: 'Utility Types: Partial, Pick, Omit, Exclude and more',
        content: `
          <h3>What are Utility Types?</h3>
          <p>TypeScript ships with a set of built-in utility types that allow you to transform existing types. They are implemented using mapped and conditional types in the standard library.</p>

          <h3>Partial&lt;T&gt; — all fields optional</h3>
          <pre><code>interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial&lt;User&gt;;
// { id?: number; name?: string; email?: string }

const updateUser = (user: User, patch: Partial&lt;User&gt;): User => ({
  ...user,
  ...patch,
});</code></pre>

          <h3>Pick&lt;T, K&gt; — select fields</h3>
          <pre><code>type UserPreview = Pick&lt;User, 'id' | 'name'&gt;;
// { id: number; name: string }</code></pre>

          <h3>Omit&lt;T, K&gt; — exclude fields</h3>
          <pre><code>type UserWithoutId = Omit&lt;User, 'id'&gt;;
// { name: string; email: string }

const createUser = (data: Omit&lt;User, 'id'&gt;): User => ({
  id: Math.random(),
  ...data,
});</code></pre>

          <h3>Exclude&lt;T, U&gt; and Extract&lt;T, U&gt;</h3>
          <pre><code>type Status = 'loading' | 'success' | 'error' | 'idle';

type ActiveStatus = Exclude&lt;Status, 'idle'&gt;;
// 'loading' | 'success' | 'error'

type ErrorStatus = Extract&lt;Status, 'error' | 'idle'&gt;;
// 'error' | 'idle'</code></pre>

          <h3>Record, NonNullable, ReturnType</h3>
          <pre><code>type StatusMap = Record&lt;Status, string&gt;;

type Defined = NonNullable&lt;string | null | undefined&gt;; // string

const fetchUser = async (): Promise&lt;User&gt; => ({ id: 1, name: 'John', email: 'j@j.com' });
type FetchResult = ReturnType&lt;typeof fetchUser&gt;; // Promise&lt;User&gt;</code></pre>

          <div class="note">
            <p><strong>Tip:</strong> Utility Types need no extra imports — they are available globally in any TypeScript project.</p>
          </div>
        `,
        practice: {
          task: 'Given a Product interface, create three types: ProductPreview (only id and title), ProductUpdate (all fields optional, without id), ProductStatus (only the non-null status).',
          initialCode: `interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | null;
}

// Your code:
type ProductPreview = // id and title only

type ProductUpdate = // all optional, no id

type ProductStatus = // non-null status only`,
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
          hint: 'Use Pick to select fields, Omit to exclude id, Partial for optional fields, NonNullable to remove null.',
        },
      },
      {
        id: 8,
        title: 'Conditional Types: extends ? : and distributivity',
        content: `
          <h3>Conditional Type Syntax</h3>
          <p>Conditional types select a type based on a condition — the ternary operator for types:</p>
          <pre><code>type IsString&lt;T&gt; = T extends string ? 'yes' : 'no';

type A = IsString&lt;string&gt;;  // 'yes'
type B = IsString&lt;number&gt;;  // 'no'</code></pre>

          <h3>Distributivity</h3>
          <p>When a conditional type is applied to a union type via a generic parameter, it <strong>distributes</strong> over each member:</p>
          <pre><code>type ToArray&lt;T&gt; = T extends any ? T[] : never;

type Result = ToArray&lt;string | number&gt;;
// string[] | number[]  ← distributive!

// To disable distributivity — wrap in a tuple:
type ToArrayNonDist&lt;T&gt; = [T] extends [any] ? T[] : never;
type Result2 = ToArrayNonDist&lt;string | number&gt;;
// (string | number)[]</code></pre>

          <h3>Practical patterns</h3>
          <pre><code>// Get all keys whose value is a string
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

          <h3>never in conditional types</h3>
          <p><code>never</code> disappears when used in a union, making it perfect for filtering:</p>
          <pre><code>type FunctionKeys&lt;T&gt; = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

class Api {
  baseUrl: string = '';
  fetchUser(id: number) {}
  postData(data: unknown) {}
}

type ApiMethods = FunctionKeys&lt;Api&gt;; // 'fetchUser' | 'postData'</code></pre>

          <div class="note">
            <p><strong>Important:</strong> Conditional types are evaluated lazily. TypeScript may leave the type in an "unevaluated" state if the T parameter is not yet known.</p>
          </div>
        `,
        practice: {
          task: 'Write a type DeepReadonly&lt;T&gt; that recursively makes all object fields readonly. Primitives should be returned as-is.',
          initialCode: `type DeepReadonly<T> = // Your code

// Check:
interface Config {
  host: string;
  db: {
    port: number;
    name: string;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
// Expected: readonly host, readonly db, readonly db.port, readonly db.name`,
          solution: `type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;`,
          hint: 'Use a conditional type: if T extends object — apply readonly to each key recursively, otherwise return T.',
        },
      },
      {
        id: 9,
        title: 'infer: type inference in conditional types',
        content: `
          <h3>What is infer?</h3>
          <p><code>infer</code> is used only inside conditional types (in the <code>extends</code> branch). It lets you "capture" part of a type into a variable for use in the result type.</p>

          <pre><code>type ElementType&lt;T&gt; = T extends Array&lt;infer Item&gt; ? Item : never;

type A = ElementType&lt;string[]&gt;;   // string
type B = ElementType&lt;number[][]&gt;;  // number[]
type C = ElementType&lt;boolean&gt;;    // never</code></pre>

          <h3>infer for functions</h3>
          <pre><code>type FirstArg&lt;T&gt; = T extends (first: infer F, ...args: any[]) => any ? F : never;

const greet = (name: string, age: number) => {};
type Name = FirstArg&lt;typeof greet&gt;; // string

type MyReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : never;

const add = (a: number, b: number): number => a + b;
type Result = MyReturnType&lt;typeof add&gt;; // number</code></pre>

          <h3>infer for Promises</h3>
          <pre><code>type Awaited&lt;T&gt; = T extends Promise&lt;infer R&gt; ? Awaited&lt;R&gt; : T;

type A = Awaited&lt;Promise&lt;string&gt;&gt;;           // string
type B = Awaited&lt;Promise&lt;Promise&lt;number&gt;&gt;&gt;;   // number</code></pre>

          <h3>infer for tuples</h3>
          <pre><code>type Last&lt;T extends any[]&gt; = T extends [...infer _, infer L] ? L : never;

type A = Last&lt;[1, 2, 3]&gt;;       // 3
type B = Last&lt;[string, number]&gt;; // number

type Head&lt;T extends any[]&gt; = T extends [infer H, ...any[]] ? H : never;
type Tail&lt;T extends any[]&gt; = T extends [any, ...infer T] ? T : never;</code></pre>

          <div class="note">
            <p><strong>Remember:</strong> <code>infer</code> can only be used on the right side of <code>extends</code> inside a conditional type. It is not accessible outside the condition.</p>
          </div>
        `,
        practice: {
          task: 'Write a type MyParameters&lt;T&gt; (analogous to the built-in) that returns a tuple of a function\'s parameter types.',
          initialCode: `type MyParameters<T> = // Your code

// Check:
const createUser = (name: string, age: number, admin: boolean) => {};

type Params = MyParameters<typeof createUser>;
// Expected: [name: string, age: number, admin: boolean]`,
          solution: `type MyParameters<T> = T extends (...args: infer P) => any ? P : never;`,
          hint: 'Use infer P in the argument position: T extends (...args: infer P) => any ? P : never',
        },
      },
      {
        id: 10,
        title: 'Mapped Types',
        content: `
          <h3>What are Mapped Types?</h3>
          <p>Mapped types create new types by iterating over the keys of an existing type. Syntax: <code>{ [K in keyof T]: ... }</code>.</p>

          <pre><code>type MyReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K];
};

type MyPartial&lt;T&gt; = {
  [K in keyof T]?: T[K];
};

// Remove readonly (-/+ modifiers)
type Mutable&lt;T&gt; = {
  -readonly [K in keyof T]: T[K];
};

type MyRequired&lt;T&gt; = {
  [K in keyof T]-?: T[K];
};</code></pre>

          <h3>Key remapping via as</h3>
          <pre><code>type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string & K&gt;}\`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters&lt;User&gt;;
// { getName: () => string; getAge: () => number }</code></pre>

          <h3>Key filtering via as + never</h3>
          <pre><code>type PickByValue&lt;T, V&gt; = {
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

          <h3>Mapped Types + Template Literal Types</h3>
          <pre><code>type EventMap&lt;T extends string&gt; = {
  [K in T as \`on\${Capitalize&lt;K&gt;}\`]: (event: K) => void;
};

type ButtonEvents = EventMap&lt;'click' | 'focus' | 'blur'&gt;;
// { onClick: ...; onFocus: ...; onBlur: ... }</code></pre>

          <div class="note">
            <p><strong>Key rule:</strong> The <code>as</code> modifier comes after <code>in keyof T</code>. If <code>as</code> returns <code>never</code>, the key is excluded from the result.</p>
          </div>
        `,
        practice: {
          task: 'Write a type Nullable&lt;T&gt; that makes all object fields accept null. Then write OmitNever&lt;T&gt; that removes all fields with type never.',
          initialCode: `// Make all fields accept null
type Nullable<T> = // Your code

// Remove fields with type never
type OmitNever<T> = // Your code

// Check:
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
          hint: 'For Nullable, add | null to T[K]. For OmitNever, use as with a condition: if T[K] extends never — return never (key disappears), otherwise K.',
        },
      },
      {
        id: 11,
        title: 'Function Overloads',
        content: `
          <h3>Why overloads?</h3>
          <p>Overloads let you describe multiple signatures for a single function — TypeScript picks the right one based on the arguments. This gives precise typing for different call patterns.</p>

          <h3>Overload syntax</h3>
          <pre><code>// Overload signatures (types only, no implementation)
function format(value: string): string;
function format(value: number, decimals: number): string;
function format(value: Date): string;

// Implementation (not exposed as its own overload)
function format(value: string | number | Date, decimals?: number): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return value.toFixed(decimals ?? 2);
  return value.toLocaleDateString('en-US');
}

format('  hello  ');   // string ✓
format(3.14159, 2);    // string ✓
format(new Date());    // string ✓
// format(true);       // Error ✓</code></pre>

          <h3>Overloads with different return types</h3>
          <pre><code>function createElement(tag: 'a'): HTMLAnchorElement;
function createElement(tag: 'canvas'): HTMLCanvasElement;
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const link = createElement('a');
// TypeScript knows link is HTMLAnchorElement
link.href = 'https://example.com'; // ✓</code></pre>

          <h3>Alternative: conditional types</h3>
          <pre><code>type ParseResult&lt;T extends string | number&gt; =
  T extends string ? number : string;

function parse&lt;T extends string | number&gt;(value: T): ParseResult&lt;T&gt; {
  if (typeof value === 'string') return Number(value) as ParseResult&lt;T&gt;;
  return String(value) as ParseResult&lt;T&gt;;
}

const num = parse('42');  // number
const str = parse(42);    // string</code></pre>

          <div class="note">
            <p><strong>Rule:</strong> Overload signatures come before the implementation. The implementation must be compatible with all signatures. TypeScript only shows overload signatures in IntelliSense — the implementation is hidden.</p>
          </div>
        `,
        practice: {
          task: 'Write an overloaded function toArray that: when given a string — returns string[], when given a number — returns number[], when given a boolean — returns boolean[].',
          initialCode: `// Declare overload signatures and implementation:
function toArray(value: string): string[];
// ... remaining signatures

function toArray(value: any): any[] {
  // Your implementation
}

// Check:
const a = toArray('hello'); // string[]
const b = toArray(42);      // number[]
const c = toArray(true);    // boolean[]`,
          solution: `function toArray(value: string): string[];
function toArray(value: number): number[];
function toArray(value: boolean): boolean[];
function toArray(value: string | number | boolean): (string | number | boolean)[] {
  return [value];
}`,
          hint: 'Write three overload signatures, then one implementation with a union-type parameter. The implementation accepts all possible types.',
        },
      },
      {
        id: 12,
        title: 'Generics in React Components with TypeScript',
        content: `
          <h3>Why generics in components?</h3>
          <p>Generic components let you build reusable UI that preserves type information about the data it works with.</p>

          <h3>Generic component: basic example</h3>
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

// TypeScript infers T automatically:
&lt;List
  items={[{ id: 1, name: 'John' }]}
  keyExtractor={(u) => String(u.id)}
  renderItem={(u) => &lt;span&gt;{u.name}&lt;/span&gt;}
/&gt;</code></pre>

          <h3>Generic useLocalStorage hook</h3>
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

const [user, setUser] = useLocalStorage&lt;User&gt;('user', defaultUser);
// user: User, setUser: (v: User) => void</code></pre>

          <h3>Generic with constraint</h3>
          <pre><code>interface WithId {
  id: number;
}

function DataTable&lt;T extends WithId&gt;({ rows }: { rows: T[] }) {
  return (
    &lt;table&gt;
      {rows.map((row) => (
        &lt;tr key={row.id}&gt;
          {/* TypeScript knows row.id exists */}
        &lt;/tr&gt;
      ))}
    &lt;/table&gt;
  );
}</code></pre>

          <div class="note">
            <p><strong>Syntax in .tsx files:</strong> Write <code>&lt;T,&gt;</code> or <code>&lt;T extends unknown&gt;</code> instead of <code>&lt;T&gt;</code> — otherwise the parser treats angle brackets as JSX tags.</p>
          </div>
        `,
        practice: {
          task: 'Write a generic hook useFetch&lt;T&gt; that accepts a URL, makes a fetch request and returns { data: T | null, loading: boolean, error: string | null }.',
          initialCode: `import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  // Your code here
}

// Check:
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
          hint: 'Use useState<T | null>(null) for data, useState(true) for loading, useState<string | null>(null) for error. In useEffect, fetch and update state.',
        },
      },
      {
        id: 13,
        title: 'Branded Types: Nominal Typing in TypeScript',
        content: `
          <h3>The structural typing problem</h3>
          <p>TypeScript uses structural typing — two types are compatible if their shapes match. This causes issues with semantically different but structurally identical types:</p>
          <pre><code>type UserId = number;
type OrderId = number;

const getUserById = (id: UserId) => { /* ... */ };
const orderId: OrderId = 42;

getUserById(orderId); // TypeScript won't error!
// But this is semantically wrong</code></pre>

          <h3>Solution: Branded Types</h3>
          <pre><code>type Brand&lt;T, B&gt; = T & { readonly __brand: B };

type UserId  = Brand&lt;number, 'UserId'&gt;;
type OrderId = Brand&lt;number, 'OrderId'&gt;;

const UserId  = (id: number): UserId  => id as UserId;
const OrderId = (id: number): OrderId => id as OrderId;

const getUserById = (id: UserId) => { /* ... */ };

const userId  = UserId(1);
const orderId = OrderId(42);

getUserById(userId);   // ✓
getUserById(orderId);  // Error: OrderId ≠ UserId ✓
getUserById(42);       // Error: number ≠ UserId ✓</code></pre>

          <h3>String Branded Types</h3>
          <pre><code>type Email = Brand&lt;string, 'Email'&gt;;
type Url   = Brand&lt;string, 'Url'&gt;;

const toEmail = (value: string): Email => {
  if (!value.includes('@')) throw new Error('Invalid email');
  return value as Email;
};

const sendEmail = (to: Email, subject: string) => { /* ... */ };

sendEmail(toEmail('user@example.com'), 'Subject'); // ✓
sendEmail('user@example.com', 'Subject');           // Error ✓</code></pre>

          <h3>Validated data with Branded Types</h3>
          <pre><code>type PositiveNumber = Brand&lt;number, 'PositiveNumber'&gt;;
type Percentage    = Brand&lt;number, 'Percentage'&gt;;

const toPositive = (n: number): PositiveNumber => {
  if (n &lt;= 0) throw new Error('Must be positive');
  return n as PositiveNumber;
};

const toPercent = (n: number): Percentage => {
  if (n &lt; 0 || n &gt; 100) throw new Error('0–100');
  return n as Percentage;
};

const applyDiscount = (price: PositiveNumber, discount: Percentage): number =>
  price * (1 - discount / 100);

applyDiscount(toPositive(1000), toPercent(20)); // ✓
applyDiscount(1000, 20); // Error: number ≠ PositiveNumber ✓</code></pre>

          <div class="note">
            <p><strong>Convention:</strong> Branded values must only be created through validating constructors — never via raw <code>as</code> in business code. That is the essence of nominal typing: only "blessed" values are trusted.</p>
          </div>
        `,
        practice: {
          task: 'Create Branded types Celsius and Fahrenheit for temperature. Write a conversion function toCelsius(f: Fahrenheit): Celsius. Ensure TypeScript prevents mixing up the units.',
          initialCode: `type Brand<T, B> = T & { readonly __brand: B };

// Create types:
type Celsius = // ...
type Fahrenheit = // ...

// Constructors:
const Celsius = (value: number): Celsius => // ...
const Fahrenheit = (value: number): Fahrenheit => // ...

// Conversion:
const toCelsius = (f: Fahrenheit): Celsius => // ...

// Check:
const bodyTemp = Fahrenheit(98.6);
const inCelsius = toCelsius(bodyTemp); // ✓
// toCelsius(36.6);        // Should error
// toCelsius(Celsius(37)); // Should error`,
          solution: `type Brand<T, B> = T & { readonly __brand: B };

type Celsius = Brand<number, 'Celsius'>;
type Fahrenheit = Brand<number, 'Fahrenheit'>;

const Celsius = (value: number): Celsius => value as Celsius;
const Fahrenheit = (value: number): Fahrenheit => value as Fahrenheit;

const toCelsius = (f: Fahrenheit): Celsius =>
  Celsius((f - 32) * 5 / 9);`,
          hint: 'Use type Brand<T, B> = T & { readonly __brand: B }. Constructors cast a number to the branded type via as. toCelsius takes only Fahrenheit and returns Celsius.',
        },
      },
    ],
  },
];

module.exports = chaptersData;

