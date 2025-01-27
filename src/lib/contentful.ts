import * as contentful from "contentful";
import type { EntryFieldTypes } from "contentful";

export interface Post {
  contentTypeId: "post";
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    date: EntryFieldTypes.Date;
    content: EntryFieldTypes.RichText;
    thumbnail: EntryFieldTypes.AssetLink;
    images: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  };
}

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});
