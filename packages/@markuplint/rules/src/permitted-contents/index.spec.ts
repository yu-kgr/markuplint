import * as markuplint from 'markuplint';
import rule from './';

const config = {
	rules: {
		'permitted-contents': true,
	},
};

// test('<a>', async () => {
// 	const r = await markuplint.verify(
// 		`
// 		<a>
// 			<a>invalid</a>
// 		</a>
// 		`,
// 		config,
// 		[rule],
// 	);
// 	expect(r).toStrictEqual([
// 		{
// 			severity: 'error',
// 			message: 'error',
// 			line: 38,
// 			col: 36,
// 			raw: '<a>',
// 			ruleId: 'permitted-contents',
// 		},
// 	]);
// });

describe('<ul>', () => {
	test('<li>', async () => {
		const r = await markuplint.verify(
			`
			<ul>
				<li>valid</li>
				<li>valid</li>
				<li>valid</li>
			</ul>
			`,
			config,
			[rule],
		);
		expect(r).toStrictEqual([]);
	});

	test('<a>', async () => {
		const r = await markuplint.verify(
			`
			<ul>
				<li>valid</li>
				<a>invalid</a>
				<li>valid</li>
			</ul>
			`,
			config,
			[rule],
		);
		expect(r).toStrictEqual([
			{
				severity: 'error',
				message: 'ul要素はa要素を許可しません',
				line: 4,
				col: 6,
				raw: 'a',
				ruleId: 'permitted-contents',
			},
		]);
	});
});
