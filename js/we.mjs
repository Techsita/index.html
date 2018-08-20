// 'use strict'; 
let isStrict = ( function () { return Object.is(undefined, this) } ) (); 

self.log = [];
console.log = self.log.push.bind(self.log);

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
