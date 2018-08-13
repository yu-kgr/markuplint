import * as markuplint from 'markuplint';
import rule from './';

it('is test', async () => {
	const r = await markuplint.verify({
		sourceCodes: '<img src="path/to">',
		config: {
			rules: {
				axe: true,
			},
		},
		rules: [rule],
	});
});
