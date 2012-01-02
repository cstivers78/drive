const def = require('../../lib').define;
const inspect = require('util').inspect;

const Animal = def.Class();

const Mammal = def.Class( Animal, {
  eyes: 2,
  ears: 2,
  mouth: 1,

  speak: function() {
    console.log("<undefined>");
  },

  home: function() {
    console.log("<undefined>");
  }
});

const LivesInWater = def.Trait({
  home: function() {
    console.log("water");
  }
})

const Swimmer = def.Trait( LivesInWater, {
  swim: function() {
    console.log("swimming");
  }
});

const Dolphin = def.Class( [Mammal, Swimmer], {
  kind: 'Dolphin',
  flippers: 2,
  tail: 1,
  porthole: 1,

  speak: function() {
    console.log("eek!")
  }
});

const Dog = def.Class( Mammal, {
  legs: 4,
  tail: 1,

  speak: function() {
    console.log("woof!");
  }
});


const Cat = def.Class( Mammal, {
  legs: 4,
  tail: {value: 1},
  whiskers: true,

  speak: function() {
    console.log("meow!");
  }
});

const Sloth = def.Class( Mammal );

var flipper = new Dolphin();
var lassie = new Dog();
var garfield = new Cat();
var sloth = new Sloth();

flipper.speak();
flipper.swim();
flipper.home();
lassie.speak();
garfield.speak();
sloth.speak();
