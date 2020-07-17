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
})({"9e40b5d38ce112e2d5051ffbda3716de":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "7f456301d3da6e8e1047a96fd46a518d";
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
},{}],"aa97c85f9dce1163dc0f1b0575ce0e5f":[function(require,module,exports) {
"use strict";

var _timeline = _interopRequireDefault(require("./timeline"));

var _when = require("./when");

require("./type-writer");

require("./seek-able");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var global = arguments[3];
global.Timeline = _timeline.default; // import Builds from './builds'
// global.Builds = Builds

Object.assign(global, {
  When: _when.When,
  For: _when.For,
  buildInRange: _when.buildInRange,
  always: _when.always,
  every: _when.every,
  sec: _when.sec,
  lerp: _when.lerp,
  any: _when.any
});

// import './fire'
function collectBuilds() {
  const all = Array.from(document.getElementsByTagName('build-note'));
  let i = all.length;

  while (i-- > 0) {
    const b = all[i];
    b.order = i;
    b.nextBuild = all[i + 1];
    b.prevBuild = all[i - 1];

    b[_when.match] = (_, current) => current === b;
  }

  return all;
}

let BUILDS,
    currentBuild = null;

const getBuildIdFromHash = () => window.location.hash.substr(1);

const getCurrentBuild = () => document.getElementById(getBuildIdFromHash());

const setCurrentBuild = build => {
  build && (window.location.hash = '#' + build.id);
  localStorage.currentBuild = build.id;
};

const activate = build => {
  if (build === currentBuild) return [build, build];

  if (currentBuild) {
    currentBuild.classList.remove('current');
    document.body.classList.remove(currentBuild.id);
  }

  if (!build) return;
  document.body.classList.add(build.id);
  document.body.dataset.currentBuild = build.id;
  build.classList.add('current');
  const prev = currentBuild;
  currentBuild = build;
  return [build, prev];
};

const getAssetsWithLoadStatus = (elementTypes = ['video', 'img', 'audio']) => elementTypes.map(tag => document.getElementsByTagName(tag)).reduce((all, set) => [...all, ...set]).map(v => {
  v.addEventListener('loadeddata', () => v.hasLoaded = true);
  v.addEventListener('load', () => v.hasLoaded = true);
  v.addEventListener('error', err => v.hasError = err);
  v.preload = 'auto';
  v.src = v.src;
  return v;
});

const sleep = (dur = 1[_when.sec]) => new Promise(_ => setTimeout(_, dur));

const createLoadScreen = assets => {
  const loaders = assets.map(asset => Object.assign(document.createElement('type-writer'), {
    asset
  }));
  const term = document.createElement('type-writer');
  term.className = 'terminal';
  const loadScreen = document.createElement('div');
  loadScreen.appendChild(term);
  loadScreen.id = 'bootloader';
  loaders.forEach(l => loadScreen.appendChild(l));
  document.body.appendChild(loadScreen);
  loadScreen.term = term;
  loadScreen.loaders = loaders;
  return loadScreen;
};

const destroyLoadScreen = screen => document.body.removeChild(screen);

const anyKey = () => {
  let resolve,
      p = new Promise(_ => resolve = _);
  addEventListener('keydown', resolve);
  addEventListener('touchstart', resolve);
  addEventListener('mousedown', resolve);
  return p.then(() => {
    removeEventListener('keydown', resolve);
    removeEventListener('touchstart', resolve);
    removeEventListener('mousedown', resolve);
  });
};

async function boot() {
  if (localStorage.loadQuietly) return true;
  const assets = getAssetsWithLoadStatus();
  const loadScreen = createLoadScreen(assets);

  const log = (msg, nl = '\n') => loadScreen.term.type(msg + nl).done;

  log('Please wait, preloading assets for smoother playback...');
  const loading = (0, _when.When)().frame((0, _when.every)(0.5[_when.sec])((_, t) => {
    const dots = new Array(t % 4).fill('.').join('');
    const stillLoading = loadScreen.loaders.filter(l => !l.reportedDone);
    if (!stillLoading.length) return loading.remove();
    stillLoading.forEach(loader => {
      const {
        asset
      } = loader,
            {
        src,
        hasLoaded,
        hasError
      } = asset;

      if (hasLoaded) {
        loader.reportedDone = true;
        return loader.text = `${src}... DONE!`;
      }

      if (hasError) {
        loader.reportedDone = true;
        return loader.text = `${src}... ERROR! ${hasError}`;
      }

      loader.text = loader.asset.src + dots;
    });
  }));
  const skip = document.createElement('a');
  skip.innerText = '[ Skip Preload (tap here or ESC) ]';
  skip.onclick = skipPreload;
  addEventListener('keydown', onPreloadKeydown);

  function onPreloadKeydown(e) {
    if (e.key !== 'Escape') return;
    skipPreload();
  }

  function skipPreload() {
    skip.innerText = 'Preload skipped (video playback may be choppy)';
    localStorage.loadQuietly = true;
    loading.remove();
  }

  loadScreen.prepend(skip);

  try {
    await loading.done;
    removeEventListener('keydown', onPreloadKeydown);
    await log('OK, assets loaded.');

    if (!localStorage.instructionsDelivered) {
      localStorage.instructionsDelivered = true;
      await log('Use ⬅ and ➡ arrow keys to move, or 👆🏽 tap to advance on touch devices.');
      await log('Press any key or tap to continue.');
      await anyKey();
    }

    return true;
  } finally {
    document.body.removeChild(loadScreen);
  }
} // function observeElementBoxes(
//   set=(prop, value) => document.documentElement.style.setProperty(prop, value + 'px')
// ) {
//   const watchId = Symbol('watchId')
//   const observer = new ResizeObserver(entries => {
//     let i = entries.length; while (i --> 0) {
//       const {contentRect, target: {[watchId]: id}} = entries[i]
//       console.log(contentRect.left)
//       set(`--${id}-top`, contentRect.top)
//       set(`--${id}-left`, contentRect.left)
//       set(`--${id}-bottom`, contentRect.bottom)
//       set(`--${id}-right`, contentRect.right)
//       set(`--${id}-width`, contentRect.width)
//       set(`--${id}-height`, contentRect.height)      
//     }
//   })
//   const watching = document.querySelectorAll('[data-watch-box]')
//   let i = watching.length; while (i --> 0) {
//     const e = watching[i]
//     e[watchId] = e.dataset.watchBox || e.id
//     observer.observe(e)
//   }
// }


async function main() {
  BUILDS = collectBuilds();
  Object.assign(global, {
    getCurrentBuild,
    BUILDS
  });
  localStorage.buildNotes = JSON.stringify(BUILDS.map(({
    id,
    order,
    textContent,
    innerHTML,
    nextBuild,
    prevBuild
  }) => {
    return {
      id,
      order,
      textContent,
      innerHTML,
      nextBuildId: nextBuild && nextBuild.id,
      prevBuildId: prevBuild && prevBuild.id
    };
  })); // observeElementBoxes()

  let ready = false;

  const frame = ts => {
    requestAnimationFrame(frame);
    if (!ready) return (0, _when.runAnimatorStep)(ts, null, null);

    if (!getCurrentBuild()) {
      setCurrentBuild(BUILDS[0]);
    }

    const [current, prev] = activate(getCurrentBuild());
    global.__currentBuild = current;
    global.__prevBuild = prev;
    (0, _when.runAnimatorStep)(ts, current, prev);
  };

  requestAnimationFrame(frame);
  ready = await boot();
}

function onKey({
  code
}) {
  switch (code) {
    case 'ArrowRight':
    case 'PageDown':
      currentBuild && currentBuild.nextBuild && setCurrentBuild(currentBuild.nextBuild);
      return;

    case 'ArrowLeft':
    case 'PageUp':
      currentBuild && currentBuild.prevBuild && setCurrentBuild(currentBuild.prevBuild);
      return;
  }
}

function updateBuildFromLocalStorage() {
  const build = document.getElementById(localStorage.currentBuild);
  if (build) setCurrentBuild(build);
}

addEventListener('storage', updateBuildFromLocalStorage);
addEventListener('DOMContentLoaded', main);
addEventListener('keydown', onKey);
addEventListener('mousedown', () => currentBuild && currentBuild.nextBuild && setCurrentBuild(currentBuild.nextBuild));
addEventListener('touchstart', () => currentBuild && currentBuild.nextBuild && setCurrentBuild(currentBuild.nextBuild));
},{"./timeline":"479df63fcf01fa02e81ad48d6eca331a","./when":"36610a9d3b60041d5afed0d0c46dfc02","./type-writer":"b2f3c44cf2b5ebd30543f98ad15b4f68","./seek-able":"6ff132b19e70d3202dc4a72ecdf9d59b"}],"479df63fcf01fa02e81ad48d6eca331a":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _binarysearch = _interopRequireDefault(require("binarysearch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const compareCueToTime = ({
  at
}, time) => at - time;

var _default = (cues = []) => {
  cues.forEach((cue, i) => cue.index = i);

  const lookup = needle => {
    if (needle.currentTime) return lookup(needle.currentTime);
    return cues[index(needle, compareCueToTime)];
  };

  const index = (needle, compare = compareCueToTime) => _binarysearch.default.closest(cues, needle, compare);

  lookup.cues = cues;
  lookup.index = index;
  return lookup;
};

exports.default = _default;
},{"binarysearch":"cd97fed1bd7f78becd295cba448c2215"}],"cd97fed1bd7f78becd295cba448c2215":[function(require,module,exports) {


module.exports = function(arr,search,comparitor) {
  if(!arr) return -1;
  // as long as it has a length i will try and itterate over it.
  if(arr.length === undefined) return -1;
  
  if(!comparitor) comparitor = module.exports._defaultComparitor();

  return bs(arr,search,comparitor);
}

module.exports.first = function(arr,search,comparitor) {
  return module.exports.closest(arr,search,{exists:true},comparitor);
}

module.exports.last = function(arr,search,comparitor) {
  return module.exports.closest(arr,search,{exists:true,end:true},comparitor);
}

module.exports.closest = function(arr,search,opts,comparitor) {

  if(typeof opts === 'function') {
    comparitor = opts;
    opts = {};
  }

  if(arr.length === 0) return -1;
  if(arr.length === 1) return 0;

  opts = opts||{};
  if(!comparitor) comparitor = this._defaultComparitor();
  
  var closest = bsclosest(arr, search, comparitor, opts.end, opts.exists?false:true);

  if(closest > arr.length-1) closest = arr.length-1;
  else if(closest < 0) closest = 0;

  return closest;
}

// inserts element into the correct sorted spot into the array
module.exports.insert = function(arr,search,opts,comparitor){ 

  if(typeof opts === 'function') {
    comparitor = opts;
    opts = {};
  }

  opts = opts||{};
  if(!comparitor) comparitor = module.exports._defaultComparitor();
  if(!arr.length) {
    arr[0] = search;
    return 0;
  }

  var closest = module.exports.closest(arr,search,comparitor);

  var cmp = comparitor(arr[closest],search);
  if(cmp < 0) {//less
    arr.splice(++closest,0,search);
  } else if(cmp > 0){ 
    arr.splice(closest,0,search);
  } else {
    if(opts.unique){
      arr[closest] = search;
    } else {
      // im equal. this value should be appended to the list of existing same sorted values.
      while(comparitor(arr[closest],search) === 0){
        if(closest >= arr.length-1) break;
        closest++;
      }

      arr.splice(closest,0,search);
    }
  }
  return closest;
}

// this method returns the start and end indicies of a range. [start,end]
module.exports.range = function(arr,from,to,comparitor) {
  if(!comparitor) comparitor = module.exports._defaultComparitor();

  var fromi = module.exports.closest(arr,from,comparitor);

  var toi = module.exports.closest(arr,to,{end:true},comparitor);

  // this is a hack. 
  // i should be able to fix the algorithm and generate a correct range.

  while(fromi <= toi){ 
    if(comparitor(arr[fromi],from) > -1) break;

    fromi++
  }

  while(toi >= fromi){ 
    if(comparitor(arr[toi],to) < 1) break;
    toi--;
  }

  return [fromi,toi];
}

// this method returns the values of a range;
module.exports.rangeValue = function(arr,from,to,comparitor){
  var range = module.exports.range(arr,from,to,comparitor);
  return arr.slice(range[0],range[1]+1);
}

//
module.exports.indexObject = function(o,extractor) {
  var index = [];
  
  Object.keys(o).forEach(function(k){
    index.push({k:k,v:extractor(o[k])});
  });

  return index.sort(function(o1,o2){
    return o1.v - o2.v;
  });
}

module.exports.cmp = function(v1,v2){
  return v1 - v2;
}

module.exports._defaultComparitor = function() {
  var indexMode,indexModeSearch;
  var stringMode;
  return function(v,search){
    // support the object format of generated indexes
    if(indexMode === undefined){
      if(typeof v === 'object' && v.hasOwnProperty('v')) indexMode = true;
      if(typeof search === 'object' && search.hasOwnProperty('v')) indexModeSearch = true
    }

    if(indexMode) v = v.v;
    if(indexModeSearch) search = search.v;

    if(stringMode === undefined){
      stringMode = false
      if(typeof search === 'string' || typeof v === "string"){
        stringMode = true
      }
    }

    if(stringMode) v = v+''

    return v > search ? 1 : v < search ? -1 : 0
  };
};

module.exports._binarySearch = bs;
module.exports._binarySearchClosest = bsclosest;

function bs(arr, search, comparitor) {

  var max = arr.length-1,min = 0,middle,cmp;
  // continue searching while key may exist
  while (max >= min) {
    middle = mid(min, max);

    cmp = comparitor(arr[middle],search,middle);

    if (cmp < 0) {
      min = middle + 1;
    } else if (cmp > 0) {
      max = middle - 1;
    } else {
      return middle;
    }
  }
  // key not found
  return -1;
}

function bsclosest(arr, search, comparitor, invert, closest) {
  var mids = {}
  , min = 0,max = arr.length-1,middle,cmp
  , sanity = arr.length;

  while (min < max) {
    middle = midCareful(min, max,mids); 
    cmp = comparitor(arr[middle],search,middle);
    if(invert){
      if (cmp > 0)max = middle - 1;
      else min = middle;   
    } else {
      if (cmp < 0)min = middle + 1;
      else max = middle;
    }
    if(!--sanity) break;
  }
   
  if (max == min && comparitor(arr[min],search) === 0) return min;
  
  if(closest) {
    var match = comparitor(arr[min],search);
    if(min == arr.length-1 && match < 0) return min;
    if(min == 0 && match > 0) return 0;

    return closest?(invert?min+1:min-1):-1;
  } 
  return -1; 
}

function mid(v1,v2){
  return v1+Math.floor((v2-v1)/2);
}

function midCareful(v1,v2,mids){
  var mid = v1+Math.floor((v2-v1)/2);
  if(mids[mid]) mid = v1+Math.ceil((v2-v1)/2);
  mids[mid] = 1;
  return mid;
}

},{}],"36610a9d3b60041d5afed0d0c46dfc02":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.always = always;
exports.When = When;
exports.addAnimator = addAnimator;
exports.removeAnimator = removeAnimator;
exports.any = exports.buildInRange = exports.match = exports.runAnimatorStep = exports.lerp = exports.sec = exports.every = exports.For = exports.unattached = exports.defaultContext = void 0;
var global = arguments[3];
const defaultContext = {
  add: addAnimator,
  remove: removeAnimator
};
exports.defaultContext = defaultContext;
const unattached = {
  add: _ => {},
  remove: _ => {}
};
exports.unattached = unattached;

function always() {
  return true;
}

function When(condition = always, ctx = defaultContext) {
  if (new.target == null) return new When(condition, ctx);
  this.condition = condition;
  this.running = false;
  this._handlers = {
    start: [],
    frame: [],
    at: [],
    end: [],
    changed: []
  };

  this._resetDone();

  this._ctx = ctx;
  ctx.add && ctx.add(this);
}

const fire = type => ({
  [type](cb) {
    this._handlers[type].push(cb);

    return this;
  },

  [`_fire_${type}`](ts, currentBuild, lastBuild) {
    const cbs = this._handlers[type];
    const count = cbs.length;

    for (let i = 0; i !== count; ++i) cbs[i].apply(this, [ts, currentBuild, lastBuild]);
  }

});

Object.assign(When.prototype, ...['start', 'frame', 'at', 'end', 'changed'].map(fire));

When.prototype._resetDone = function () {
  this.done = new Promise(_ => this._resolveDone = _);
};

When.prototype.withName = function (name) {
  this.name = name;
  return this;
};

When.prototype.withDuration = function (duration) {
  this.duration = duration;
  return this;
};

When.prototype.remove = function () {
  this._ctx.remove(this);

  return this;
};

When.prototype.step = function (ts, currentBuild, lastBuild) {
  const shouldRun = this.condition[match](ts, currentBuild, lastBuild);

  if (shouldRun && !this.running) {
    this._fire_start(ts, currentBuild, lastBuild);

    this.startedAt = ts;
    this.running = true;
  }

  if (!shouldRun && this.running) {
    this._fire_end(ts, currentBuild, lastBuild);

    this.endedAt = ts;
    this.running = false;

    this._resolveDone(this);

    this._resetDone();
  }

  if (this.running) {
    if (currentBuild !== lastBuild) this._fire_changed(ts, currentBuild, lastBuild);

    this._fire_frame(ts, currentBuild, lastBuild);

    if (typeof this.duration === 'number') {
      const t = (ts - this.startedAt) / this.duration;
      this.t = t;

      this._fire_at(t, currentBuild, lastBuild);
    }
  }
};

const For = (duration, ctx = defaultContext) => {
  let endTime;
  const anim = When(ts => !anim.running || ts < endTime, ctx).withDuration(duration).start(ts => endTime = ts + duration).end(() => ctx.remove(anim));
  return anim;
};

exports.For = For;

const every = interval => {
  let lastTick = null;
  return cb => function (ts, currentBuild, lastBuild) {
    const currentTick = Math.floor((ts - this.startedAt) / interval);
    if (currentTick !== lastTick) cb.apply(this, [ts, currentTick, currentBuild, lastBuild]);
    lastTick = currentTick;
  };
};
/****** Unit utilities ******/


exports.every = every;

const sec = seconds => 1000 * seconds;

exports.sec = sec;
sec.symbol = Symbol('seconds');

sec[Symbol.toPrimitive] = () => sec.symbol;

Object.defineProperty(Number.prototype, sec, {
  get() {
    return sec(this.valueOf());
  }

});
Object.defineProperty(String.prototype, sec, {
  get() {
    return sec(+this);
  }

});
/****** Animation utils ******/

const lerp = (from, to, map = _ => _) => {
  const delta = to - from;
  return t => map(from + t * delta);
};
/****** Animator framework ******/


exports.lerp = lerp;
global.__animators = global.__animators || [];

global.__cascadeDebug = (debug = true) => debug ? log = console : log = debuggingOff;

const debuggingOff = {
  log() {},

  table() {}

};
let log = debuggingOff;

function addAnimator(animator) {
  global.__animators.push(animator);

  log.log('added animator', animator);
  log.table(global.__animators);
}

function removeAnimator(animator) {
  const animators = global.__animators;
  const idx = animators.indexOf(animator);
  if (idx >= 0) animators.splice(idx, 1);

  animator._resolveDone();
}

const runAnimatorStep = (ts, currentBuild, prevBuild) => {
  const animators = global.__animators;
  let i = animators.length;

  while (i-- > 0) animators[i].step(ts, currentBuild, prevBuild);
};
/****** Condition helpers ******/


exports.runAnimatorStep = runAnimatorStep;
const match = Symbol('when/match');
exports.match = match;
Object.defineProperty(Function.prototype, match, {
  get() {
    return this;
  }

});

const buildInRange = (from, to) => (ts, current) => current && current.order >= from.order && current.order <= to.order;

exports.buildInRange = buildInRange;

const any = (...matchers) => (ts, current, next) => matchers.some(m => m[match](ts, current, next));

exports.any = any;
},{}],"b2f3c44cf2b5ebd30543f98ad15b4f68":[function(require,module,exports) {
"use strict";

var _when = require("./when");

const {
  ceil,
  floor
} = Math;

class TypeWriter extends HTMLElement {
  static get observedAttributes() {
    return ['text'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: 'open'
    });
    const text = document.createTextNode('');
    const cursor = document.createElement('span');
    const style = document.createElement('style');
    style.textContent = TypeWriter.style;
    cursor.className = 'blinking cursor';
    shadow.appendChild(style);
    shadow.appendChild(text);
    shadow.appendChild(cursor);
    this.cursor = cursor;
    this.textNode = text;
    this.currentTargetText = '';
  }

  type(input, rate = this.typingRate) {
    const {
      textNode: text
    } = this;
    const startText = text.textContent;
    if (this.anim) this.anim.remove();
    return this.anim = (0, _when.For)(input.length[_when.sec] / rate).withName('typing').start(() => this.cursor.classList.remove('blinking')).at(t => text.textContent = startText + input.substr(0, ceil(t * input.length))).end(() => {
      this.cursor.classList.add('blinking');
      text.textContent = startText + input;
    });
  }

  erase(count = this.textNode.textContent.length, rate = this.erasingRate) {
    const {
      textNode: text
    } = this;
    const startText = text.textContent;
    const length = (0, _when.lerp)(startText.length, startText.length - count);
    if (this.anim) this.anim.remove();
    return this.anim = (0, _when.For)(count[_when.sec] / rate).withName('erasing').start(() => this.cursor.classList.remove('blinking')).at(t => text.textContent = startText.substr(0, floor(length(t)))).end(() => {
      text.textContent = startText.substr(0, startText.length - count);
      this.cursor.classList.add('blinking');
    });
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'text') this.setText(newValue);
  }

  set text(newText) {
    this.setText(newText);
  }

  get text() {
    return this.textNode.textContent;
  }

  async setText(newText) {
    const {
      textNode
    } = this;
    if (this.currentTargetText === newText) return;
    this.currentTargetText = newText;
    const currentText = this.text;
    const prefixLength = commonPrefix(currentText, newText);
    const delta = currentText.length - prefixLength;
    if (delta) await this.erase(delta).done;
    this.type(newText.substr(prefixLength));
  }

  get typingRate() {
    return +getComputedStyle(this).getPropertyValue('--typewriter-typing-rate') || 32;
  }

  get erasingRate() {
    return +getComputedStyle(this).getPropertyValue('--typewriter-erasing-rate') || 60;
  }

}

const commonPrefix = (a, b) => {
  for (let i = 0; i != a.length; ++i) {
    if (a[i] !== b[i]) return i;
  }

  return a.length;
};

TypeWriter.style = `
.cursor {
  display: inline-block;
  background: var(--typewriter-cursor-color);
  width: 2px;
  height: 1.2em;
  position: relative;
  top: 0.2em;
}

.cursor.blinking {
  animation-name: blink;
  animation-duration: var(--typewriter-cursor-blink-rate);
  animation-iteration-count: infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 1; }
  60% { opacity: 0; }
  90% { opacity: 0; }
  100% { opacity: 1; }
}
`;
customElements.define('type-writer', TypeWriter);
if (module.hot) module.hot.accept(() => false);
},{"./when":"36610a9d3b60041d5afed0d0c46dfc02"}],"6ff132b19e70d3202dc4a72ecdf9d59b":[function(require,module,exports) {
"use strict";

var _when = require("./when");

const Seekable = MediaBase => class SeekAble extends MediaBase {
  seekTo({
    duration: seekDuration = 1,
    time = this.currentTime,
    playbackRate = this.playbackRate,
    paused = this.paused
  }) {
    if (this.anim) {
      this.anim.remove();
      this.anim = null;
    }

    if (!seekDuration || time < this.currentTime) this.currentTime = time;

    const setFinalState = () => {
      this.currentTime = time;
      this.playbackRate = playbackRate;
      if (typeof paused !== 'undefined') paused ? this.pause() : this.play();
    };

    if (seekDuration && this.currentTime !== time) {
      if (this.paused) this.play();
      let endTime = null;
      const duration = seekDuration[_when.sec];
      return this.anim = (0, _when.For)(seekDuration[_when.sec]).withName('seekVideo').start(ts => endTime = ts + duration).frame((0, _when.every)(0.5[_when.sec])(ts => {
        const remaining = endTime - ts;
        const delta = (time - this.currentTime)[_when.sec];
        const targetRate = Math.min(Math.max(delta / remaining, 0.1), 5);
        this.playbackRate = targetRate;
      })).end(setFinalState);
    }

    setFinalState();
  }

};

customElements.define('seekable-video', Seekable(HTMLVideoElement), {
  extends: 'video'
});
customElements.define('seekable-audio', Seekable(HTMLAudioElement), {
  extends: 'audio'
});
},{"./when":"36610a9d3b60041d5afed0d0c46dfc02"}]},{},["9e40b5d38ce112e2d5051ffbda3716de","aa97c85f9dce1163dc0f1b0575ce0e5f"], null)

//# sourceMappingURL=main.7f456301.js.map
