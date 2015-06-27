var _this = this;
var English = require('yadda').localisation.English;
var library = English.library();
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var food = require('../../../examples/foods/resources/food');
var Food = food.model;
var list = require('../../../examples/foods/resources/list');
var List = list.model;
var dish = require('../../../examples/foods/resources/dish');
var Dish = dish.model;
var supertest = require('supertest');
function createIdBasedOnName(name) {
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
    .given('<Food><Name><Weight>', function (done) {
    _this.request = supertest('http://localhost:3000');
    done();
})
    .given('<Food><(.*)><(.*)>', function (name, weight, done) {
    Food.create({
        _id: createIdBasedOnName(name),
        name: name,
        weight: parseInt(weight, 10)
    }, function (err, food) {
        done();
    });
})
    .given('<List><Name><Fruits>', function (done) {
    _this.request = supertest('http://localhost:3000');
    done();
})
    .given('<List><(.*)><(.*)>', function (listName, fruitsString, done) {
    var fruits = fruitsString.split(',');
    var list = {
        name: listName,
        foods: []
    };
    fruits.forEach(function (fruit) {
        list.foods.push(createIdBasedOnName(fruit));
    });
    List.create(list, function (err, list) {
        supertest('http://localhost:3000')
            .get('/api/foods')
            .end(function (req, res) {
            done();
        });
    });
})
    .given('<Dish><Name><Food>', function (done) { return done(); })
    .given('<Dish><(.*)><(.*)>', function (name, food, done) {
    Dish.create({
        _id: createIdBasedOnName(name),
        name: name,
        mainIngredient: createIdBasedOnName(food)
    }).then(function () { return done(); });
})
    .given('the food app is started', function (done) { return done(); })
    .when('I request all food', function (done) {
    _this.request = _this.request.get('/api/foods');
    done();
})
    .when('I request all lists', function (done) {
    _this.request = _this.request.get('/api/lists');
    done();
})
    .when('I query for "(.*)" with "(.*)"', function (attr, query, done) {
    _this.request = _this.request.get("/api/foods?" + attr + "=" + query);
    done();
})
    .when('I query attr "(.*)" with "(.*)" and populate "(.*)" of "(.*)"', function (attr, query, populate, food, done) {
    _this.request = _this.request.get("/api/dishes?" + attr + "=" + query + "&populate=" + populate);
    done();
})
    .then('I expect to see food "(.*)" on position (.*)', function (food, position, done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(200);
        expect(res.body[parseInt(position, 10)].name).to.equal(food);
        done();
    });
})
    .then('I expect to see list "(.*)" with "(.*)"', function (listName, foodString, done) {
    _this.request
        .end(function (req, res) {
        expect(res.status).to.equal(200);
        var foods = foodString.split(',');
        var list;
        res.body.forEach(function (currentList) {
            if (currentList.name === listName) {
                list = currentList;
            }
        });
        foods.forEach(function (fruit) {
            var foundFruit = null;
            list.foods.forEach(function (food) {
                if (food.name === fruit) {
                    foundFruit = food.name;
                }
            });
            expect(foundFruit).to.not.be.null;
            foundFruit = null;
        });
        done();
    });
})
    .then('I expect the results to be "(.*)"', function (results, done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(200);
        if (!results) {
            var foods = [];
        }
        else {
            var foods = results.split(',');
        }
        expect(foods.length).to.equal(res.body.length);
        res.body.forEach(function (food) {
            expect(foods).to.include(food.name);
        });
        done();
    });
})
    .then('I expect to see dishes "(.*)"', function (results, done) {
    _this.request.end(function (req, res) {
        expect(res.status).to.equal(200);
        _this.res = res.body;
        if (!results) {
            var dishes = [];
        }
        else {
            var dishes = results.split(',');
        }
        expect(dishes.length).to.equal(res.body.length);
        done();
    });
})
    .then('I expect the main ingredient to be populated', function (done) {
    _this.res.forEach(function (dish) {
        expect(dish.name).to.be.ok;
        expect(typeof dish.mainIngredient._id).to.equal('string');
        done();
    });
})
    .then('I expect the main ingredient not to be populated', function (done) {
    _this.res.forEach(function (dish) {
        expect(typeof dish.mainIngredient).to.equal('string');
        done();
    });
});
module.exports = library;
