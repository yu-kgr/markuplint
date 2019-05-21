/* eslint-disable @typescript-eslint/no-var-requires */
const { parse } = require('../lib/_parser');

describe('tokenizer', () => {
	it('is reference grammer', () => {
		expect(parse('a = a')).toStrictEqual([
			{
				type: 'ref',
				variableName: 'a',
				value: {
					name: 'a',
					required: 'required',
					type: 'variable',
				},
			},
		]);
	});
});

/* eslint-enable */
