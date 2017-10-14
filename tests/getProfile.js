var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');
const passport = require("passport");



const userCredentials = {
  email: 'cats@cats.com', 
  password: 'cats'
}

//login test user
var authenticatedUser = request.agent(app);

before(function(done){
  authenticatedUser
    .get('/signin')
    .send(userCredentials)
    .end(function(err, response){
      expect(response.statusCode).to.equal(200);
      expect('Location', '/dashboard');
      if (err) throw err;
      done();
    });
});

describe('GET /dashboard', function(done){
  it('should return a 200 response if the user is logged in', function(done){
    authenticatedUser.get('/dashboard')
    .expect(200, done);
  });



//if the user is not logged in we should get a 302 response code and be directed to the /login page
  it('should return a 302 response and redirect to /', function(done){
    request(app).get('/dashboard')
    .expect('Location', '/')
    .expect(302, done);
  });
});