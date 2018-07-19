self.onmessage = function mess(e) {
  try { 
    postMessage(String(e.data) + " // " + String(eval(e.data)) ); 
  } catch(err) {
    postMessage(String(e.data) + " // " + err.message);
  }
}
self.importScripts("data:text/javascript;/self.js?#,function%20evil(doer){try{return(eval(doer));}catch(e){return(e);}");
