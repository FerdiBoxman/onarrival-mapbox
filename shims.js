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

if (typeof global === 'undefined') {
  window.global = window;
}
global.process = global.process || {};
global.process.env = global.process.env || {};
global.Buffer = global.Buffer || {};
