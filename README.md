# supertest-session-as-promised

SuperTest as Promised supercharges [SuperTest] with a `then` method.

Instead of layering callbacks on callbacks in your tests:

```js
request(app)
  .get("/user")
  .expect(200, function (err, res) {
    if (err) return done(err);

    var userId = res.body.id;
    request(app)
      .post("/kittens")
      .send({ userId: userId, ... })
      .expect(201, function (err, res) {
        if (err) return done(err);

        // ...
      });
  });
```

chain your requests like you were promised:

```js
return session
  .get("/user")
  .expect(200)
  .then(function (res) {
    return request(app)
      .post("/kittens")
      .send({ userId: res})
      .expect(201);
  })
  .then(function (res) {
    // ...
  });
```

## Usage (mocha example)
```js
var sessionFactory = require("supertest-session-as-promised"),
	app = /* get an express app or something */,
	session;
	
beforeEach(function(){
	session = sessionFactory.create({app:app});
});
```

If you use a promise-friendly test runner, you can just
return your `request` chain from the test case rather than messing with a
callback:

```js
describe("GET /kittens", function () {
  it("should work", function () {
    return session.get("/kittens").expect(200);
  });
});
```
## Cookies
If you don't care about sessions, use [supertest-as-promised](https://github.com/WhoopInc/supertest-as-promised) module, which this is based off of.

Cookies are available through

```js
var session = sessionFactory.create({app:app});
session.cookies
```

### Promisey goodness

To start, only the `then` method is exposed. But once you've called `.then`
once, you've got a proper [Bluebird] promise that supports the whole gamut of
promisey goodness:

```js
session
  .get("/kittens")
  .expect(201)
  .then(function (res) { /* ... */ })
  // I'm a real promise now!
  .catch(function (err) { /* ... */ })
```

See the [Bluebird API][bluebird-api] for everything that's available.

You may find it cleaner to cast directly to a promise using the `toPromise`
method:

```js
session
  .get("/kittens")
  .expect(201)
  .toPromise()
  // I'm a real promise now!
  .delay(function (res) { /* ... */ })
  .then(function (res) { /* ... */ })
```

## Installation

### Node

```bash
$ npm install supertest-session-as-promised
```

* [Bluebird][bluebird] has been upgraded to version 2.9.24.

[bluebird]: https://github.com/petkaantonov/bluebird
[bluebird-api]: https://github.com/petkaantonov/bluebird/blob/master/API.md#promiseisdynamic-value---boolean
[changelog]: CHANGELOG.md
[peer-dependency]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
[semver]: http://semver.org
[SuperTest]: https://github.com/visionmedia/supertest
[when.js]: https://github.com/cujojs/when
