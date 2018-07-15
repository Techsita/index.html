self.onmessage = function mess(e) {
  try { 
    postMessage(String(e.data) + self.onmessage.toString()); 
  } catch(err) {
    postMessage(err.message);
  }
}
