(function () {
	'use strict'

	const suite = new Benchmark.Suite

	const imps = [
		md.imp.nativeDispatch,
		md.imp.stringMap,
		md.imp.mapMap
	]

	function createConstructors (count) {
		return [
			function A () { this.value = 1 },
			function B () { this.value = 2 },
			function C () { this.value = 3 },
			function D () { this.value = 4 },
			function E () { this.value = 5 }
		].slice(0, count)
	}

	function createPairs (constructors) {
		const pairs = []
		const args = []

		function recurse (k, id) {
			if (k >= constructors.length) {
				pairs.push({
					argTypes: args.slice(),
					method: (...args) => id + args.reduce((prev, arg) => prev + arg.value, 0)
				})
				return
			}

			constructors.forEach((constructor, index) => {
				args[k] = constructor
				recurse(k + 1, id * 10 + index)
			})
		}

		recurse(0, 0)

		return pairs
	}

	function createStructure (count) {
		const constructors = createConstructors(count)
		const instances = constructors.map((constructor) => new constructor)
		const pairs = createPairs(constructors)

		return { constructors, instances, pairs }
	}

	function callAll (instances) {
		let phonyVar = 0

		let object
		const args = []

		function recurse (k) {
			if (k === instances.length - 1) {
				phonyVar += object.i(...args)
				return
			}

			instances.forEach((instance) => {
				args[k] = instance
				recurse(k + 1)
			})
		}

		instances.forEach((instance) => {
			object = instance
			recurse(0)
		})

		return phonyVar
	}

	let phonyVar = 0

	imps.forEach(({ name, defineMulti }) => {
		const { constructors, instances, pairs } = createStructure(5)
		defineMulti('i', constructors, pairs)

		suite.add(name, () => {
			phonyVar += callAll(instances)
		})
	})

	suite.on('cycle', function (event) {
		console.log(String(event.target))
	})

	suite.on('complete', function () {
		console.log('Fastest is ', this.filter('fastest').map('name'));

		// have to use these values to make sure the functions don't get optimised away
		console.log('phonyVar', phonyVar)
	})

	suite.run({ async: true })
})()