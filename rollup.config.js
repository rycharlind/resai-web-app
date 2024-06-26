import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import postcss from 'rollup-plugin-postcss';
import { mdsvex } from "mdsvex";
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

dotenv.config();

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			preventAssignment: true,
			values: {
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.DEV_BASE_URL': JSON.stringify(process.env.DEV_BASE_URL),
				'process.env.PROD_BASE_URL': JSON.stringify(process.env.PROD_BASE_URL),
				'process.env.AZURE_CLIENT_ID': JSON.stringify(process.env.AZURE_CLIENT_ID),
				'process.env.AZURE_AUTHORITY': JSON.stringify(process.env.AZURE_AUTHORITY),
				'process.env.API_URL': JSON.stringify(process.env.API_URL),
			}
		}),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			extensions: ['.svelte', '.svx', '.md'],
			preprocess: [
				mdsvex({ extensions: ['.svx', '.md'] }),
				sveltePreprocess({
					postcss: true,
				}),
			],
		}),
		postcss({
			plugins: [],
			extract: true,
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
