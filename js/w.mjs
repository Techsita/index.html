let url = import.meta.url;

export let stuff = {url: url, foo: {bar: 666}};

// self = self || {closed: true};

self.onmessage = function mess(e) {
  try { 
    self.postMessage(String(e.data) + " // " + String(eval(e.data)) ); 
  } catch(err) {
    self.postMessage(String(e.data) + " // " + err.message);
  }
}
// self.importScripts("data:text/javascript;/self.js?#,function%20evil(doer){try{return(eval(doer));}catch(e){return(e);}}");

export default function evil(doer){try{return(eval(doer));}catch(e){return(e);}}
