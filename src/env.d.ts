/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MONGODB_URI: string;
  readonly AMAZON_ACCESS_KEY: string;
  readonly AMAZON_SECRET_KEY: string;
  readonly AMAZON_PARTNER_TAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}