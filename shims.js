// shims.js

if (typeof window !== 'undefined') {
  window.require = function (module) {
    switch (module) {
      case 'path':
        return {
          resolve: function () {
            // Provide an alternative implementation or just return an empty string
            return '';
          },
          // Add more methods from the 'path' module if needed
        };
      case 'os':
        return {};
      case 'crypto':
        return {};
      default:
        throw new Error(`Dynamic require of "${module}" is not supported`);
    }
  };
}

console.log('Shims.js is running');

if (typeof global === 'undefined') {
  window.global = window;
}

// Initialize global.process if it's undefined
if (typeof global.process === 'undefined') {
  global.process = {};
}

// Initialize global.process.env if it's undefined
if (typeof global.process.env === 'undefined') {
  global.process.env = {};
}

// Add mock for process.cwd()
global.process.cwd = global.process.cwd || (() => '/');

if (typeof global === 'undefined') {
  window.global = window;
}

global.process = global.process || {};
global.process.env = global.process.env || {};
global.Buffer = global.Buffer || {};
