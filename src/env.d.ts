interface ImportMetaEnv {
	readonly DEV: boolean;
	readonly PROD: boolean;
	readonly CONTENTFUL_SPACE_ID: string;
	readonly CONTENTFUL_DELIVERY_TOKEN: string;
	readonly CONTENTFUL_PREVIEW_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
