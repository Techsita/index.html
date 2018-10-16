// sw dev wip caching ...

// self.importScripts("js/we.mjs"); // deval message et al

self.addEventListener('install', function(event) {
	self.skipWaiting();
});

let fetchHandler = function fh1(event) {
	const cacheName = 'cached';
	let requestUrl = new URL(event.request.url);
	const https = 'https:' === requestUrl.protocol;

	if (!requestUrl.hash.startsWith('#sw:')) { // sw: hash is meta, so bypass all normal function
		// so, our use case is allow absent localhost:80 server http get/head pref/store cache, https cache only

		if (requestUrl.pathname.startsWith('/data:')) {
			let url = new URL(requestUrl.pathname.slice(1));
			url.search = requestUrl.search;
			url.hash = requestUrl.hash;
			event.respondWith(Response.redirect(url.href));
			return;
		}

	    if (!requestUrl.protocol.startsWith('http')) {
	        return; // exclusively http or https use-case 
	    }
	    
    	if (requestUrl.port && ('80' != requestUrl.port)) { // typically "" for default port
    		return; // if not normal port, not our use-case; po bypass ? https: explicit :443
    	}
	        
	    if (!requestUrl.hostname.endsWith('localhost')) {
	    	return; // my use-case for localhost (eg working copy webDAV) caching
	    	// technically could rename an mdns device, eg, mylocalhost and get caching (or weird .tld)
	    	// po investigate cachename.localhost as a feature
	    }

		if (requestUrl.pathname.endsWith('/')) {
			return; // use-case working copy webDAV so avoid dir vs index.html foo
			// this also makes local node.js with safari sw less con-fuse-ing
		}

    	event.waitUntil( event.respondWith(
    		(
    		async function hitcacher(cacheName, event) {
    			const cache = await caches.open(cacheName);
    			let response;
    			let request = event.request.clone();
    				
				if (https) {
					requestUrl.protocol = 'http:';
					request = new Request(requestUrl.href,
						{	method: request.method,
							headers: request.headers,
							mode: 'same-origin',
							credentials: 'same-origin',
							cache: 'force-cache'
						} 
					)
				}
    				
				response = await cache.match(request.clone(), {ignoreSearch: true}); 
				// NB ignore search is our use-case here
				
				if (Object.is(undefined, response)) {
    				response = await fetch(event.request); // pristine, po privileged
    				if (!Object.is(undefined, response)) {
    					event.waitUntil( cache.put(request.clone(), response.clone()) );
    				}
    			} else {
					if (requestUrl.hash.startsWith(cacheName + ':delete')) {
						event.waitUntil( cache.delete(request.clone(), {ignoreSearch: true}) ); // ~match delete
						return; // rudimentary cache entry delete + bypass
					}
				}
        			
    			return response;
    		}
    		)(cacheName, event) /* invoke async; easy cut-paste later to SA fn (I dislike throwawy anon MO)
    	)); 
    	
    	return; // handled request, so don't trip over self accidentally, eh?
    }

	var responseBody = {
	  version: "1.1.14",
	  time: Date(),
	  request: Reflect.ownKeys(Reflect.getPrototypeOf(event.request)).map(k=>String(k)+" : " + 
		JSON.stringify(event.request[k])).join("\n"),
	  headers: JSON.stringify([...event.request.headers.entries()]),
	  sw: self.location.href
	};

	var responseInit = {
	  // status/statusText defaults to 200/OK
	  status: 200,
	  statusText: 'OK',
	  headers: {
	    'Content-Type': 'application/json',
	    'X-Mock-Response': 'yes',
	    'Refresh': `15; url=${ ( ()=>{ let url = new URL(requestUrl); url.hash=""; return url;} )() }`
	  }
	};

	var mockResponse;
	
	if (requestUrl.hash.startsWith('#sw:blank')) {
		// mockResponse = Response.redirect(requestUrl.pathname + "#top");
		
		mockResponse = Response.redirect(encodeURI(`data:text/html;/prewrap.html?,
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<title>title</title>
	
	<style id="styleid">
		#top:not(:target) { white-space: pre-wrap; }
	</style>
	
	<script id="scriptid">
	</script>
</head>
<body id="top" contenteditable="true"></body>
</html>
`
));
	} else {
	  mockResponse = new Response(JSON.stringify(responseBody), responseInit);
	}
	event.respondWith(mockResponse); return; 
	
}

self.addEventListener('fetch', fetchHandler); // should this add in activate, not register?
