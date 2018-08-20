// 'use strict'; // for mjs future... no-go now for sw; also problematic bimodal html/js
let isStrict = ( function () { return Object.is(undefined, this) } ) (); 

self.log = []; // dev mode, c/rude force log utility
console.log = self.log.push.bind(self.log);

let eports = new Set(); // hold messchan refs, if needed
let portEval = portEval1; // dev eval ala mode

self.onmessage = portEval; // opt-in for win, worker, service worker

function portal(oport) {
  if (oport && oport instanceof MessagePort) {
    oport.onmessage = portEval;
    eports.add(oport);
  }
}

function portEval1 (e) { // NB ignoring all security...
  portal(e.ports[0]); // quickie version of tranferables processing
  
  let ev = {};
  try { // dev eval, caveat emptor
    ev = eval(e.data); 
  } catch(err) {
    ev = { 
      data: e.data ,
      name: err.name ,
      message: err.message
    }
  }
  
  try { // reply to sender, ignoring security origin
    if (e.source && e.source.postMessage) { // sw or win, never messchan
        e.source.postMessage(ev);
    } else {
      if (this.postMessage) { // this messchan or fallback
        this.postMessage(ev);
      } else { // to-who lookup foo so just log result
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
