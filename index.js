var methods = require("methods"),
  Promise = require("bluebird"),
  session = require("supertest-session");

// Support SuperTest's historical `del` alias for `delete`
methods = methods.concat("del");

module.exports = (function(){
  function toPromise() {
    var self = this;
    return new Promise(function(resolve, reject){
      self.end(function(err, res){
        if(err) reject(err);
        else resolve(res);
      });
    });
  }

  function then(onFulfilled, onRejected){
    return this.toPromise().then(onFulfilled, onRejected);
  }

  // Creates a new object that wraps `factory`, where each HTTP method
  // (`get`, `post`, etc.) is overriden to inject a `then` method into
  // the returned `Test` instance.
  function wrap(factory) {
    var out = {};

    methods.forEach(function(method){
      out[method] = function(){
        var test = factory[method].apply(factory, arguments);
        test.toPromise = toPromise;
        test.then = then;
        return test;
      };
    });

		Object.defineProperty(out, 'cookies', {
			get: function(){ return factory.cookies; },
			set: function(val){ factory.cookies = val; }
		});
		
    return out;
  }

  return {
		create: function(app, options){
			return wrap(session(app, options));
		}
	};
}());
