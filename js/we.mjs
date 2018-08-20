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
    let replyto = null;
    if (e.source && e.source instanceof Object) { // if messchan source === null
        replyto = e.source;
    } else {
      if (this && this instanceof Object) { // this messchan or fallback
        replyto = this;
      } else { // to-who lookup foo
        replyto = null;
      }
    }
    if ( (replyto === self) && ("Window" === Object.getPrototypeOf(self).constructor.name) ) {
      self.status = (e.data instanceof Object)? JSON.stringify(e.data) : String(e.data); 
      self.status += " // ";
      self.status += (ev instanceof Object)? JSON.stringify(ev) : String(ev);  
    } else {
      if (replyto && replyto.postMessage && replyto.postMessage instanceof Function) {
        replyto.postMessage(ev);
      } else {
        console.log(ev); // foo so just log result
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
