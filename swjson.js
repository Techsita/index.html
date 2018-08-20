// 'use strict'; 

// WIP ...

self.log = [];
console.log = self.log.push.bind(self.log);

// js/me.mjs ...

// 'use strict'; 
let isStrict = ( function () { return Object.is(undefined, this) } ) (); 

let eports = new Set();
let portEval = portEval1;

self.onmessage = portEval;

function portal(oport) {
  if (oport && oport instanceof MessagePort) {
    oport.onmessage = portEval;
    eports.add(oport);
  }
}

function portEval0 (e) {
  portal(e.ports[0]);
  
  try { 
    this.postMessage(String(e.data) + " // " + String(eval(e.data)) ); 
  } catch(err) {
    this.postMessage(String(e.data) + " // " + err.message);
  }
}

function portEval1 (e) {
  portal(e.ports[0]);
  
  let ev = {};
  try { 
    ev = eval(e.data); 
  } catch(err) {
    ev = { 
      data: e.data ,
      name: err.name ,
      message: err.message
    }
  }
  
  try {
    if (this.postMessage) {
      this.postMessage(ev);
    } else { // hat tip, po sw client source
      if (e.source && e.source.postMessage) {
        e.source.postMessage(ev);
      } else {
        console.log(ev);
      }
    }
  } catch (err) {
    ev = { 
      data: e.data ,
      name: err.name ,
      message: err.message
    }
    console.log(ev);
  }
}

// original swjson.js ...

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  
    var requestUrl = new URL(event.request.url);

    if (requestUrl.protocol.startsWith('https:')) {
        // http no cert localhost so sw faux for https only if once proxied, eh?
        
        if (requestUrl.pathname.includes('/cached/')) {
          event.respondWith(
            caches.open('cached').then(function(cache) {
              return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                  cache.put(event.request, response.clone());
                  return response;
                });
              });
            })
          );
        }
        if (!requestUrl.hash.startsWith('#')) {
            return;
        }
    }

    if (requestUrl.hash.startsWith('#top')) {
        return;
    }

    var responseBody = {
      version: "1.0.5",
      request: Reflect.ownKeys(Reflect.getPrototypeOf(event.request)).map(k=>String(k)+" : " + JSON.stringify(event.request[k])).join("\n"),
      headers: JSON.stringify([...event.request.headers.entries()]),
      sw: self.location.href
    };

    var responseInit = {
      // status/statusText defaults to 200/OK
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'X-Mock-Response': 'yes'
      }
    };
    
    var mockResponse;

    if (requestUrl.hash.startsWith('#edit')) {
      // mockResponse = Response.redirect(requestUrl.pathname + "#top");
      mockResponse = Response.redirect(`data:text/html,<!DOCTYPE%20html><html><head><meta%20charset="utf-8"><meta%20name="apple-mobile-web-app-capable"%20content="yes"><meta%20name="viewport"%20content="width=device-width,%20initial-scale=1"><title>title</title><style%20id="styleid">%23edit:target{white-space:pre-wrap;}</style><script%20id="scriptid"></script></head><body%20id="edit"%20contenteditable="true"></body></html>`);
    } else {
      mockResponse = new Response(JSON.stringify(responseBody), responseInit);
    }
    event.respondWith(mockResponse);
  

}); // added fetch event listener... what should be in activate, not register?
