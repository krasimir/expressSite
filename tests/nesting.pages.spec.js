var httpMocks = require("node-mocks-http");
var mockupResponse = require("./helpers/mockupResponse");

var fs = require("fs");

var Page = require("../Page");
var app = require("../index");

var PageA = Page.extend({
  extendDefaults: {
    layout: __dirname + "/testData/nestedPages/pageA.jade",
    content: __dirname + "/testData/nestedPages/pageAContent.jade"
  }
});
var pageA;

var PageB = Page.extend({
  extendDefaults: {
    content: __dirname + "/testData/nestedPages/pageB.jade"
  }
});
var pageB;

var PageC = Page.extend({
  extendDefaults: {
    content: __dirname + "/testData/nestedPages/pageC.jade",
    childs: {
      subPageA: new PageA(),
      subPageB: new PageB()
    }
  }
});
var pageC;

var PageD = Page.extend({
  extendDefaults: {
    content: __dirname + "/testData/nestedPages/pageD.jade",
    childs: {
      subPageC: new PageC()
    }
  }
});
var pageD;

describe('App and Page Module critical', function(){

  it("app and page should be defined", function(done){
    expect(app).toBeDefined();
    expect(app.addPage).toBeDefined();
    expect(Page).toBeDefined();
    done();
  });

  it("should be able to create instance of PageA", function(done) {
    pageA = new PageA();
    expect(pageA).toBeDefined();
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        params: { id: 42 }
    });
    var response = mockupResponse(function(){
      var resultHTML = response._getData();
      expect(resultHTML == "<div><h1>Page A</h1></div>").toBe(true);
      done();
    });
    pageA.render(request, response);
  });

  it("should be able to create instance of PageB", function(done) {
    pageB = new PageB();
    expect(pageB).toBeDefined();
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        params: { id: 42 }
    });
    var response = mockupResponse(function(){
      var resultHTML = response._getData();
      expect(resultHTML == "<div><h2>Page B</h2></div>").toBe(true);
      done();
    });
    pageB.render(request, response);
  });

  it("should be able to create instance of PageC, which has nested pages PageA and PageB", function(done) {
    pageC = new PageC();
    expect(pageC).toBeDefined();
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        params: { id: 42 }
    });
    var response = mockupResponse(function(){
      var resultHTML = response._getData();
      expect(resultHTML == "<div><div><h1>Page A</h1></div><div><h2>Page B</h2></div></div>").toBe(true);
      done();
    });
    pageC.render(request, response);
  });

  it("should be able to create instance of PageD, which has nested page PageC", function(done) {
    paged = new PageD();
    expect(paged).toBeDefined();
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        params: { id: 42 }
    });
    var response = mockupResponse(function(){
      var resultHTML = response._getData();
      expect(resultHTML == "<section><div><div><h1>Page A</h1></div><div><h2>Page B</h2></div></div></section>").toBe(true);
      done();
    });
    paged.render(request, response);
  });

});