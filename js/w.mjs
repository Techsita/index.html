self.onmessage = function mess(e) {
  try { 
    postMessage(String(e.data) + " // " + String(eval(e.data)) ); 
  } catch(err) {
    postMessage(String(e.data) + " // " + err.message);
  }
}
