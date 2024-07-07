<div align="center">
	<h1>
		@vyke/tailwind-shortcuts
	</h1>
</div>
Tailwind plugin that provides and easy to create and handle shortcuts inspired by UnoCSS shortcuts.

## Installation
```sh
npm i @vyke/tailwind-shortcuts
```

## API
### shortcuts
Create shortcuts for Tailwind CSS.

```ts
shortcuts([
	{
		'btn-primary': 'px-4 py-2 bg-blue-500 text-white rounded-md',
	},
	['size', (value) => `h-${value} w-${value}`, (theme) => theme('spacing')],
])
```

## Others vyke projects
- [Flowmodoro app by vyke](https://github.com/albizures/vyke-flowmodoro)
- [@vyke/tsdocs](https://github.com/albizures/vyke-tsdocs)
- [@vyke/results](https://github.com/albizures/vyke-results)
- [@vyke/val](https://github.com/albizures/vyke-val)
- [@vyke/dom](https://github.com/albizures/vyke-dom)
- [@vyke/fns](https://github.com/albizures/vyke-fns)
