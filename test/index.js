var chai = require("chai"),
	chaiAsPromised = require("chai-as-promised"),
	expect = chai.expect,
	rewire = require("rewire"),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	express = require('express'),
  Promise = require("bluebird"),
  supertest = require("supertest"),
  sessionFactory = require(".."),
	app = express(),
	session;
	
app.use(cookieParser());
app.use(session({ 
	resave:true,
	saveUninitialized: true,
	secret: 'keyboard cat' 
}));
app.get('/magic-cookie', function(req, res){ 
	res.cookie('magic', 'cookie');
	res.end("helo"); 
});
app.use(function(req, res){ res.end("helo"); });

chai.use(chaiAsPromised);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

beforeEach(function(){
	session = sessionFactory.create({app: app});
});

describe("Test instances", function () {
	describe("#toPromise", function () {
		it("should return a bluebird promise by default", function () {
			expect(session.get("/home").toPromise()).to.be.an.instanceOf(Promise);
		});

		it("should still return a bluebird promise by default", function () {
			expect(session.get("/home").toPromise()).to.be.an.instanceOf(Promise);
		});
	});

	it("should fulfill if all assertions pass", function () {
		return expect(session.get("/home").expect(200)).to.eventually.be.fulfilled;
	});

	it("should fulfill with the response", function () {
		return session.get("/home").then(function (res) {
			expect(res.text).to.equal("helo");
		});
	});

	it("should reject if an assertion fails", function () {
		return expect(session.get("/home").expect(500)).to.eventually.be.rejected;
	});
	it("should save cookies", function(){
		return session.get('/magic-cookie').then(function(){
			return session.get('/').then(function(){
				expect(session.cookies.filter(function(x){ return x.magic === 'cookie'; })).to.have.length(1);
			});
		});
	});
});