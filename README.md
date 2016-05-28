Multiple dispatch implementations & benchmarks
==============================================

This project explores several implementations of multiple dispatch in JavaScript. 
The example chosen to illustrate this is what I'm going to refer to as the *Box-Sphere problem*:

There are 2 constructors, *Box* and *Sphere*.
There is an *intersects* multimethod which takes 2 arguments of the aforementioned types.
Based on the type of the arguments we'd like to dispatch to the appropriate
*intersects* method.


The implementations:

+ native-dispatch based

This approach uses multiple single dispatch calls. All the *intersects...* methods
are automatically generated and added to the prototypes of the constructors.

```js
function Box () {}

Box.prototype.intersects = function (that) {
	that.intersectsBox(this)
}

Box.prototype.intersectsBox = function (that) {
	console.log('box x box')
}

Box.prototype.intersectsSphere = function (that) {
	console.log('box x sphere')
}


function Sphere () {}

Sphere.prototype.intersects = function (that) {
	that.intersectsSphere(this)
}

Sphere.prototype.intersectsBox = function (that) {
	console.log('sphere x box')
}

Sphere.prototype.intersectsSphere = function (that) {
	console.log('sphere x sphere')
}
```

+ string-map based

This approach is based on a map from string keys to methods. 
The keys are generated based on the constructors of the arguments passed to the multimethod.
The mapping for the Box-Sphere example would look like this:

```js
'Box-Box'       -> function () { console.log('box x box') }
'Box-Sphere'    -> function () { console.log('box x sphere') }
'Sphere-Box'    -> function () { console.log('sphere x box') }
'Sphere-Sphere' -> function () { console.log('sphere x sphere') }
```

+ map-map based

The methods are the leaves of a tree. Each nodes has its children indexed by constructors.
The tree structure for the Box-Sphere example would look like this:

```js
Box ->
	Box ->    function () { console.log('box x box') }
    Sphere -> function () { console.log('box x sphere') }
Sphere ->
	Box ->    function () { console.log('sphere x box') }
    Sphere -> function () { console.log('sphere x sphere') }
```