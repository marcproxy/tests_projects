// Polyfills manuels pour les API Web
const util = require('util');
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

// Si les polyfills ci-dessus ne fonctionnent pas, essayez cette alternative
if (typeof global.TextEncoder === 'undefined') {
  class TextEncoder {
    encode(text) {
      const encoded = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) {
        encoded[i] = text.charCodeAt(i);
      }
      return encoded;
    }
  }
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  class TextDecoder {
    decode(buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }
  }
  global.TextDecoder = TextDecoder;
}

// Autres configurations globales si nécessaires
require('whatwg-fetch');
