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
  let ev = {};
  if (e.ports.length) { // quickie version of tranferables processing vs eval
    portal(e.ports[0]); // nop if, eg, []
    ev = e.data; // no eval, idemppotent (also, eg, result output)
  } else { // eval
    try { // dev eval, caveat emptor
      ev = eval(e.data); 
    } catch(err) {
      ev = { 
        data: e.data ,
        name: err.name ,
        message: err.message
      }
    }
  }
  
  try { 
    let replyto = null;
    let pmflag = null;
    
    if (e.source && e.source instanceof Object && e.source.postMessage && e.source.postMessage instanceof Function) { // if messchan source === null
        replyto = e.source;
    } else {
      if (this && this instanceof Object && this.postMessage && this.postMessage instanceof Function) { // this messchan or fallback
        replyto = this;
      } else { // to-who lookup foo
        replyto = null;
      }
    }
    if (replyto) pmflag = (2 === replyto.postMessage.length); // diff pm versions, extra req parameter foo
    
    if ( replyto && pmflag ) {
      if (replyto === self) { // pmflag laziness, ie implies assert we are Window, not worker or channel
        self.status = (e.data instanceof Object)? JSON.stringify(e.data) : String(e.data); 
        self.status += " // ";
        self.status += (ev instanceof Object)? JSON.stringify(ev) : String(ev); 
      } else {
        replyto.postMessage(ev, '*', [new arrayBuffer(0)]); // reply to window sender, ignoring security origin, no eval requested
      }
    } else {
      if (replyto) {
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
