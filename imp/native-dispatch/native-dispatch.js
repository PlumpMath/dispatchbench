(function () {
	'use strict'

	function definePartials (prefix, constructors, mapping) {
		function define (fixed, k) {
			if (k === 0) {
				constructors.forEach((constructor) => {
					const newFixed = `${fixed}${constructor.name}`

					const method = mapping.get(newFixed)
					constructor.prototype[`${prefix}${fixed}`] = function (first, ...rest) {
						return method.call(first, ...rest, this)
					}
				})

				return
			}

			constructors.forEach((constructor) => {
				const newFixed = `${fixed}${constructor.name}`
				constructor.prototype[`${prefix}${fixed}`] = function (first, ...rest) {
					return first[`${prefix}${newFixed}`](...rest, this)
				}

				define(newFixed, k - 1)
			})
		}

		define('', constructors.length - 1)
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
	window.md.imp.nativeDispatch = {
		name: 'native-dispatch',
		defineMulti
	}
})()