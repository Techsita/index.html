self.onmessage = function mess(e) {
  try { 
    postMessage(String(e.data) + mess.toString()); 
  } catch(err) {
    postMessage(err.message);
  }
}
