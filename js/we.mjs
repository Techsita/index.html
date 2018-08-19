// 'use strict'; 
let isStrict = ( function () { return !!!this } ) (); 

let eports = new Set();
let portEval = portEval0;

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
