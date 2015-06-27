var English = require('yadda').localisation.English;
var library = English.library();
import chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

import food = require('../../../examples/foods/resources/food');
var Food = food.model;
import list = require('../../../examples/foods/resources/list');
var List = list.model;
import dish = require('../../../examples/foods/resources/dish');
var Dish = dish.model;
import supertest = require('supertest');

function createIdBasedOnName(name: string) {
  var id = convertToHex(name);
  var i = 0;
  while (id.length < 24) {
    id += i++;
    if (i > 9) {
      i = 0;
    }
  }
  return id;
}

function convertToHex(str) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}

library
  .given('<Food><Name><Weight>', (done) => {
    this.request = supertest('http://localhost:3000');
    done();
  })
  .given('<Food><(.*)><(.*)>', (name: string, weight: string, done) => {
    Food.create({
      _id: createIdBasedOnName(name),
      name: name,
      weight: parseInt(weight, 10)
    }, (err, food) => {
      done();
    });
  })
  .given('<List><Name><Fruits>', (done) => {
    this.request = supertest('http://localhost:3000');
    done();
  })
  .given('<List><(.*)><(.*)>', (listName: string, fruitsString: string, done) => {
    var fruits = fruitsString.split(',');
    var list = {
      name: listName,
      foods: []
    };
    fruits.forEach((fruit: string) => {
      list.foods.push(createIdBasedOnName(fruit));
    });
    List.create(list, (err, list) => {
      supertest('http://localhost:3000')
        .get('/api/foods')
        .end((req, res) => {
          done();
        });
    });
  })
  .given('<Dish><Name><Food>', (done) => done())
  .given('<Dish><(.*)><(.*)>', (name: string, food: string, done) => {
    Dish.create({
      _id: createIdBasedOnName(name),
      name: name,
      mainIngredient: createIdBasedOnName(food)
    }).then(() => done());
  })
  .given('the food app is started', (done) => done())
  .when('I request all food', (done) => {
    this.request = this.request.get('/api/foods');
    done();
  })
  .when('I request all lists', (done) => {
    this.request = this.request.get('/api/lists');
    done();
  })
  .when('I query for "(.*)" with "(.*)"', (attr: string, query: string, done) => {
    this.request = this.request.get(`/api/foods?${attr}=${query}`);
    done();
  })
  .when('I query attr "(.*)" with "(.*)" and populate "(.*)" of "(.*)"', (attr: string, query: string, populate: string, food: string, done) => {
    this.request = this.request.get(`/api/dishes?${attr}=${query}&populate=${populate}`);
    done();
  })
  .then('I expect to see food "(.*)" on position (.*)',
    (food: string, position: string, done) => {
      this.request
        .end((req: supertest.SuperTest, res: supertest.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body[parseInt(position, 10)].name).to.equal(food);
          done();
        });
    })
  .then('I expect to see list "(.*)" with "(.*)"',
    (listName: string, foodString: string, done) => {
      this.request
        .end((req: supertest.SuperTest, res: supertest.Response) => {
          expect(res.status).to.equal(200);
          var foods = foodString.split(',');
          var list;
          res.body.forEach((currentList) => {
            if (currentList.name === listName) {
              list = currentList;
            }
          });
          foods.forEach((fruit: string) => {
            var foundFruit = null;
            list.foods.forEach((food) => {
              if (food.name === fruit) {
                foundFruit = food.name;
              }
            });
            expect(foundFruit).to.not.be.null;
            foundFruit = null;
          });
          done();
        })
    })
  .then('I expect the results to be "(.*)"', (results: string, done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(200);
      if (!results) {
        var foods: Array<string> = [];
      } else {
        var foods = results.split(',');
      }
      expect(foods.length).to.equal(res.body.length);
      res.body.forEach((food) => {
        expect(foods).to.include(food.name);
      });
      done();
    });
  })
  .then('I expect to see dishes "(.*)"', (results: string, done) => {
    this.request.end((req, res) => {
      expect(res.status).to.equal(200);
      this.res = res.body;
      if (!results) {
        var dishes: Array<string> = [];
      } else {
        var dishes = results.split(',');
      }
      expect(dishes.length).to.equal(res.body.length);
      done();
    });
  })
  .then('I expect the main ingredient to be populated', (done) => {
    this.res.forEach((dish) => {
      expect(dish.name).to.be.ok;
      expect(typeof dish.mainIngredient._id).to.equal('string');
      done();
    });
  })
  .then('I expect the main ingredient not to be populated', (done) => {
    this.res.forEach((dish) => {
      expect(typeof dish.mainIngredient).to.equal('string');
      done();
    });
  });

module.exports = library;
