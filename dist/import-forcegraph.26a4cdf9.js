// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"24d412131c4c836209bd4440e862f310":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "26a4cdf96af8876dcd8f069385710420";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets; // eslint-disable-next-line no-redeclare

var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
  var port = HMR_PORT || location.port;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var absolute = /^https?:\/\//i.test(links[i].getAttribute('href'));

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"00a0cfb246bb9f7bc2020cd2964606c2":[function(require,module,exports) {
"use strict";

var _dForceGraph = _interopRequireDefault(require("3d-force-graph"));

var _miserables = _interopRequireDefault(require("./miserables.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let w = window;
w.ForceGraph3D = _dForceGraph.default;
w.miserables = _miserables.default;
},{"3d-force-graph":"70c89414feb963e03c2f06ba7aa55513","./miserables.json":"04dc59396f681c02c45ed1fa9152526f"}],"04dc59396f681c02c45ed1fa9152526f":[function(require,module,exports) {
module.exports = JSON.parse("{\"nodes\":[{\"id\":\"Myriel\",\"group\":1},{\"id\":\"Napoleon\",\"group\":1},{\"id\":\"Mlle.Baptistine\",\"group\":1},{\"id\":\"Mme.Magloire\",\"group\":1},{\"id\":\"CountessdeLo\",\"group\":1},{\"id\":\"Geborand\",\"group\":1},{\"id\":\"Champtercier\",\"group\":1},{\"id\":\"Cravatte\",\"group\":1},{\"id\":\"Count\",\"group\":1},{\"id\":\"OldMan\",\"group\":1},{\"id\":\"Labarre\",\"group\":2},{\"id\":\"Valjean\",\"group\":2},{\"id\":\"Marguerite\",\"group\":3},{\"id\":\"Mme.deR\",\"group\":2},{\"id\":\"Isabeau\",\"group\":2},{\"id\":\"Gervais\",\"group\":2},{\"id\":\"Tholomyes\",\"group\":3},{\"id\":\"Listolier\",\"group\":3},{\"id\":\"Fameuil\",\"group\":3},{\"id\":\"Blacheville\",\"group\":3},{\"id\":\"Favourite\",\"group\":3},{\"id\":\"Dahlia\",\"group\":3},{\"id\":\"Zephine\",\"group\":3},{\"id\":\"Fantine\",\"group\":3},{\"id\":\"Mme.Thenardier\",\"group\":4},{\"id\":\"Thenardier\",\"group\":4},{\"id\":\"Cosette\",\"group\":5},{\"id\":\"Javert\",\"group\":4},{\"id\":\"Fauchelevent\",\"group\":0},{\"id\":\"Bamatabois\",\"group\":2},{\"id\":\"Perpetue\",\"group\":3},{\"id\":\"Simplice\",\"group\":2},{\"id\":\"Scaufflaire\",\"group\":2},{\"id\":\"Woman1\",\"group\":2},{\"id\":\"Judge\",\"group\":2},{\"id\":\"Champmathieu\",\"group\":2},{\"id\":\"Brevet\",\"group\":2},{\"id\":\"Chenildieu\",\"group\":2},{\"id\":\"Cochepaille\",\"group\":2},{\"id\":\"Pontmercy\",\"group\":4},{\"id\":\"Boulatruelle\",\"group\":6},{\"id\":\"Eponine\",\"group\":4},{\"id\":\"Anzelma\",\"group\":4},{\"id\":\"Woman2\",\"group\":5},{\"id\":\"MotherInnocent\",\"group\":0},{\"id\":\"Gribier\",\"group\":0},{\"id\":\"Jondrette\",\"group\":7},{\"id\":\"Mme.Burgon\",\"group\":7},{\"id\":\"Gavroche\",\"group\":8},{\"id\":\"Gillenormand\",\"group\":5},{\"id\":\"Magnon\",\"group\":5},{\"id\":\"Mlle.Gillenormand\",\"group\":5},{\"id\":\"Mme.Pontmercy\",\"group\":5},{\"id\":\"Mlle.Vaubois\",\"group\":5},{\"id\":\"Lt.Gillenormand\",\"group\":5},{\"id\":\"Marius\",\"group\":8},{\"id\":\"BaronessT\",\"group\":5},{\"id\":\"Mabeuf\",\"group\":8},{\"id\":\"Enjolras\",\"group\":8},{\"id\":\"Combeferre\",\"group\":8},{\"id\":\"Prouvaire\",\"group\":8},{\"id\":\"Feuilly\",\"group\":8},{\"id\":\"Courfeyrac\",\"group\":8},{\"id\":\"Bahorel\",\"group\":8},{\"id\":\"Bossuet\",\"group\":8},{\"id\":\"Joly\",\"group\":8},{\"id\":\"Grantaire\",\"group\":8},{\"id\":\"MotherPlutarch\",\"group\":9},{\"id\":\"Gueulemer\",\"group\":4},{\"id\":\"Babet\",\"group\":4},{\"id\":\"Claquesous\",\"group\":4},{\"id\":\"Montparnasse\",\"group\":4},{\"id\":\"Toussaint\",\"group\":5},{\"id\":\"Child1\",\"group\":10},{\"id\":\"Child2\",\"group\":10},{\"id\":\"Brujon\",\"group\":4},{\"id\":\"Mme.Hucheloup\",\"group\":8}],\"links\":[{\"source\":\"Napoleon\",\"target\":\"Myriel\",\"value\":1},{\"source\":\"Mlle.Baptistine\",\"target\":\"Myriel\",\"value\":8},{\"source\":\"Mme.Magloire\",\"target\":\"Myriel\",\"value\":10},{\"source\":\"Mme.Magloire\",\"target\":\"Mlle.Baptistine\",\"value\":6},{\"source\":\"CountessdeLo\",\"target\":\"Myriel\",\"value\":1},{\"source\":\"Geborand\",\"target\":\"Myriel\",\"value\":1},{\"source\":\"Champtercier\",\"target\":\"Myriel\",\"value\":1},{\"source\":\"Cravatte\",\"target\":\"Myriel\",\"value\":1},{\"source\":\"Count\",\"target\":\"Myriel\",\"value\":2},{\"source\":\"OldMan\",\"target\":\"Myriel\",\"value\":1},{\"source\":\"Valjean\",\"target\":\"Labarre\",\"value\":1},{\"source\":\"Valjean\",\"target\":\"Mme.Magloire\",\"value\":3},{\"source\":\"Valjean\",\"target\":\"Mlle.Baptistine\",\"value\":3},{\"source\":\"Valjean\",\"target\":\"Myriel\",\"value\":5},{\"source\":\"Marguerite\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Mme.deR\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Isabeau\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Gervais\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Listolier\",\"target\":\"Tholomyes\",\"value\":4},{\"source\":\"Fameuil\",\"target\":\"Tholomyes\",\"value\":4},{\"source\":\"Fameuil\",\"target\":\"Listolier\",\"value\":4},{\"source\":\"Blacheville\",\"target\":\"Tholomyes\",\"value\":4},{\"source\":\"Blacheville\",\"target\":\"Listolier\",\"value\":4},{\"source\":\"Blacheville\",\"target\":\"Fameuil\",\"value\":4},{\"source\":\"Favourite\",\"target\":\"Tholomyes\",\"value\":3},{\"source\":\"Favourite\",\"target\":\"Listolier\",\"value\":3},{\"source\":\"Favourite\",\"target\":\"Fameuil\",\"value\":3},{\"source\":\"Favourite\",\"target\":\"Blacheville\",\"value\":4},{\"source\":\"Dahlia\",\"target\":\"Tholomyes\",\"value\":3},{\"source\":\"Dahlia\",\"target\":\"Listolier\",\"value\":3},{\"source\":\"Dahlia\",\"target\":\"Fameuil\",\"value\":3},{\"source\":\"Dahlia\",\"target\":\"Blacheville\",\"value\":3},{\"source\":\"Dahlia\",\"target\":\"Favourite\",\"value\":5},{\"source\":\"Zephine\",\"target\":\"Tholomyes\",\"value\":3},{\"source\":\"Zephine\",\"target\":\"Listolier\",\"value\":3},{\"source\":\"Zephine\",\"target\":\"Fameuil\",\"value\":3},{\"source\":\"Zephine\",\"target\":\"Blacheville\",\"value\":3},{\"source\":\"Zephine\",\"target\":\"Favourite\",\"value\":4},{\"source\":\"Zephine\",\"target\":\"Dahlia\",\"value\":4},{\"source\":\"Fantine\",\"target\":\"Tholomyes\",\"value\":3},{\"source\":\"Fantine\",\"target\":\"Listolier\",\"value\":3},{\"source\":\"Fantine\",\"target\":\"Fameuil\",\"value\":3},{\"source\":\"Fantine\",\"target\":\"Blacheville\",\"value\":3},{\"source\":\"Fantine\",\"target\":\"Favourite\",\"value\":4},{\"source\":\"Fantine\",\"target\":\"Dahlia\",\"value\":4},{\"source\":\"Fantine\",\"target\":\"Zephine\",\"value\":4},{\"source\":\"Fantine\",\"target\":\"Marguerite\",\"value\":2},{\"source\":\"Fantine\",\"target\":\"Valjean\",\"value\":9},{\"source\":\"Mme.Thenardier\",\"target\":\"Fantine\",\"value\":2},{\"source\":\"Mme.Thenardier\",\"target\":\"Valjean\",\"value\":7},{\"source\":\"Thenardier\",\"target\":\"Mme.Thenardier\",\"value\":13},{\"source\":\"Thenardier\",\"target\":\"Fantine\",\"value\":1},{\"source\":\"Thenardier\",\"target\":\"Valjean\",\"value\":12},{\"source\":\"Cosette\",\"target\":\"Mme.Thenardier\",\"value\":4},{\"source\":\"Cosette\",\"target\":\"Valjean\",\"value\":31},{\"source\":\"Cosette\",\"target\":\"Tholomyes\",\"value\":1},{\"source\":\"Cosette\",\"target\":\"Thenardier\",\"value\":1},{\"source\":\"Javert\",\"target\":\"Valjean\",\"value\":17},{\"source\":\"Javert\",\"target\":\"Fantine\",\"value\":5},{\"source\":\"Javert\",\"target\":\"Thenardier\",\"value\":5},{\"source\":\"Javert\",\"target\":\"Mme.Thenardier\",\"value\":1},{\"source\":\"Javert\",\"target\":\"Cosette\",\"value\":1},{\"source\":\"Fauchelevent\",\"target\":\"Valjean\",\"value\":8},{\"source\":\"Fauchelevent\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Bamatabois\",\"target\":\"Fantine\",\"value\":1},{\"source\":\"Bamatabois\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Bamatabois\",\"target\":\"Valjean\",\"value\":2},{\"source\":\"Perpetue\",\"target\":\"Fantine\",\"value\":1},{\"source\":\"Simplice\",\"target\":\"Perpetue\",\"value\":2},{\"source\":\"Simplice\",\"target\":\"Valjean\",\"value\":3},{\"source\":\"Simplice\",\"target\":\"Fantine\",\"value\":2},{\"source\":\"Simplice\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Scaufflaire\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Woman1\",\"target\":\"Valjean\",\"value\":2},{\"source\":\"Woman1\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Judge\",\"target\":\"Valjean\",\"value\":3},{\"source\":\"Judge\",\"target\":\"Bamatabois\",\"value\":2},{\"source\":\"Champmathieu\",\"target\":\"Valjean\",\"value\":3},{\"source\":\"Champmathieu\",\"target\":\"Judge\",\"value\":3},{\"source\":\"Champmathieu\",\"target\":\"Bamatabois\",\"value\":2},{\"source\":\"Brevet\",\"target\":\"Judge\",\"value\":2},{\"source\":\"Brevet\",\"target\":\"Champmathieu\",\"value\":2},{\"source\":\"Brevet\",\"target\":\"Valjean\",\"value\":2},{\"source\":\"Brevet\",\"target\":\"Bamatabois\",\"value\":1},{\"source\":\"Chenildieu\",\"target\":\"Judge\",\"value\":2},{\"source\":\"Chenildieu\",\"target\":\"Champmathieu\",\"value\":2},{\"source\":\"Chenildieu\",\"target\":\"Brevet\",\"value\":2},{\"source\":\"Chenildieu\",\"target\":\"Valjean\",\"value\":2},{\"source\":\"Chenildieu\",\"target\":\"Bamatabois\",\"value\":1},{\"source\":\"Cochepaille\",\"target\":\"Judge\",\"value\":2},{\"source\":\"Cochepaille\",\"target\":\"Champmathieu\",\"value\":2},{\"source\":\"Cochepaille\",\"target\":\"Brevet\",\"value\":2},{\"source\":\"Cochepaille\",\"target\":\"Chenildieu\",\"value\":2},{\"source\":\"Cochepaille\",\"target\":\"Valjean\",\"value\":2},{\"source\":\"Cochepaille\",\"target\":\"Bamatabois\",\"value\":1},{\"source\":\"Pontmercy\",\"target\":\"Thenardier\",\"value\":1},{\"source\":\"Boulatruelle\",\"target\":\"Thenardier\",\"value\":1},{\"source\":\"Eponine\",\"target\":\"Mme.Thenardier\",\"value\":2},{\"source\":\"Eponine\",\"target\":\"Thenardier\",\"value\":3},{\"source\":\"Anzelma\",\"target\":\"Eponine\",\"value\":2},{\"source\":\"Anzelma\",\"target\":\"Thenardier\",\"value\":2},{\"source\":\"Anzelma\",\"target\":\"Mme.Thenardier\",\"value\":1},{\"source\":\"Woman2\",\"target\":\"Valjean\",\"value\":3},{\"source\":\"Woman2\",\"target\":\"Cosette\",\"value\":1},{\"source\":\"Woman2\",\"target\":\"Javert\",\"value\":1},{\"source\":\"MotherInnocent\",\"target\":\"Fauchelevent\",\"value\":3},{\"source\":\"MotherInnocent\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Gribier\",\"target\":\"Fauchelevent\",\"value\":2},{\"source\":\"Mme.Burgon\",\"target\":\"Jondrette\",\"value\":1},{\"source\":\"Gavroche\",\"target\":\"Mme.Burgon\",\"value\":2},{\"source\":\"Gavroche\",\"target\":\"Thenardier\",\"value\":1},{\"source\":\"Gavroche\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Gavroche\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Gillenormand\",\"target\":\"Cosette\",\"value\":3},{\"source\":\"Gillenormand\",\"target\":\"Valjean\",\"value\":2},{\"source\":\"Magnon\",\"target\":\"Gillenormand\",\"value\":1},{\"source\":\"Magnon\",\"target\":\"Mme.Thenardier\",\"value\":1},{\"source\":\"Mlle.Gillenormand\",\"target\":\"Gillenormand\",\"value\":9},{\"source\":\"Mlle.Gillenormand\",\"target\":\"Cosette\",\"value\":2},{\"source\":\"Mlle.Gillenormand\",\"target\":\"Valjean\",\"value\":2},{\"source\":\"Mme.Pontmercy\",\"target\":\"Mlle.Gillenormand\",\"value\":1},{\"source\":\"Mme.Pontmercy\",\"target\":\"Pontmercy\",\"value\":1},{\"source\":\"Mlle.Vaubois\",\"target\":\"Mlle.Gillenormand\",\"value\":1},{\"source\":\"Lt.Gillenormand\",\"target\":\"Mlle.Gillenormand\",\"value\":2},{\"source\":\"Lt.Gillenormand\",\"target\":\"Gillenormand\",\"value\":1},{\"source\":\"Lt.Gillenormand\",\"target\":\"Cosette\",\"value\":1},{\"source\":\"Marius\",\"target\":\"Mlle.Gillenormand\",\"value\":6},{\"source\":\"Marius\",\"target\":\"Gillenormand\",\"value\":12},{\"source\":\"Marius\",\"target\":\"Pontmercy\",\"value\":1},{\"source\":\"Marius\",\"target\":\"Lt.Gillenormand\",\"value\":1},{\"source\":\"Marius\",\"target\":\"Cosette\",\"value\":21},{\"source\":\"Marius\",\"target\":\"Valjean\",\"value\":19},{\"source\":\"Marius\",\"target\":\"Tholomyes\",\"value\":1},{\"source\":\"Marius\",\"target\":\"Thenardier\",\"value\":2},{\"source\":\"Marius\",\"target\":\"Eponine\",\"value\":5},{\"source\":\"Marius\",\"target\":\"Gavroche\",\"value\":4},{\"source\":\"BaronessT\",\"target\":\"Gillenormand\",\"value\":1},{\"source\":\"BaronessT\",\"target\":\"Marius\",\"value\":1},{\"source\":\"Mabeuf\",\"target\":\"Marius\",\"value\":1},{\"source\":\"Mabeuf\",\"target\":\"Eponine\",\"value\":1},{\"source\":\"Mabeuf\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Enjolras\",\"target\":\"Marius\",\"value\":7},{\"source\":\"Enjolras\",\"target\":\"Gavroche\",\"value\":7},{\"source\":\"Enjolras\",\"target\":\"Javert\",\"value\":6},{\"source\":\"Enjolras\",\"target\":\"Mabeuf\",\"value\":1},{\"source\":\"Enjolras\",\"target\":\"Valjean\",\"value\":4},{\"source\":\"Combeferre\",\"target\":\"Enjolras\",\"value\":15},{\"source\":\"Combeferre\",\"target\":\"Marius\",\"value\":5},{\"source\":\"Combeferre\",\"target\":\"Gavroche\",\"value\":6},{\"source\":\"Combeferre\",\"target\":\"Mabeuf\",\"value\":2},{\"source\":\"Prouvaire\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Prouvaire\",\"target\":\"Enjolras\",\"value\":4},{\"source\":\"Prouvaire\",\"target\":\"Combeferre\",\"value\":2},{\"source\":\"Feuilly\",\"target\":\"Gavroche\",\"value\":2},{\"source\":\"Feuilly\",\"target\":\"Enjolras\",\"value\":6},{\"source\":\"Feuilly\",\"target\":\"Prouvaire\",\"value\":2},{\"source\":\"Feuilly\",\"target\":\"Combeferre\",\"value\":5},{\"source\":\"Feuilly\",\"target\":\"Mabeuf\",\"value\":1},{\"source\":\"Feuilly\",\"target\":\"Marius\",\"value\":1},{\"source\":\"Courfeyrac\",\"target\":\"Marius\",\"value\":9},{\"source\":\"Courfeyrac\",\"target\":\"Enjolras\",\"value\":17},{\"source\":\"Courfeyrac\",\"target\":\"Combeferre\",\"value\":13},{\"source\":\"Courfeyrac\",\"target\":\"Gavroche\",\"value\":7},{\"source\":\"Courfeyrac\",\"target\":\"Mabeuf\",\"value\":2},{\"source\":\"Courfeyrac\",\"target\":\"Eponine\",\"value\":1},{\"source\":\"Courfeyrac\",\"target\":\"Feuilly\",\"value\":6},{\"source\":\"Courfeyrac\",\"target\":\"Prouvaire\",\"value\":3},{\"source\":\"Bahorel\",\"target\":\"Combeferre\",\"value\":5},{\"source\":\"Bahorel\",\"target\":\"Gavroche\",\"value\":5},{\"source\":\"Bahorel\",\"target\":\"Courfeyrac\",\"value\":6},{\"source\":\"Bahorel\",\"target\":\"Mabeuf\",\"value\":2},{\"source\":\"Bahorel\",\"target\":\"Enjolras\",\"value\":4},{\"source\":\"Bahorel\",\"target\":\"Feuilly\",\"value\":3},{\"source\":\"Bahorel\",\"target\":\"Prouvaire\",\"value\":2},{\"source\":\"Bahorel\",\"target\":\"Marius\",\"value\":1},{\"source\":\"Bossuet\",\"target\":\"Marius\",\"value\":5},{\"source\":\"Bossuet\",\"target\":\"Courfeyrac\",\"value\":12},{\"source\":\"Bossuet\",\"target\":\"Gavroche\",\"value\":5},{\"source\":\"Bossuet\",\"target\":\"Bahorel\",\"value\":4},{\"source\":\"Bossuet\",\"target\":\"Enjolras\",\"value\":10},{\"source\":\"Bossuet\",\"target\":\"Feuilly\",\"value\":6},{\"source\":\"Bossuet\",\"target\":\"Prouvaire\",\"value\":2},{\"source\":\"Bossuet\",\"target\":\"Combeferre\",\"value\":9},{\"source\":\"Bossuet\",\"target\":\"Mabeuf\",\"value\":1},{\"source\":\"Bossuet\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Joly\",\"target\":\"Bahorel\",\"value\":5},{\"source\":\"Joly\",\"target\":\"Bossuet\",\"value\":7},{\"source\":\"Joly\",\"target\":\"Gavroche\",\"value\":3},{\"source\":\"Joly\",\"target\":\"Courfeyrac\",\"value\":5},{\"source\":\"Joly\",\"target\":\"Enjolras\",\"value\":5},{\"source\":\"Joly\",\"target\":\"Feuilly\",\"value\":5},{\"source\":\"Joly\",\"target\":\"Prouvaire\",\"value\":2},{\"source\":\"Joly\",\"target\":\"Combeferre\",\"value\":5},{\"source\":\"Joly\",\"target\":\"Mabeuf\",\"value\":1},{\"source\":\"Joly\",\"target\":\"Marius\",\"value\":2},{\"source\":\"Grantaire\",\"target\":\"Bossuet\",\"value\":3},{\"source\":\"Grantaire\",\"target\":\"Enjolras\",\"value\":3},{\"source\":\"Grantaire\",\"target\":\"Combeferre\",\"value\":1},{\"source\":\"Grantaire\",\"target\":\"Courfeyrac\",\"value\":2},{\"source\":\"Grantaire\",\"target\":\"Joly\",\"value\":2},{\"source\":\"Grantaire\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Grantaire\",\"target\":\"Bahorel\",\"value\":1},{\"source\":\"Grantaire\",\"target\":\"Feuilly\",\"value\":1},{\"source\":\"Grantaire\",\"target\":\"Prouvaire\",\"value\":1},{\"source\":\"MotherPlutarch\",\"target\":\"Mabeuf\",\"value\":3},{\"source\":\"Gueulemer\",\"target\":\"Thenardier\",\"value\":5},{\"source\":\"Gueulemer\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Gueulemer\",\"target\":\"Mme.Thenardier\",\"value\":1},{\"source\":\"Gueulemer\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Gueulemer\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Gueulemer\",\"target\":\"Eponine\",\"value\":1},{\"source\":\"Babet\",\"target\":\"Thenardier\",\"value\":6},{\"source\":\"Babet\",\"target\":\"Gueulemer\",\"value\":6},{\"source\":\"Babet\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Babet\",\"target\":\"Mme.Thenardier\",\"value\":1},{\"source\":\"Babet\",\"target\":\"Javert\",\"value\":2},{\"source\":\"Babet\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Babet\",\"target\":\"Eponine\",\"value\":1},{\"source\":\"Claquesous\",\"target\":\"Thenardier\",\"value\":4},{\"source\":\"Claquesous\",\"target\":\"Babet\",\"value\":4},{\"source\":\"Claquesous\",\"target\":\"Gueulemer\",\"value\":4},{\"source\":\"Claquesous\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Claquesous\",\"target\":\"Mme.Thenardier\",\"value\":1},{\"source\":\"Claquesous\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Claquesous\",\"target\":\"Eponine\",\"value\":1},{\"source\":\"Claquesous\",\"target\":\"Enjolras\",\"value\":1},{\"source\":\"Montparnasse\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Montparnasse\",\"target\":\"Babet\",\"value\":2},{\"source\":\"Montparnasse\",\"target\":\"Gueulemer\",\"value\":2},{\"source\":\"Montparnasse\",\"target\":\"Claquesous\",\"value\":2},{\"source\":\"Montparnasse\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Montparnasse\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Montparnasse\",\"target\":\"Eponine\",\"value\":1},{\"source\":\"Montparnasse\",\"target\":\"Thenardier\",\"value\":1},{\"source\":\"Toussaint\",\"target\":\"Cosette\",\"value\":2},{\"source\":\"Toussaint\",\"target\":\"Javert\",\"value\":1},{\"source\":\"Toussaint\",\"target\":\"Valjean\",\"value\":1},{\"source\":\"Child1\",\"target\":\"Gavroche\",\"value\":2},{\"source\":\"Child2\",\"target\":\"Gavroche\",\"value\":2},{\"source\":\"Child2\",\"target\":\"Child1\",\"value\":3},{\"source\":\"Brujon\",\"target\":\"Babet\",\"value\":3},{\"source\":\"Brujon\",\"target\":\"Gueulemer\",\"value\":3},{\"source\":\"Brujon\",\"target\":\"Thenardier\",\"value\":3},{\"source\":\"Brujon\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Brujon\",\"target\":\"Eponine\",\"value\":1},{\"source\":\"Brujon\",\"target\":\"Claquesous\",\"value\":1},{\"source\":\"Brujon\",\"target\":\"Montparnasse\",\"value\":1},{\"source\":\"Mme.Hucheloup\",\"target\":\"Bossuet\",\"value\":1},{\"source\":\"Mme.Hucheloup\",\"target\":\"Joly\",\"value\":1},{\"source\":\"Mme.Hucheloup\",\"target\":\"Grantaire\",\"value\":1},{\"source\":\"Mme.Hucheloup\",\"target\":\"Bahorel\",\"value\":1},{\"source\":\"Mme.Hucheloup\",\"target\":\"Courfeyrac\",\"value\":1},{\"source\":\"Mme.Hucheloup\",\"target\":\"Gavroche\",\"value\":1},{\"source\":\"Mme.Hucheloup\",\"target\":\"Enjolras\",\"value\":1}]}");
},{}]},{},["24d412131c4c836209bd4440e862f310","00a0cfb246bb9f7bc2020cd2964606c2"], null)

//# sourceMappingURL=import-forcegraph.26a4cdf9.js.map
