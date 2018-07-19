// 'use strict'; 
var isStrict = ( function () { return !!!this } ) (); 

self.onmessage = function mess(e) {
  try { 
    self.postMessage(String(e.data) + " // " + String(eval(e.data)) ); 
  } catch(err) {
    self.postMessage(String(e.data) + " // " + err.message);
  }
}
