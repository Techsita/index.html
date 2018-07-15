onmessage = function mess(e) {
  try { 
    postMessage(String(e.data) + typeof eval); 
  } catch(err) {
    postMessage(err.message);
  }
}
