"use strict";
var it = require('it'),
    assert = require('assert'),
    comb = require("index"),
    define = comb.define,
    singleton = comb.singleton;

it.describe("comb.define", function (it) {

//Super of other classes
    var Mammal = define({
        instance: {

            constructor: function (options) {
                options = options || {};
                this._super(arguments);
                this._type = options.type || "mammal";
            },

            speak: function () {
                return  "A mammal of type " + this._type + " sounds like";
            },

            //Define your getters
            getters: {
                type: function () {
                    return this._type;
                }
            },

            setters: {
                type: function (type) {
                    this._type = type;
                }
            }
        },

        //Define your static methods
        static: {

            mammalInheritedProp: "mammalInheritedProp",

            soundOff: function () {
                return "Im a mammal!!";
            }
        }
    });

//Show singular inheritance
    var Wolf = Mammal.extend({
        instance: {
            constructor: function (options) {
                options = options || {};
                //call your super constructor you can call this after you initialize or not
                //call it at all to prevent the supers from initilizing things
                this._super(arguments);
                this._sound = "growl";
                this._color = options.color || "grey";
            },

            speak: function () {
                return this._super(arguments) + " a " + this._sound;
            },

            getters: {
                color: function () {
                    return this._color;
                },

                sound: function () {
                    return this._sound;
                }
            },

            setters: {
                color: function (color) {
                    this._color = color;
                },

                sound: function (sound) {
                    this._sound = sound;
                }
            }
        },

        static: {
            soundOff: function () {
                //You can even call super in your statics!!!
                return this._super(arguments) + " that growls";
            }
        }
    });


//Typical heirachical inheritance
// Mammal->Wolf->Dog
    var Dog = Wolf.extend({
        instance: {
            constructor: function (options) {
                options = options || {};
                this._super(arguments);
                this._sound = "woof";

            },

            speak: function () {
                return this._super(arguments) + " thats domesticated";
            }
        },

        static: {
            soundOff: function () {
                return this._super(arguments) + " but now barks";
            }
        }
    });

// Mammal->Wolf->Dog->Breed
    var Breed = Dog.extend({
        instance: {

            _pitch: "high",

            constructor: function (options) {
                options = options || {};
                this._super(arguments);
                this.breed = options.breed || "lab";
            },

            speak: function () {
                return this._super(arguments) + " with a " + this._pitch + " pitch!";
            },

            getters: {
                pitch: function () {
                    return this._pitch;
                }
            },

            setters: {
                pitch: function (pitch) {
                    this._pitch = pitch;
                }
            }
        },

        static: {
            soundOff: function () {
                return this._super(arguments).toUpperCase() + "!";
            }
        }
    });

//Example of multiple inheritace
//What really happens is you mixin Wold, Dog, and Breed
//However you are only truely an instance of Mammal
//However the inheritance chain will look like
//Mammal->Wolf->Dog->Breed
//So if you call this._super, it will check breed then dog then wolf then mammal
//be found through inheritance
    var Lab = define([Mammal, Wolf, Dog, Breed]);

    var MyLab = singleton(Lab);

    var MyLabWithConstructor = singleton([Mammal, Wolf, Dog, Breed], {
        instance: {
            constructor: function () {
                this._super(arguments);
            }
        }
    });

    var StaticInitClass = define([Mammal, Wolf, Dog, Breed], {
        static: {
            initCalled: false,
            init: function () {
                this.initCalled = true;
            }
        }
    });

    var SingletonInit = singleton([Mammal, Wolf, Dog, Breed], {
        static: {
            initCalled: false,
            init: function () {
                this.initCalled = true;
            }
        }
    });

    var WrappedClass = define([Mammal, Wolf, Dog, Breed], {
        static: {
            DogMammal: Dog
        }
    });

    it.describe("Dog", function (it) {
        var dog = new Dog({color: "gold"});
        it.should("sound like a dog", function () {
            //This is true because they inherit from eachother!
            assert.isTrue(dog instanceof Wolf);
            assert.isTrue(dog instanceof Mammal);
            assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
            assert.equal(dog.speak(), "A mammal of type mammal sounds like a woof thats domesticated");
            assert.equal(dog.type, "mammal");
            assert.equal(dog.color, "gold");
            assert.equal(dog.sound, "woof");
            assert.equal(Dog.soundOff(), "Im a mammal!! that growls but now barks");
        });

        it.should("be a DOG after setting type", function () {
            dog.type = "DOG";
            assert.equal(dog.speak(), "A mammal of type DOG sounds like a woof thats domesticated");
            assert.equal(dog.type, "DOG");
            assert.equal(dog.color, "gold");
            assert.equal(dog.sound, "woof");
            assert.equal(Dog.soundOff(), "Im a mammal!! that growls but now barks");
        });
    });


    it.describe("a Breed ", function (it) {

        var breed = new Breed({color: "gold", type: "lab"});


        it.should("sound like a lab", function () {
            //the next three are true because they inherit from each other
            assert.isTrue(breed instanceof Dog);
            assert.isTrue(breed instanceof Wolf);
            assert.isTrue(breed instanceof Mammal);
            assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
            assert.equal(breed.speak(), "A mammal of type lab sounds like a woof thats domesticated with a high pitch!");
            assert.equal(breed.type, "lab");
            assert.equal(breed.color, "gold");
            assert.equal(breed.sound, "woof");
            assert.equal(breed.pitch, "high");
            assert.equal(Breed.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
        });

        it.should("but after setting the type it should be a collie", function () {
            breed.type = "collie"
            assert.isTrue(breed instanceof Dog);
            assert.isTrue(breed instanceof Wolf);
            assert.isTrue(breed instanceof Mammal);
            assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
            assert.equal(breed.speak(), "A mammal of type collie sounds like a woof thats domesticated with a high pitch!");
            assert.equal(breed.type, "collie");
            assert.equal(breed.color, "gold");
            assert.equal(breed.sound, "woof");
            assert.equal(breed.pitch, "high");
            assert.equal(Breed.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
        });

        it.should("but after setting the color it should be grey", function () {
            breed.color = "grey"
            assert.isTrue(breed instanceof Dog);
            assert.isTrue(breed instanceof Wolf);
            assert.isTrue(breed instanceof Mammal);
            assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
            assert.equal(breed.speak(), "A mammal of type collie sounds like a woof thats domesticated with a high pitch!");
            assert.equal(breed.type, "collie");
            assert.equal(breed.color, "grey");
            assert.equal(breed.sound, "woof");
            assert.equal(breed.pitch, "high");
            assert.equal(Breed.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
        });

        it.should("but after setting the sound it should sound like a bark", function () {
            breed.sound = "bark"
            assert.isTrue(breed instanceof Dog);
            assert.isTrue(breed instanceof Wolf);
            assert.isTrue(breed instanceof Mammal);
            assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
            assert.equal(breed.speak(), "A mammal of type collie sounds like a bark thats domesticated with a high pitch!");
            assert.equal(breed.type, "collie");
            assert.equal(breed.color, "grey");
            assert.equal(breed.sound, "bark");
            assert.equal(breed.pitch, "high");
            assert.equal(Breed.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
        });

        it.should("but after setting the pitch it should be low pitched", function () {
            breed.pitch = "low"
            assert.isTrue(breed instanceof Dog);
            assert.isTrue(breed instanceof Wolf);
            assert.isTrue(breed instanceof Mammal);
            assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
            assert.equal(breed.speak(), "A mammal of type collie sounds like a bark thats domesticated with a low pitch!");
            assert.equal(breed.type, "collie");
            assert.equal(breed.color, "grey");
            assert.equal(breed.sound, "bark");
            assert.equal(breed.pitch, "low");
            assert.equal(Breed.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
        });
    });


    it.describe("a LAB ", function (it) {
        var lab = new Lab();

        it.should("sound like a lab", function () {
            //the next three are false because they are mixins
            assert.isFalse(lab instanceof Breed);
            assert.isFalse(lab instanceof Dog);
            assert.isFalse(lab instanceof Wolf);
            assert.isTrue(lab instanceof Mammal);
            assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
            assert.equal(lab.speak(), "A mammal of type mammal sounds like a woof thats domesticated with a high pitch!");
            assert.equal(lab.type, "mammal");
            assert.equal(lab.color, "grey");
            assert.equal(lab.sound, "woof");
            assert.equal(Lab.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
        });
    });

    it.describe("Singletons", function (it) {
        it.describe("when in creating my lab singleton", function (it) {

            var lab = new MyLab({type: "dog"});

            it.should("still be a dog", function () {
                var myLab = new MyLab();
                assert.isTrue(lab == myLab);
                assert.equal(lab.type, "dog");
                assert.equal(myLab.type, "dog");
                assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
                assert.equal(lab.speak(), "A mammal of type dog sounds like a woof thats domesticated with a high pitch!");
                assert.equal(myLab.speak(), "A mammal of type dog sounds like a woof thats domesticated with a high pitch!");
                assert.equal(lab.type, "dog");
                assert.equal(myLab.type, "dog");
                assert.equal(lab.color, "grey");
                assert.equal(myLab.color, "grey");
                assert.equal(lab.sound, "woof");
                assert.equal(myLab.sound, "woof");
                assert.equal(MyLab.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
            });
        });


        it.describe("when in creating my lab singleton with a constructor", function (it) {

            var lab = new MyLabWithConstructor({type: "dog"});

            it.should("still be a dog", function () {
                var myLab = new MyLabWithConstructor();
                assert.isTrue(lab == myLab);
                assert.equal(lab.type, "dog");
                assert.equal(myLab.type, "dog");
                assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
                assert.equal(lab.speak(), "A mammal of type dog sounds like a woof thats domesticated with a high pitch!");
                assert.equal(myLab.speak(), "A mammal of type dog sounds like a woof thats domesticated with a high pitch!");
                assert.equal(lab.type, "dog");
                assert.equal(myLab.type, "dog");
                assert.equal(lab.color, "grey");
                assert.equal(myLab.color, "grey");
                assert.equal(lab.sound, "woof");
                assert.equal(myLab.sound, "woof");
                assert.equal(MyLab.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
            });
        });

        it.describe("when in creating my lab singleton with params", function (it) {

            var lab = new MyLab();

            it.should("still be a dog", function () {
                var myLab = new MyLab();
                assert.isTrue(lab == myLab);
                assert.equal(lab.type, "dog");
                assert.equal(myLab.type, "dog");
                assert.equal(Dog.mammalInheritedProp, "mammalInheritedProp");
                assert.equal(lab.speak(), "A mammal of type dog sounds like a woof thats domesticated with a high pitch!");
                assert.equal(myLab.speak(), "A mammal of type dog sounds like a woof thats domesticated with a high pitch!");
                assert.equal(lab.type, "dog");
                assert.equal(myLab.type, "dog");
                assert.equal(lab.color, "grey");
                assert.equal(myLab.color, "grey");
                assert.equal(lab.sound, "woof");
                assert.equal(myLab.sound, "woof");
                assert.equal(MyLab.soundOff(), "IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!");
            });
        });

    });

    it.should("call static init methods", function () {
        assert.isTrue(StaticInitClass.initCalled);
        assert.isTrue(SingletonInit.initCalled);
        assert.deepEqual(WrappedClass.DogMammal, Dog);
        assert.instanceOf(new WrappedClass.DogMammal(), Dog);
    });

    it.describe("#_getSuper", function (it) {
        it.should("get the super function", function () {
            var Mammal2 = define(Mammal, {
                instance: {
                    speak: function () {
                        return this._getSuper();
                    },

                    unspeak: function () {
                        return this._getSuper();
                    }
                }
            });
            assert.equal(new Mammal2().speak()(), "A mammal of type mammal sounds like");
            assert.isNull(new Mammal2().unspeak());
        });
    });


    it.describe("#as", function (it) {

        it.should("add to the exports ", function () {
            Mammal.as(exports, "Mammal");
            assert.equal(exports.Mammal, Mammal);
        });

        it.should("export as module", function () {
            Mammal.as(module);
            assert.equal(module.exports, Mammal);
        });
    });

});


