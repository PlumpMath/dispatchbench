(function () {
	'use strict'

	function definePartials (prefix, constructors, tree) {
		constructors.forEach((constructor) => {
			const firstLevel = tree.get(constructor)

			constructor.prototype[prefix] = function (...args) {
				const method = args.reduce(
					(prev, arg) => prev.get(arg.constructor),
					firstLevel
				)

				return method.call(this, ...args)
			}
		})
	}

	function defineMulti (name, constructors, pairs) {
		const tree = new Map

		pairs.forEach(({ argTypes, method }) => {
			let parent = tree

			for (let i = 0; i < argTypes.length - 1; i++) {
				const type = argTypes[i]

				if (parent.has(type)) {
					parent = parent.get(type)
				} else {
					const child = new Map
					parent.set(type, child)
					parent = child
				}
			}

			parent.set(argTypes[argTypes.length - 1], method)
		})

		definePartials(name, constructors, tree)
	}

	window.md = window.md || {}
	window.md.imp = window.md.imp || {}
	window.md.imp.mapMap = {
		name: 'map-map',
		defineMulti
	}
})()