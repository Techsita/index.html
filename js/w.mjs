self.onmessage = function mess(e) {
  try { 
    postMessage(String(e.data) + (String(e.data) in self)); 
  } catch(err) {
    postMessage(err.message);
  }
}
