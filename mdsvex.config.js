import { defineMDSveXConfig as defineConfig, escapeSvelte } from 'mdsvex';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import shiki from 'shiki';

const dirname = path.resolve(fileURLToPath(import.meta.url), '../');

const config = defineConfig({
	extensions: ['.md', '.svx', '.svelte'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await shiki.getHighlighter({ theme: 'poimandres' })
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang }))
			return `{@html \`${html}\` }`
		}
	},
});

export default config;
