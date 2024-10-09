/// <reference types="vite/client" />

declare module "*.mdx" {
	import type { TocEntry } from "remark-mdx-toc";
	/** `remark-mdx-frontmatter` */
	export const frontMatter: Frontmatter;
	/** `remark-mdx-toc` */
	export const tableOfContents: TocEntry[];
}

declare interface Frontmatter {
	title: string;
	subtitle: string;
}
