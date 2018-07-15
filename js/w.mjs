onmessage = function mess(e) {
  try { 
    postMessage(String(e.data)); 
  } catch(err) {
    postMessage(err.message);
  }
}
