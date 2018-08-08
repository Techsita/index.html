let isStrict = ( function () { return !!!this } ) (); 

self.onmessage = function mess(e) {
    try { 
        self.postMessage(String(e.data) + " // " + String(eval(e.data)) ); 
    } catch(err) {
        self.postMessage(String(e.data) + " // " + err.message);
    }
}

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  
    var requestUrl = new URL(event.request.url);

    if (requestUrl.protocol.startsWith('https:')) {
        // http no cert localhost so sw faux for https if once proxied, eh?
        if (!requestUrl.hash.startsWith('#')) {
            return;
        }
    }

    if (requestUrl.hash.startsWith('#top')) {
        return;
    }

    var responseBody = {
      version: "1.0.2",
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
  

}); // added fetch event listener... should be in activate, not register?
