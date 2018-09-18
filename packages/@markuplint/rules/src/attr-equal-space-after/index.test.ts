import * as markuplint from 'markuplint';
import rule from './';

test('no-space', async () => {
	const r = await markuplint.verify(
		`
		<img src="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': true,
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('space before and after', async () => {
	const r = await markuplint.verify(
		`
		<img src = "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': true,
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'never',
			line: 2,
			col: 11,
			raw: ' = ',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('space before', async () => {
	const r = await markuplint.verify(
		`
		<img src ="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': true,
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('space after', async () => {
	const r = await markuplint.verify(
		`
		<img src= "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': true,
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'never',
			line: 2,
			col: 11,
			raw: '= ',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('line break before', async () => {
	const r = await markuplint.verify(
		`
		<img
		src
		="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': true,
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('line break after', async () => {
	const r = await markuplint.verify(
		`
		<img
		src=
		"path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': true,
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'never',
			line: 3,
			col: 6,
			raw: '=\n\t\t',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('always: no-space', async () => {
	const r = await markuplint.verify(
		`
		<img src="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'always',
			line: 2,
			col: 11,
			raw: '=',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('always: space before and after', async () => {
	const r = await markuplint.verify(
		`
		<img src = "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('always: space before', async () => {
	const r = await markuplint.verify(
		`
		<img src ="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'always',
			line: 2,
			col: 11,
			raw: ' =',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('always: space after', async () => {
	const r = await markuplint.verify(
		`
		<img src= "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('always: line break before', async () => {
	const r = await markuplint.verify(
		`
		<img
		src
		="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'always',
			line: 3,
			col: 6,
			raw: '\n\t\t=',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('always: line break after', async () => {
	const r = await markuplint.verify(
		`
		<img
		src=
		"path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('always-single-line: no-space', async () => {
	const r = await markuplint.verify(
		`
		<img src="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'always-single-line',
			line: 2,
			col: 11,
			raw: '=',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('always-single-line: space before and after', async () => {
	const r = await markuplint.verify(
		`
		<img src = "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('always-single-line: space before', async () => {
	const r = await markuplint.verify(
		`
		<img src ="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'always-single-line',
			line: 2,
			col: 11,
			raw: ' =',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('always-single-line: space after', async () => {
	const r = await markuplint.verify(
		`
		<img src= "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('always-single-line: line break before', async () => {
	const r = await markuplint.verify(
		`
		<img
		src
		="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'always-single-line',
			line: 3,
			col: 6,
			raw: '\n\t\t=',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('always: line break after', async () => {
	const r = await markuplint.verify(
		`
		<img
		src=
		"path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'always-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'always-single-line',
			line: 3,
			col: 6,
			raw: '=\n\t\t',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('never-single-line: no-space', async () => {
	const r = await markuplint.verify(
		`
		<img src="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'never-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('never-single-line: space before and after', async () => {
	const r = await markuplint.verify(
		`
		<img src = "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'never-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'never-single-line',
			line: 2,
			col: 11,
			raw: ' = ',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('never-single-line: space before', async () => {
	const r = await markuplint.verify(
		`
		<img src ="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'never-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('never-single-line: space after', async () => {
	const r = await markuplint.verify(
		`
		<img src= "path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'never-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([
		{
			severity: 'warning',
			message: 'never-single-line',
			line: 2,
			col: 11,
			raw: '= ',
			ruleId: 'attr-equal-space-after',
		},
	]);
});

test('never-single-line: line break before', async () => {
	const r = await markuplint.verify(
		`
		<img
		src
		="path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'never-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

test('never-single-line: line break after', async () => {
	const r = await markuplint.verify(
		`
		<img
		src=
		"path/to">
		`,
		{
			rules: {
				'attr-equal-space-after': 'never-single-line',
			},
		},
		[rule],
		'en',
	);
	expect(r).toStrictEqual([]);
});

// test('no-space', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': true,
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src="path/to">
// 		`,
// 	);
// });

// test('space before and after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src = "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': true,
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src ="path/to">
// 		`,
// 	);
// });

// test('space before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src ="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': true,
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src ="path/to">
// 		`,
// 	);
// });

// test('space after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src= "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': true,
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src="path/to">
// 		`,
// 	);
// });

// test('line break before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src
// 		="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': true,
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src
// 		="path/to">
// 		`,
// 	);
// });

// test('line break after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src=
// 		"path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': true,
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src="path/to">
// 		`,
// 	);
// });

// test('always: no-space', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src= "path/to">
// 		`,
// 	);
// });

// test('always: space before and after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src = "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src = "path/to">
// 		`,
// 	);
// });

// test('always: space before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src ="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src = "path/to">
// 		`,
// 	);
// });

// test('always: space after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src= "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src= "path/to">
// 		`,
// 	);
// });

// test('always: line break before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src
// 		="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src
// 		= "path/to">
// 		`,
// 	);
// });

// test('always: line break after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src=
// 		"path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src=
// 		"path/to">
// 		`,
// 	);
// });

// test('always-single-line: no-space', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src= "path/to">
// 		`,
// 	);
// });

// test('always-single-line: space before and after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src = "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src = "path/to">
// 		`,
// 	);
// });

// test('always-single-line: space before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src ="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src = "path/to">
// 		`,
// 	);
// });

// test('always-single-line: space after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src= "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src= "path/to">
// 		`,
// 	);
// });

// test('always-single-line: line break before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src
// 		="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src
// 		= "path/to">
// 		`,
// 	);
// });

// test('always: line break after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src=
// 		"path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'always-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src= "path/to">
// 		`,
// 	);
// });

// test('never-single-line: no-space', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'never-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src="path/to">
// 		`,
// 	);
// });

// test('never-single-line: space before and after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src = "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'never-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src ="path/to">
// 		`,
// 	);
// });

// test('never-single-line: space before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src ="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'never-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src ="path/to">
// 		`,
// 	);
// });

// test('never-single-line: space after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img src= "path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'never-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img src="path/to">
// 		`,
// 	);
// });

// test('never-single-line: line break before', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src
// 		="path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'never-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src
// 		="path/to">
// 		`,
// 	);
// });

// test('never-single-line: line break after', async () => {
// 	const r = await markuplint.fix(
// 		`
// 		<img
// 		src=
// 		"path/to">
// 		`,
// 		{
// 			rules: {
// 				'attr-equal-space-after': 'never-single-line',
// 			},
// 		},
// 		[rule],
// 		'en',
// 	);
// 	t.is(
// 		r,
// 		`
// 		<img
// 		src=
// 		"path/to">
// 		`,
// 	);
// });
