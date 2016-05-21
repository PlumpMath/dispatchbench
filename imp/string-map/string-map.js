(function () {
	'use strict'

	function definePartials (prefix, constructors, buckets) {
		constructors.forEach((constructor) => {
			const bucket = buckets.get(constructor.name)

			constructor.prototype[prefix] = function (...args) {
				const key = args.map(({ constructor: { name } }) => name).join('')
				const method = bucket.get(key)

				return method.call(this, ...args)
			}
		})
	}

	function defineMulti (name, constructors, pairs) {
		const buckets = new Map

		constructors.forEach((constructor) => {
			buckets.set(constructor.name, new Map)
		})

		pairs.forEach(({ argTypes, method }) => {
			const bucket = buckets.get(argTypes[0].name)
			const key = argTypes.slice(1).map(({ name }) => name).join('')

			bucket.set(key, method)
		})

		definePartials(name, constructors, buckets)
	}

	window.md = window.md || {}
	window.md.imp = window.md.imp || {}
	window.md.imp.stringMap = {
		name: 'string-map',
		defineMulti
	}
})()