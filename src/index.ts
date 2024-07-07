import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss/types/config'

type Theme = (
	path: string,
	defaultValue?: Record<string, string>
) => Record<string, string>

type DynamicShortcut<TValue> = [name: string, callback: (value: TValue) => string, values?: (theme: Theme) => Record<string, TValue>]

type ShortcutRecord = Record<string, string>
type ShortcutList = Array<ShortcutRecord | DynamicShortcut<string>>
type ShortcutConfigItem = ShortcutList | ShortcutRecord

type Shortcut = {
	type: 'static'
	definition: [name: string, classList: string]
} | {
	type: 'dynamic'
	definition: DynamicShortcut<string>
}

/**
 * Create shortcuts for Tailwind CSS.
 * @example
 * ```ts
 * shortcuts([
 * 	{
 * 		'btn-primary': 'px-4 py-2 bg-blue-500 text-white rounded-md',
 * 	},
 * 	['size', (value) => `h-${value} w-${value}`, (theme) => theme('spacing')],
 * ])
 * ```
 */
export function shortcuts(...config: Array<ShortcutConfigItem>) {
	const shortcuts: Array<Shortcut> = []

	for (const item of config) {
		shortcuts.push(...entractShortcuts(item))
	}

	return plugin(({ addUtilities, matchUtilities, theme: twTheme }) => {
		for (const shortcut of shortcuts) {
			if (shortcut.type === 'static') {
				const [name, classList] = shortcut.definition
				const className = `.${name}`

				addUtilities({
					[className]: {
						[`@apply ${classList};`]: {},
					},
				})
			}
			else {
				const [name, callback, values] = shortcut.definition

				function theme(path: string, defaultValue?: Record<string, string>) {
					const value = twTheme(path)
					if (value) {
						return Object.entries(value).reduce((acc, [key, _value]) => {
							acc[key] = key

							return acc
						}, {} as Record<string, string>)
					}

					return defaultValue || {}
				}

				matchUtilities({
					[name]: (value) => {
						return {
							[`@apply ${callback(value)}`]: {},
						}
					},
				}, { values: values && values(theme) })
			}
		}
	})
}

function entractShortcuts(config: ShortcutConfigItem) {
	const shortcuts: Array<Shortcut> = []

	if (Array.isArray(config)) {
		for (const item of config) {
			if (Array.isArray(item)) {
				shortcuts.push({
					type: 'dynamic',
					definition: item,
				})
			}
			else {
				shortcuts.push(...fromRecordToShortcuts(item))
			}
		}
	}
	else {
		shortcuts.push(...fromRecordToShortcuts(config))
	}

	return shortcuts
}

function fromRecordToShortcuts(record: ShortcutRecord) {
	return Object.entries(record)
		.map(([name, classList]) => {
			return {
				type: 'static',
				definition: [name, classList],
			} as Shortcut
		})
}
