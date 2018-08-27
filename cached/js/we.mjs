// 'use strict'; // for mjs future... no-go now for sw; also problematic bimodal html/js
let isStrict = ( function () { return Object.is(undefined, this) } ) (); 

self.log = []; // dev mode, c/rude force log utility
console.log = self.log.push.bind(self.log);

let eports = new Set(); // hold messchan refs, if needed
let portEval = portEval1; // dev eval ala mode

self.onmessage = portEval; // dev eval opt-in for us, whether: win, worker, service worker

function portal(oport) {
	if (oport && oport instanceof MessagePort) {
		oport.onmessage = portEval;
		eports.add(oport);
	}
}

function portEval1 (e) { // NB ignoring all security...
	if (e.ports.length) { // quickie version of tranferable(s) processing, as one new eval mc
		portal(e.ports[0]);
	} 

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

	try { 
		let replyto = null;
		let pmflag = null;

		if (e.source && e.source instanceof Object && e.source.postMessage && e.source.postMessage instanceof Function) {
			replyto = e.source; // fyi, we're not a mc... source on win, sw (~fake as ClientWindow)
		} else {
			if (this && this instanceof Object && this.postMessage && this.postMessage instanceof Function) { // this messchan or fallback
				replyto = this; // worker self this, or mc this (avoided this Mo for win or sw due to misc. awkward issues)
			} else { // to-who lookup foo, could complain, if useful to do so, eh?
				replyto = null;
			}
		}
		if (replyto) pmflag = (2 === replyto.postMessage.length); // diff pm versions, extra req parameter foo

		if ( replyto && pmflag ) { // replyto is a win, so po no reply at all (no recurse risk)...
			if (e.ports.length) { // quickie version of if got tranferable port, then mc initial eval replyto
				e.ports[0].postMessage(ev); // to (other?) window sender, done.
			} else { // currently replyto being pm win style implies we're a win also; tacky?...
				if ((replyto === self) || (self.top === self) ) { // my quirky UX convenience...
					self.status = (e.data instanceof Object)? JSON.stringify(e.data) : String(e.data); 
					self.status += " // ";
					self.status += (ev instanceof Object)? JSON.stringify(ev) : String(ev); 
				} else {
		// other win sans mc, no reply, as it's nicer to avoid DOM SOP or recurse foobar
				}
			}
		} else { // not pmflag, so "normal" pm, no recurse risk unless was stupid in chaining mc
			if (replyto) {
				replyto.postMessage(ev);
			} else { // foo so just log result...
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
