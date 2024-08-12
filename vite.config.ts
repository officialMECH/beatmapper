import { fileURLToPath } from "node:url";
import type { Pluggable } from "unified";
import { type Plugin, defineConfig, transformWithEsbuild } from "vite";

import { default as mdx } from "@mdx-js/rollup";
import { default as react } from "@vitejs/plugin-react";
import { VitePWA as pwa } from "vite-plugin-pwa";

import { default as rehypeSlug } from "rehype-slug";
import { default as remarkFrontmatter } from "remark-frontmatter";
import { default as remarkGfm } from "remark-gfm";
import { default as remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import { remarkMdxToc } from "remark-mdx-toc";

// treats `.js` files as valid jsx
// TODO: no longer necessary once component rewrite is finished
function jsx(): Plugin {
	return {
		name: "treat-js-files-as-jsx",
		async transform(code, id) {
			if (!id.match(/src\/.*\.js$/)) return null;
			return transformWithEsbuild(code, id, {
				loader: "jsx",
				jsx: "automatic",
			});
		},
	};
}

function markdown() {
	return {
		enforce: "pre",
		...mdx({
			providerImportSource: "@mdx-js/react",
			remarkPlugins: [
				remarkGfm,
				remarkFrontmatter,
				[remarkMdxFrontmatter, { name: "frontMatter" }],
				[remarkMdxToc, { name: "tableOfContents" }] as Pluggable,
				//
			],
			rehypePlugins: [
				rehypeSlug,
				//
			],
		}),
	} as Plugin;
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), jsx(), markdown(), pwa({ registerType: "autoUpdate" })],
	define: { global: "window" },
	resolve: {
		alias: {
			$: fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	build: {
		commonjsOptions: { transformMixedEsModules: true }, // Change
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".js": "jsx",
			},
		},
	},
});
