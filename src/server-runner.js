var _ = require('lodash');

module.exports = http;

function http(config){

  var defaultConfig = {
          autoRespond: true,
          respondImmediately: true
      };

  var server = sinon.fakeServer.create(_.defaults(config, defaultConfig));

  var that = {
    post: method('POST'),
    get: method('GET'),
    delete: method('DELETE'),
    put: method('PUT'),
    respond: function(){
      server.respond();
    },
    stop: function(){
      server.restore();
    }
  };

  return that;

  function method(type){
    return function(url, handler){
      server.respondWith(type, url, function(req){
        handler(wrap(req));
      });
      return that;
    };
  }
}

function wrap(req){
  return {
    body: function(){
      return JSON.parse(req.requestBody);
    },
    sendJson: function(json){
      req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(json));
    }
  };
}
