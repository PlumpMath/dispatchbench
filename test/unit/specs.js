(function () {
	'use strict'

	function createConstructors (count) {
		return [
			function A() {},
			function B() {},
			function C() {},
			function D() {}
		].slice(0, count)
	}

	function runSpecs (defineMulti) {
		it('creates and invokes a (single)method', () => {
			const [A] = createConstructors(1)

			defineMulti('i', [A], [{
				argTypes: [A], method () { return 123 }
			}])

			expect(new A().i())
				.toEqual(123)
		})

		it('creates and invokes a multimethod', () => {
			const [A, B, C] = createConstructors(3)

			defineMulti('i', [A, B, C], [{
				argTypes: [A, A, A], method () { return 123 }
			}])

			expect(new A().i(new A, new A))
				.toEqual(123)
		})

		it('calls the method with the correct this', () => {
			const [A, B, C] = createConstructors(3)

			defineMulti('i', [A, B, C], [{
				argTypes: [A, A, A], method () { return this }
			}])

			const instance = new A

			expect(instance.i(new A, new A))
				.toEqual(instance)
		})

		it('calls the method with the correct arguments', () => {
			const [A, B, C] = createConstructors(3)

			defineMulti('i', [A, B, C], [{
				argTypes: [A, A, A], method (...args) { return args }
			}])

			const arg1 = new A
			const arg2 = new A

			expect(new A().i(arg1, arg2))
				.toEqual([arg1, arg2])
		})

		it('dispatches the correct method', () => {
			const [A, B, C] = createConstructors(3)

			defineMulti('i', [A, B, C], [{
				argTypes: [A, A, A], method () { return 123 }
			}, {
				argTypes: [A, B, C], method () { return 234 }
			}, {
				argTypes: [C, B, A], method () { return 345 }
			}])

			expect(new C().i(new B, new A))
				.toEqual(345)
		})

		it('throws an error when the method is missing', () => {
			const [A, B, C] = createConstructors(3)

			defineMulti('i', [A, B, C], [{
				argTypes: [A, A, A], method () { return 123 }
			}])

			expect(() => { new B().i(new B, new B) })
				.toThrow()
		})
	}

	const imps = [
		md.imp.nativeDispatch
	]

	imps.forEach(({ name, defineMulti }) => {
		describe(name, () => {
			runSpecs(defineMulti)
		})
	})
})()