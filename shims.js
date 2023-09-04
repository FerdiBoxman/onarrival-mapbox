// shims.js

// Empty shims for Node.js built-ins to avoid esbuild warnings
global.process = global.process || {};
global.Buffer = global.Buffer || {};
global.process.env = global.process.env || {};

// eslint-disable-next-line no-console
console.log('Shims.js is running');

if (typeof global === 'undefined') {
  window.global = window;
}
