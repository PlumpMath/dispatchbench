(function () {
	'use strict'

	function definePartials (prefix, constructors, mapping) {
		constructors.forEach((constructor) => {
			constructor.prototype[prefix] = function (...args) {
				const argsKey = args.map((arg) => arg.constructor.name).join('')
				const key = `${constructor.name}${argsKey}`
				const method = mapping.get(key)

				return method.call(this, ...args)
			}
		})
	}

	function defineMulti (name, constructors, pairs) {
		const mapping = new Map

		pairs.forEach(({ argTypes, method }) => {
			const key = argTypes.map(({ name }) => name).join('')
			mapping.set(key, method)
		})

		definePartials(name, constructors, mapping)
	}

	window.md = window.md || {}
	window.md.imp = window.md.imp || {}
	window.md.imp.stringMap = {
		name: 'string-map',
		defineMulti
	}
})()