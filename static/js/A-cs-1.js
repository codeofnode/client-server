var GLOBAL_VARS={"app":{"name":"client-server","key":"cs","title":"A Client Server app","keywords":"client server json modular app","description":"A sample application with json2server to demonstrate its use to build modular application.","version":"0.0.1"},"errors":{"400":{"status":400,"_":"Invalid inputs."},"404":{"status":404,"_":"Invalid request route."},"405":{"status":405,"_":"Method not allowed."},"408":{"status":408,"_":"It taking huge time to evaluate request. Time out. Aborted."},"500":{"status":500,"_":"An unknown error has been occurred. Please contact us at support@example.com"},"inval":{"status":400,"_":"Request parameter was invalid."}},"supportEmail":"support@example.com","defTimeout":18000,"defKey":"_","apiUrl":"/api","messages":{"mainloading":"loading ...","loadingtimeout":"If it taking too much time, please contact us at support@example.com.","success":"Request was successful.","permdenied":"Permission denied. Please contact your admin."},"buildNumber":0,"version":"0.0.1","search":{"title":"search below","text":"instance","key":"ins"},"showTopSearch":"none","theme":{"primary":"pink","accent":"blue"},"material":"1.3.0"};
var GLOBAL_APP_CONFIG = {},
  GLOBAL_METHODS = {};
//_ONLY_SERVER_END
//END_NO_OUT_FILE


GLOBAL_METHODS.assign = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  const baseTypes = ['string','number','boolean','undefined'];

  function func(ab,bb,noob){
    if(typeof ab !== 'object' || !ab) ab = Array.isArray(bb) ? new Array(bb.length) : {};
    if(typeof bb === 'object' && bb){
      var kys = Object.keys(bb), kl = kys.length;
      for(var j =0; j< kl; j++){
        if(noob !== true || (baseTypes.indexOf(typeof ab[kys[j]]) !== -1) ||
            (baseTypes.indexOf(typeof bb[kys[j]]) !== -1)){
          ab[kys[j]] = bb[kys[j]];
        }
      }
    }
    return ab;
  }

  function main(){
    var ln = arguments.length, noob = arguments[ln-1];
    if(noob === true){ ln--; }
    else noob = false;
    var no = func(arguments[0],arguments[1],noob);
    for(var j =2;j<ln;j++){
      func(no,arguments[j],noob);
    }
    return no;
  }

  return main;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.isAlphaNum = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){
  function func(st){
    return Boolean(!(/[^A-Za-z0-9]/).test(st));
  }

  return func;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.lastValue = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function loop(inp,key){
    if(inp !== undefined && inp !== null){
      return inp[key];
    } else return undefined;
  }

  function func(root){
    var len = arguments.length, now = root, moveWith = loop;
    if(len < 1) return undefined;
    if(len === 1) return root;
    var func = arguments[len - 1];
    if(typeof func === 'function'){
      len--;
      moveWith = func;
    }
    for(var z =1;z<len;z++){
      now = moveWith(root,arguments[z]);
      if(now === undefined){
        break;
      } else {
        root = now;
      }
    }
    return now;
  }

  return func;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.makeToLast = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function func(root){
    var len = arguments.length, now = root;
    for(var z =1;z<len;z++){
      if(now[arguments[z]] === undefined || now[arguments[z]] === null){
        now[arguments[z]] = {};
      }
      root = now = now[arguments[z]];
    }
    return now;
  }

  return func;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.objwalk = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function walkInto(fun, rt, obj, key, isLast){
    fun(obj, key, rt, typeof isLast === 'boolean' ? isLast : true);
    if(typeof obj === 'object' && obj && obj['$W_END'] !== true){
      var kys = Object.keys(obj), kl = kys.length;
      for(var j =0; j< kl; j++){
        walkInto(fun, obj, obj[kys[j]], kys[j], (j === (kl-1)));
      }
    }
  }

  return walkInto;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.replace = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  const START_VAR = '{{', END_VAR = '}}', SVAR_L = 2, EVAR_L = 2,
        NOT_FOUND_MSG = 'VAR_NOT_FOUND',
        VAR_REG = /(\{\{[a-zA-Z0-9\$\.\_]+\}\})+/g;

  const WALK_INTO = GLOBAL_METHODS.objwalk,
        IS_ALPHA_NUM = GLOBAL_METHODS.isAlphaNum,
        ASSIGN = GLOBAL_METHODS.assign;

  function isWithVars(st){
    if(st && typeof st === 'string' && st.length > (END_VAR.length+START_VAR.length)) {
      var f = st.indexOf(START_VAR), l = st.indexOf(END_VAR);
      return (f !== -1 && l !== -1) ? [f,l] : false;
    } else return false;
  }

  function _noUndefined(st, def){
    return st === undefined ? def : st;
  }

  function getVarVal(varVal, varName, variablesMap){
    if(typeof variablesMap !== 'object' || !variablesMap){
      return varVal;
    }
    if(varName.indexOf('.') !== -1){
      var spls = varName.split('.'), ln = spls.length, valFound = true;
      if(ln){
        var base = getVarVal(spls[0], spls[0], variablesMap), curVal;
        for(var j = 1; j < ln; j++){
          if(spls[j].length){
            if(typeof base === 'object'){
              curVal = replace(spls[j], variablesMap);
              try {
                base = base[curVal];
              } catch(erm) {
                valFound = false;
              }
            } else {
              valFound = false;
            }
          }
        }
        if(valFound){
          return _noUndefined(base,varVal);
        }
      }
    }
    return variablesMap.hasOwnProperty(varName) ? variablesMap[varName] : _noUndefined(varVal);
  }

  function extractVars(str){
    return str.match(VAR_REG) || [];
  }

  function extractVarName(variable){
    return variable.substring(SVAR_L, variable.length - EVAR_L);
  }

  function _replace(st,vars){
    var replaced, varName, nvars = extractVars(st), reRep = false;
    for(var i = 0; i < nvars.length; i++){
      varName = extractVarName(nvars[i]);
      replaced = getVarVal(nvars[i], varName, vars);
      if(st === nvars[i]) return replaced;
      var rValue = (typeof replaced === 'string') ? replaced : JSON.stringify(replaced);
      st = st.replace(nvars[i], function(){ return rValue; });
    }
    return st;
  }

  function replace(st,vars,ins){
    if(typeof st === 'string'){
      if(typeof vars !== 'object' || !vars){
        return st;
      }
      if(!(Array.isArray(ins))){
        ins = isWithVars(st);
      }
      if(!(ins)) {
        return st;
      }
      var reRep = (st.indexOf('.'+START_VAR) !== -1) && (st.indexOf(END_VAR+'.') !== -1);
      st = _replace(st,vars);
      if(reRep){
        st = _replace(st,vars);
      }
    }
    return st;
  }

  function handleFunction(inp,vars,methods){
    if(typeof inp === 'object' && inp) {
      if(typeof methods === 'object' && (typeof inp['@'] === 'string') &&
          IS_ALPHA_NUM(inp['@']) && (typeof methods[inp['@']] === 'function')){
        var pms = (typeof inp.params === 'object' && inp.params !== null) ? ASSIGN(false,inp.params) : inp.params;
        var params = deepReplace(pms,vars,methods);
        if(!(Array.isArray(params))){
          params = [params];
        }
        params.unshift(vars,methods);
        return methods[inp['@']].apply(null, params);
      }
    }
    return inp;
  }

  function deepReplace(input,vars,methods){
    if(typeof input !== 'object' || !input){
      return replace(input, vars);
    }
    input = handleFunction(input,vars,methods);
    WALK_INTO(function(valn, key, rt){
      if(typeof rt === 'object' && rt && typeof rt.hasOwnProperty === 'function' && rt.hasOwnProperty(key)){
        var val = rt[key], tmpKy = null, isth = isWithVars(key);
        if(isth){
          tmpKy = replace(key, vars, isth);
          if(tmpKy !== key){
            val = rt[tmpKy] = rt[key];
            delete rt[key];
          }
        }
        if(typeof val === 'string' && val){
          isth = isWithVars(val);
          if(isth){
            rt[tmpKy || key] = replace(val, vars, isth);
          }
        } else {
          rt[tmpKy || key] = handleFunction(val,vars,methods);
        }
      }
    }, null, input);
    return input;
  }

  return deepReplace;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.resolveSlash = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function func(url,ls,rm){
    if(typeof url === 'string'){
      if(ls){
        if(rm){
          url = url.endsWith('/') ? url.slice(0,-1) : url
        } else {
          url = url.endsWith('/') ? url : (url + '/')
        }
      } else {
        if(rm){
          url = (url.charAt(0) === '/') ? url.slice(1) : url;
        } else {
          url = (url.charAt(0) === '/') ? url : ('/'+url);
        }
      }
    }
    return url;
  }

  return func;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.stringify = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function func(st,pretty){
    if(typeof st !== 'string'){
      if(typeof st === 'object'){
        try {
          st = pretty ? JSON.stringify(st, null, '  ') : JSON.stringify(st);
        } catch(er){
          st = String(st);
        }
      } else {
        st = String(st);
      }
    }
    return st;
  }

  return func;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);
GLOBAL_METHODS.request = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){
  function isObject(ob){
    return typeof ob === 'object' && ob !== null && !(Array.isArray(ob));
  }

  function func(options,cb){
    var url, method, payload, headers, parser;
    if(typeof cb !== 'function'){
      cb = function(){};
    }
    if(typeof options === 'string'){
      url = options;
      method = 'GET';
      parser = JSON.parse;
    } else if(isObject(options)){
      url = options.url;
      method = options.method;
      payload = options.payload;
      headers = options.headers;
      parser = typeof options.parser === 'function' ? options.parser : JSON.parse;
    } else {
      return cb('INVALID_OPTIONS');
    }
    if(typeof url !== 'string' || !url.length){
      return cb('URL_NOT_FOUND');
    }
    if(typeof method !== 'string' || !method.length){
      return cb('METHOD_NOT_FOUND');
    }
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      return cb('XMLHTTP_NOT_AVAILABLE');
    }
    httpRequest.onreadystatechange = function(){
      if(httpRequest.readyState === XMLHttpRequest.DONE) {
        var resHeaders = httpRequest.getAllResponseHeaders();
        var toSend = {
          statusCode : httpRequest.status,
          content : httpRequest.responseText,
        };
        if(resHeaders){
          toSend.headers = resHeaders.split('\n');
        }
        if(httpRequest.responseXML){
          toSend.parsed = httpRequest.responseXML;
        } else if(typeof parser === 'function'){
          try {
            toSend.parsed = parser(httpRequest.responseText);
          } catch(er){
            toSend.parseError = er;
          }
        }
        if (typeof toSend.statusCode === 'number' && Math.floor((toSend.statusCode / 100)) === 2) {
          cb(null, toSend);
        } else {
          cb(toSend);
        }
      }
    }
    httpRequest.open(method, url, true);
    var contFound = false;
    if(isObect(options.headers)){
      for(var ky in options.headers){
        if(typeof options.headers[ky] === 'string'){
          if(ky.toLowerCase() === 'content-type'){
            contFound = true;
          }
          httpRequest.setRequestHeader(ky, options.headers[ky]);
        }
      }
    }
    if(!(contFound)){
      httpRequest.setRequestHeader('content-type', 'application/json');
    }
    if (payload !== undefined) {
      payload = GLOBAL_METHODS.stringify(payload);
      httpRequest.send(payload);
    } else {
      httpRequest.send();
    }
    return httpRequest;
  }

  return func;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS);


GLOBAL_METHODS.addWindowEvent = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function addEvent(func,on) {
    if(typeof on !== 'string') on = 'onload';
    var oldonload = window[on];
    if (typeof window[on] != 'function') {
      window[on] = func;
    } else {
      window[on] = function() {
        if (oldonload) {
          oldonload();
        }
        if(typeof func === 'function'){
          func();
        }
      }
    }
  }

  return addEvent;
})(GLOBAL_APP_CONFIG,GLOBAL_METHODS);
GLOBAL_METHODS.appendHtml = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function func(el, str) {
    var last = null, div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
      last = el.appendChild(div.children[0]);
    }
    return last;
  }

  return func;
})(GLOBAL_APP_CONFIG,GLOBAL_METHODS);
GLOBAL_METHODS.eventer = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function func(){
    function EventEmitter() {
      this.events = {};
    }

    EventEmitter.prototype.on = function (event, listener) {
      if(typeof this.events[event] !== 'object') {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    };

    EventEmitter.prototype.removeListener = function (event, listener) {
      var idx;
      if(typeof this.events[event] === 'object') {
        idx = this.events[event].indexOf(listener);
        if (idx > -1) {
          this.events[event].splice(idx, 1);
        }
      }
    };

    EventEmitter.prototype.emit = function (event) {
      var i, listeners, length, args = [].slice.call(arguments, 1);

      if(typeof this.events[event] === 'object') {
        listeners = this.events[event].slice();
        length = listeners.length;

        for(i = 0; i < length; i++) {
          listeners[i].apply(this, args);
        }
      }
    };

    EventEmitter.prototype.once = function (event, listener) {
      this.on(event, function g() {
        this.removeListener(event, g);
        listener.apply(this, arguments);
      });
    };

    return new EventEmitter();
  }

  return func;
})(GLOBAL_APP_CONFIG,GLOBAL_METHODS);
GLOBAL_METHODS.getParsedURL = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(1).split('&');
    for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
  }

  function func(){
    var lc = location;
    return {
      hash : lc.hash,
      host : lc.host,
      hostname : lc.hostname,
      href : lc.href,
      origin : lc.origin,
      pathname : lc.pathname,
      port : lc.port,
      query : parseQuery(lc.search),
      protocol : lc.protocol
    };
  }

  return func;
})(GLOBAL_APP_CONFIG,GLOBAL_METHODS);
GLOBAL_METHODS.hideAllChildren = (function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function func(el){
    var itemDivs = el.children, n = itemDivs.length;
    for(var i = 0; i < n; i++) {
      itemDivs[i].style.display = 'none';
    }
  }

  return func;
})(GLOBAL_APP_CONFIG,GLOBAL_METHODS);
//CLIENT_METHODS_BLOCK


const SERVER = (function (GLOBAL_APP_CONFIG,GLOBAL_METHODS){
  var mainHandler = false;

  var MAIN_CONT_ID = GLOBAL_APP_CONFIG.mainContentBlockId || 'main-content-block';

  var ReqResMap = {
  };

  function getNewReqRes(idm){
    if(ReqResMap[idm]){
      return ReqResMap[idm];
    } else {
      ReqResMap[idm] = [new Request(), new Response()];
      return ReqResMap[idm];
    }
  }

  window.topath = function(route,title,data,handle){
    if(typeof route === 'string'){
      window.history.pushState(data, title, route);
    }
    var ar = getNewReqRes(location.pathname);
    GLOBAL_METHODS.hideAllChildren(document.getElementById(MAIN_CONT_ID));
    ar[1].element.style.display = 'block';
    if(handle !== false) {
      (typeof handle === 'function' ? handle : mainHandler)(ar[0],ar[1]);
    }
    return false;
  };

  window.r2 = window.topath;
  GLOBAL_METHODS.topath = window.topath;

  var eventer = GLOBAL_METHODS.eventer();

  var evon = eventer.on.bind(eventer),
    evonce = eventer.once.bind(eventer),
    evemit = eventer.emit.bind(eventer),
    evremoveListener = eventer.removeListener.bind(eventer);

  function Request(){
    this.on = evon;
    this.once = evonce;
    this.emit = evemit;
    this.removeListener = evremoveListener;
    this.method = 'GET';
    this.parsedUrl = GLOBAL_METHODS.getParsedURL();
  }

  function createOrGetDiv(idm){
    var curEl = document.getElementById(idm);
    var mainBlock = document.getElementById(MAIN_CONT_ID);
    if(!mainBlock) return alert('System not ready. Please refresh the page.');
    if(!curEl){
      curEl = GLOBAL_METHODS.appendHtml(mainBlock,'<div id="'+idm+'"></div>');
    }
    return curEl;
  }

  function Response(opts){
    this.divId = location.pathname.split('/').join('-')
    this.element = createOrGetDiv(this.divId);
  }

  Response.prototype.end = function(str){
    if(!str) return;
    if(typeof str !== 'string'){
      str = str[GLOBAL_VARS.defKey];
    }
    if(typeof str !== 'string'){
      return;
    }
    switch(this.statusCode){
      case 201 :
        GLOBAL_METHODS.appendHtml(this.element, str);
        break;
      default :
        this.element.innerHTML = str;
    }
  };

  function server(handler,config,GLOBAL_API){
    if(!mainHandler) mainHandler = handler;
    window.topath();
  };

  return server;
}),
  HANDLER = (function (GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const IS_ALPHA_NUM = GLOBAL_METHODS.isAlphaNum;
  var S_VARS = GLOBAL_VARS;

  function fromSource(src, after) {
    if (typeof src === 'string') {
      GLOBAL_METHODS.request(src, function(er, obj) {
        if (er) after(er.parsed || er);
        else after(null, obj.parsed);
      });
    } else {
      if (!Array.isArray(src)) {
        src = [src];
      }
      after(null, src);
    }
  }

  function getNewVars() {
    var cache = S_VARS;
    if (typeof cache.params !== 'object' || cache.params === null) cache.params = {};
    if (typeof cache.params.path !== 'object' || cache.params.path === null) cache.params.path = {};
    if (typeof cache.params.query !== 'object' || cache.params.query === null) cache.params.query = {};
    if (typeof cache.params.body !== 'object' || cache.params.body === null) cache.params.body = {};
    if (typeof cache.params.header !== 'object' || cache.params.header === null) cache.params.header = {};
    if (!(Array.isArray(cache.params.file))) cache.params.file = [];
    return cache;
  }

  function register(ob, req, ev, call, modev) {
    if (typeof ev !== 'string') return;
    ev = ev.trim();
    if (!ev.length) return;
    if (typeof modev === 'function') ev = modev(ev);
    if (!(ob['/'])) {
      req.on(ev, call);
      ob['/'] = true;
    }
  }

  var forOneObj = function(rq, rs, cache, methods, ob) {
    GLOBAL_METHODS.assign(cache, ob._vars);
    GLOBAL_METHODS.assign(methods, ob._methods);
    var kys = Object.keys(ob).sort(),
      kl = kys.length;
    var res = {};
    for (var ky, vl, z = 0; z < kl; z++) {
      ky = kys[z];
      vl = ob[ky];
      switch (ky) {
        case '*':
          if (String(GLOBAL_METHODS.replace(vl, cache, methods) === 'false')) {
            rq.notFound = true;
          }
          break;
        case '+':
          var pluskeys = Object.keys(vl),
            pl = pluskeys.length;

          function cl(ky, dt, ifv) {
            if (ifv === undefined || doEval(rq, rs, cache, methods, ifv)) {
              if (ky.charAt(0) === '#') {
                var el = document.getElementById(ky.substring(1));
                return evaluate(rq, rs, cache, methods, dt, function(str) {
                  if (el) {
                    el.innerHTML = str;
                  }
                }, el);
              }
              cache[ky] = evaluate(rq, rs, cache, methods, dt);
            }
          }
          for (var n = 0; n < pl; n++) {
            cl(pluskeys[n], vl[pluskeys[n]], vl[pluskeys[n]].if);
            if (typeof vl[pluskeys[n]].on === 'string' && vl[pluskeys[n]].on.length) {
              evaluate(rq, rs, cache, methods, vl[pluskeys[n]].on).split(',').forEach(function(ev) {
                register(vl[pluskeys[n]], rq, ev, cl.bind(null, pluskeys[n], vl[pluskeys[n]], vl[pluskeys[n]].if));
              });
            }
          }
          break;
        case '=':
          var pass = true;
          var assertions = Array.isArray(vl) ? vl : [],
            al = assertions.length;
          for (var n = 0; n < al; n++) {
            if (typeof vl[n] === 'string' && vl[n]) {
              vl[n] = {
                "eval": vl[n]
              };
            }
            if (typeof vl[n] === 'object' && vl[n]) {
              var ch = function(vl1, vl2, ps) {
                if (!vl2) vl2 = getErrorWithStatusCode(cache, 'inval');
                if (ps) {
                  var er = doEval(rq, rs, cache, methods, vl1);
                  if (!ps || !er) {
                    ps = false;
                    sendNow(cache.defKey, rq, rs, evaluate(rq, rs, cache, methods, vl2), 400);
                  }
                } else {
                  ps = false;
                  sendNow(cache.defKey, rq, rs, evaluate(rq, rs, cache, methods, vl2), 400);
                }
                return ps;
              };
              var bth = function(vls, ps) {
                if (typeof vls.eval === 'string' && vls.eval) {
                  ps = ps && ch(vls.eval, vls.ifFailed, ps);
                }
                if (typeof vls['@'] === 'string' && typeof methods[vls['@']] === 'function') {
                  ps = ps && ch(vls, vls.ifFailed, ps);
                }
                return ps;
              };
              if (typeof vl[n].once === 'string') {
                rq.once(vl[n].once, bth.bind(null, vl[n], pass));
                continue;
              } else {
                if (bth(vl[n], pass) === false) {
                  return 0;
                }
              }
            }
          }
          break;
        default:
          if (typeof vl === 'object' && ky.indexOf('$') === -1) {
            var vr = ky.charAt(0) === ':';
            if (vr) {
              ky = ky.substring(1);
            }
            if (IS_ALPHA_NUM(ky)) {
              if (vr) {
                res['$'] = ky;
                GLOBAL_METHODS.assign(ob[':' + ky], ob[ky]);
                delete ob[ky];
              }
              res[ky] = vl;
            }
          }
          break;
      }
    }
    var kys = Object.keys(res);
    if (kys.length) {
      if (res.hasOwnProperty('$')) {
        return [res, kys, res['$']];
      } else {
        return [res, kys];
      }
    }
    return false;
  };

  function doEval(req, res, cache, methods, obj, bool, nocall) {
    var ret = obj;
    if (typeof ret === 'string' && nocall !== true) {
      var valn = evaluate(req, res, cache, methods, ret);
      if (typeof valn === 'string' && (valn.indexOf('{{') !== -1 || valn.indexOf('}}') !== -1)) {
        return false;
      }
      return Boolean(valn);
    }
    if (GLOBAL_APP_CONFIG.evalenabled !== false) {
      try {
        ret = eval(nocall ? obj : evaluate(req, res, cache, methods, obj));
      } catch (erm) {
        if (bool) return false;
      }
    }
    return bool ? Boolean(ret) : ret;
  }

  function rectify(obj, cache, methods) {
    var ob;
    if (typeof obj === 'object' && obj !== null) {
      ob = GLOBAL_METHODS.assign(undefined, obj);
    } else {
      ob = obj;
    }
    ob = GLOBAL_METHODS.replace(ob, cache, methods);
    return ob;
  }

  function getErrorWithStatusCode(cache, key, statusCode) {
    var snd = GLOBAL_METHODS.lastValue(cache, 'errors', key);
    if (!snd) {
      snd = {};
      var defKey = cache.defKey || '_';
      switch (statusCode || key) {
        case '405':
          snd[defKey] = 'METHOD_NOT_FOUND';
          snd.status = 405;
          break;
        case '404':
          snd[defKey] = 'ROUTE_NOT_FOUND';
          snd.status = 404;
          break;
        case '408':
          snd[defKey] = 'TIMEOUT';
          snd.status = 408;
          break;
        default:
          snd[defKey] = 'INVALID_INPUT';
          snd.status = 400;
      }
    }
    return snd;
  }

  function evaluate(req, res, cache, methods, obj, next) {
    var isAsync = typeof next === 'function',
      isFunc = false,
      pms = [];
    if (obj && typeof obj['@'] === 'string') {
      isFunc = obj['@'];
      if (typeof methods[isFunc] !== 'function') {
        isFunc = GLOBAL_METHODS.replace(obj['@'], cache, methods);
      }
      if (typeof methods[isFunc] === 'function') {
        if (obj['params'] === undefined) {
          obj['params'] = [];
        } else if (!(Array.isArray(obj['params']))) {
          obj['params'] = [obj['params']];
        }
        pms = GLOBAL_METHODS.assign(false, obj['params']);
        pms.unshift(res);
        pms.unshift(req);
      } else {
        isFunc = false;
      }
    } else if (typeof obj === 'object' && obj['#val'] !== undefined) {
      obj = obj['#val'];
    }
    if (isAsync) {
      methods.async = function() {
        return next;
      };
    }
    if (typeof isFunc !== 'string' || !isFunc) {
      isFunc = false;
    }
    if (isAsync) {
      if (isFunc) {
        pms.push({
          '@': 'async'
        });
        GLOBAL_METHODS.replace({
          '@': isFunc,
          'params': pms
        }, cache, methods);
      } else {
        next(rectify(obj, cache, methods));
      }
    } else {
      var ob;
      if (isFunc) {
        ob = {
          '@': isFunc,
          'params': pms
        };
        ob = GLOBAL_METHODS.replace(ob, cache, methods);
      } else {
        ob = rectify(obj, cache, methods);
      }
      return ob;
    }
  }

  function sendNow(defKey, req, res, val, st) {
    if (val === undefined || val === null) {
      val = 'SUCCESS';
    }
    if (typeof val !== 'object') {
      var nw = {};
      if (typeof val === 'number' && val > 99 && val < 600) {
        nw.status = parseInt(val);
        val = (st === undefined) ? 'SUCCESS' : st;
      }
      nw[defKey || '_'] = val;
      val = nw;
    }
    res.statusCode = val.status || st || 200;
    delete val.status;
    var vl = res.exitGate(val);
    if (vl !== undefined) {
      val = vl;
    }
    res.end(val);
  }

  function resp(method, curr, req, res, cache, methods) {
    var next = sendNow.bind(null, cache.defKey, req, res);
    var evaling = function(ml) {
      var af = function(dt, num, noev) {
        var nxt = next;
        if (dt !== undefined) cache.currentData = dt;
        if (!noev && typeof ml.on === 'string') {
          evaluate(req, res, cache, methods, ml.on).split(',').forEach(function(ev) {
            register(ml, req, ev, af.bind(null, dt, num, true));
          });
        }
        if (typeof num === 'number') {
          nxt = next.bind(null, num);
        }
        return evaluate(req, res, cache, methods, ml, nxt);
      };
      if (ml && typeof ml.once === 'string') {
        req.once(ml.once, af);
      } else {
        if (ml.from !== undefined) {
          var directRespond = !(ml['@']);
          fromSource(evaluate(req, res, cache, methods, ml.from), function(er, data) {
            if (directRespond) {
              next(evaluate(req, res, cache, methods, er || data), er ? 400 : 200);
            } else if (er || !data) {
              af(er || 'Record not found.', 400);
            } else {
              af(data);
            }
          });
        } else {
          return af();
        }
      }
    };
    var notFoundCode = '404';
    if (['$', '>', 'GET'].indexOf(method) !== -1) {
      if (typeof cache.timeout === 'number') {
        setTimeout(function() {
          evaling(getErrorWithStatusCode(cache, '408'));
        }, cache.timeout);
      }
      switch (method) {
        case '$':
          if (curr) return evaling(curr);
          else break;
        case 'GET':
          var nw = curr['$'] || curr['$get'];
          if (nw) {
            var isAny = false,
              kn = nw['$>'];
            if (kn) {
              kn = evaluate(req, res, cache, methods, kn);
              isAny = (Object.keys(curr).filter(function(ab) {
                return ab.charAt(0) === ':';
              }).length > 0);
            }
            if (typeof kn === 'string' && (curr[kn] || isAny)) {
              return GLOBAL_METHODS.topath((req.parsedUrl.pathname.length > 1 ? req.parsedUrl.pathname : '') + '/' + kn);
            } else {
              return evaling(nw);
            }
          } else {
            break;
          }
        case '>':
          if (curr['>']) {
            var nw = curr['>'];
            var fe = GLOBAL_METHODS.lastValue(nw, 'forEach', '@');
            if (nw.from !== undefined && typeof fe === 'string' && typeof methods[fe] === 'function') {
              fromSource(evaluate(req, res, cache, methods, nw.from), function(er, data) {
                if (er || !(Array.isArray(data)) || !(data.length)) {
                  next(er || 'No records found.', 400);
                } else {
                  var ln = data.length;

                  function forOne(data, z, as) {
                    methods[fe](cache, methods, req, res, data, z, next.bind(null, as));
                  }
                  var evs = nw.forEach.on;
                  var reg = function() {};
                  if (typeof evs === 'string' && evs) {
                    reg = function(data, z) {
                      var idk = cache.idKey || 'id';
                      evs.split(',').forEach(function(ev) {
                        register(nw.forEach, req, ev, forOne.bind(null, data, z, 202), function(ev) {
                          return ev.replace('{{id}}', data[idk]);
                        });
                      });
                    };
                  }
                  for (var z = 0; z < ln; z++) {
                    reg(data[z], z);
                    forOne(data[z], z, 201);
                  }
                }
              });
              return next('Loading ..');
            }
            return evaling(curr['>']);
          }
          break;
      }
      notFoundCode = '405';
    }
    evaling(getErrorWithStatusCode(cache, notFoundCode));
  }


  function handler(req, res) {
    req['$W_END'] = true;
    res['$W_END'] = true;
    var parsed = req.parsedUrl,
      curr, vl, notFound = false,
      pthn = parsed.pathname || '';
    var cache = getNewVars(),
      methods = {};
    methods = GLOBAL_METHODS;
    if (typeof GLOBAL_APP_CONFIG.mountpath === 'string') {
      if (pthn.indexOf(GLOBAL_APP_CONFIG.mountpath) !== 0) {
        return resp(false, curr, req, res, cache, methods);
      } else {
        pthn = GLOBAL_METHODS.resolveSlash(pthn.substring(GLOBAL_APP_CONFIG.mountpath.length));
      }
    }
    var paths = pthn.substring(1).split('/'),
      pl = paths.length;
    req.once('respondNow', function(vlm, st) {
      sendNow(cache.defKey, req, res, evaluate(req, res, cache, methods, vlm), st);
    });
    curr = forOneObj(req, res, cache, methods, GLOBAL_API.root), vl = GLOBAL_API.root;
    var exitGate = GLOBAL_METHODS.lastValue(GLOBAL_API.root, '_methods', 'exitGate');
    res.exitGate = typeof exitGate === 'function' ? exitGate.bind(res, cache, methods, req, res) : function() {};
    var method = req.method,
      notFound = GLOBAL_METHODS.lastValue.apply(undefined, [GLOBAL_APP_CONFIG].concat(paths.concat(['enable']))) === false;
    if (paths[0] !== '' && !(notFound)) {
      for (var prk, z = 0; z < pl; z++) {
        prk = paths[z];
        if (prk === '') {
          method = '>';
          break;
        }
        if (curr) {
          if (curr[1].indexOf(prk) !== -1) {
            vl = curr[0][prk];
          } else if (curr[2]) {
            cache.params.path[curr[2]] = prk;
            prk = curr[2];
            vl = curr[0][prk];
          } else {
            notFound = true;
            break;
          }
          curr = forOneObj(req, res, cache, methods, vl);
          if (curr === 0) {
            return;
          } else if (req.notFound === true) {
            curr = false;
            notFound = true;
            break;
          }
        } else {
          notFound = true;
          break;
        }
      }
    }
    var nf = true,
      vlk = Object.keys(vl),
      vlkl = vlk.length;
    for (var z = 0; z < vlkl; z++) {
      if (vlk[z].charAt(0) === '$' || vlk[z].charAt(0) === '>') {
        nf = false;
        break;
      }
    }
    req.pathFound = notFound;
    req.methodFound = nf;
    resp(((notFound || nf) ? false : method), vl, req, res, cache, methods);
  };

  return handler;
}),
  ENGINE = SERVER(GLOBAL_APP_CONFIG, GLOBAL_METHODS);

function func(CONFIG_PATH, JSON_PATH, ROOT_DIR_PATH, GLOBAL_VARS, GLOBAL_API) {
  const ASSIGN = GLOBAL_METHODS.assign,
    REPL = GLOBAL_METHODS.replace,
    lastValue = GLOBAL_METHODS.lastValue,
    N_REG = GLOBAL_METHODS.isAlphaNum;
  //END_NO_OUT_FILE
  var MAINS = {},
    fromConfigReq = {},
    fromJsonReq = {},
    httsConfig = false;
  //END_NOT_IN_FILE
  //_ONLY_SERVER_END
  if ((typeof GLOBAL_VARS === 'object' && GLOBAL_VARS !== null && !(Array.isArray(GLOBAL_VARS))) &&
    (typeof GLOBAL_API === 'object' && GLOBAL_API !== null && !(Array.isArray(GLOBAL_API)))) {} else {
    //END_NOT_IN_FILE
  }


  function start(hndlr, hc) {
    ENGINE((hndlr || HANDLER)(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API), (hc || httsConfig), GLOBAL_API);
  }

  var onLoad = GLOBAL_METHODS.lastValue(GLOBAL_API, 'root', '_methods', 'onLoad');
  if (typeof onLoad === 'function') {
    onLoad();
  }
  start.api = GLOBAL_API;
  start.config = GLOBAL_APP_CONFIG;
  return start;
}
//END_NO_OUT_FILE
var GLOBAL_API = {"root":{"$":{"@":"renderHomePage"},"+":{"#id-fixedtop-block":{"@":"renderFixedTop"},"#id-fixedmenu-block":{"@":"renderMainNav"}}}};GLOBAL_METHODS.assign(GLOBAL_APP_CONFIG,{});
GLOBAL_METHODS.makeToLast(GLOBAL_API.root, '_methods','exitGate');
GLOBAL_API.root._methods.exitGate=(function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){
  function func(vars,methods,req,res){
    if(!res.materialDone){;
      var _end = res.end;
      res.end = (function(){
        var rs = _end.apply(this,arguments);
        methods.materialUpgrade(this.element);
      }).bind(res);
      res.materialDone = true;
    }
  }

  return func;
})(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API);
GLOBAL_METHODS.makeToLast(GLOBAL_API.root, '_methods','materialUpgrade');
GLOBAL_API.root._methods.materialUpgrade=(function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

  function traverse (node, callback) {
    if (callback(node)) {
      for (var i=0;i < node.childNodes.length; i++) {
        traverse(node.childNodes[i],callback);
      }
    }
  }

  function func(elem){
    if(window.componentHandler){
      traverse(elem, function(element){
        if(typeof element === 'object' && element instanceof Element){
          window.componentHandler.upgradeElement(element);
        }
        return true;
      });
    }
  }

  return func;

})(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API);
GLOBAL_METHODS.makeToLast(GLOBAL_API.root, '_methods','notification');
GLOBAL_API.root._methods.notification=(function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS){

var snackbarContainer = document.querySelector('#'+GLOBAL_VARS.app.key+'-snackbar-blk');

function func(message){
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: message || 'Something was not right.'
  });
}

return func;

})(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API);
GLOBAL_METHODS.makeToLast(GLOBAL_API.root, '_methods','renderFixedTop');
GLOBAL_API.root._methods.renderFixedTop=(function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){
var once = true, navHTML = ('<span id="current-cs-title" class="mdl-layout-title">A Client Server app</span><div class="mdl-layout-spacer"></div><div class="cs-navigation-container">  <nav class="cs-navigation mdl-navigation">    <a class="mdl-navigation__link mdl-typography--text-uppercase pointer" onclick="r2(\'/\')">      Home    </a>  </nav></div><div style="display:none;" class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">  <label class="mdl-button mdl-js-button mdl-button--icon" for="top-fixed-search">    <i class="material-icons">search</i>  </label>  <div class="mdl-textfield__expandable-holder">    <input class="mdl-textfield__input" type="text" id="top-fixed-search">    <label class="mdl-textfield__label" for="search">search</label>  </div></div>');

function func(vars,methods,req,res,next){
  if(once){
    once = false;
    next(navHTML);
    methods.searchRegister(vars,methods,req,res);
  }
}

return func;

})(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API);
GLOBAL_METHODS.makeToLast(GLOBAL_API.root, '_methods','renderHomePage');
GLOBAL_API.root._methods.renderHomePage=(function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){

var HTML = ('<center>  <h4>search below</h4>  <div class="mdl-textfield mdl-js-textfield">    <input class="mdl-textfield__input" type="text" id="home-cs-search">    <label class="mdl-textfield__label">enter instance</label>  </div></center>');

function func(vars,methods,req,res,next){
  next(HTML);
}

return func;

})(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API);
GLOBAL_METHODS.makeToLast(GLOBAL_API.root, '_methods','renderMainNav');
GLOBAL_API.root._methods.renderMainNav=(function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS){

var once = true, HTML = ('<span class="mdl-layout-title">A Client Server app</span><nav id="id-nav-drawer" class="cs-navigation mdl-navigation"></nav>');

function func(vars,methods,req,res,next){
  if(once){
    once = false;
    next(HTML);
  }
}

return func;

})(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API);
GLOBAL_METHODS.makeToLast(GLOBAL_API.root, '_methods','searchRegister');
GLOBAL_API.root._methods.searchRegister=(function ( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){

function func(vars,methods,req,res){

}

return func;

})(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API);func(undefined,undefined,undefined,GLOBAL_VARS,GLOBAL_API)();