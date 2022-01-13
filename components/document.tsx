import {
  DocumentRenderer as DR,
  DocumentRendererProps,
} from "@keystone-6/document-renderer";
import Link from "next/link";

type docsRelationship = "character" | "location" | "clock" | "faction";

export const renderers: DocumentRendererProps["renderers"] = {
  inline: {
    relationship({ relationship, data }) {
      if (relationship) {
        if (data === null || data.data === undefined) {
          return <span>[unknown ${relationship}]</span>;
        } else {
          return (
            <Link href={`/${relationship}/${data.data.slug}`}>
              {data.data.name}
            </Link>
          );
        }
      }
      return null;
    },
  },
};

export const DocumentRenderer = (props: DocumentRendererProps) => (
  <DR renderers={renderers} {...props} />
);
