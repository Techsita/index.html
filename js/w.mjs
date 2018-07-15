onmessage = function(e) {
  postMessage(String(e.data)+typeof self['eval']);
}
