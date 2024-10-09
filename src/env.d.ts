/// <reference types="vite/client" />

/** @link https://github.com/DCsunset/remark-mdx-toc/blob/master/src/index.ts#L10-L16 */
declare interface TocEntry {
	depth: number;
	value: string;
	attributes: Record<string, string>;
	children: TocEntry[];
}

declare module "*.mdx" {
	/** `remark-mdx-frontmatter` */
	export const frontMatter: Frontmatter;
	/** `remark-mdx-toc` */
	export const tableOfContents: TocEntry[];
}

declare interface Frontmatter {
	title: string;
	subtitle: string;
}
