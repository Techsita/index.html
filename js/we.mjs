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
    this.postMessage(ev);
  } catch (err) {
    ev = { 
      data: e.data ,
      name: err.name ,
      message: err.message
    }
    this.postMessage(ev);
  }
}
