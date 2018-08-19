// 'use strict'; 
let isStrict = ( function () { return !!!this } ) (); 
let eports = new Set();

function portal(oport) {
  if (oport && oport.onmessage) {
    eports.add(oport);
  }
}

self.onmessage = function mess(e) {
  portal(e.ports[0]);
  try { 
    self.postMessage(String(e.data) + " // " + String(eval(e.data)) ); 
  } catch(err) {
    self.postMessage(String(e.data) + " // " + err.message);
  }
}
