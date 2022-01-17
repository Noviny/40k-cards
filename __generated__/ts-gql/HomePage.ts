// ts-gql-integrity:e8bad0bfcde516a56924f5e168ee53e7
/*
ts-gql-meta-begin
{
  "hash": "c9ad3b58f222d3e3d5d96f15d7f32e32"
}
ts-gql-meta-end
*/

import * as SchemaTypes from "./@schema";
import { TypedDocumentNode } from "@ts-gql/tag";

type HomePageQueryVariables = SchemaTypes.Exact<{ [key: string]: never; }>;


type HomePageQuery = (
  { readonly __typename: 'Query' }
  & { readonly users: SchemaTypes.Maybe<ReadonlyArray<(
    { readonly __typename: 'User' }
    & Pick<SchemaTypes.User, 'id' | 'name'>
  )>> }
);


      
export type type = TypedDocumentNode<{
  type: "query";
  result: HomePageQuery;
  variables: HomePageQueryVariables;
  documents: SchemaTypes.TSGQLDocuments;
  fragments: SchemaTypes.TSGQLRequiredFragments<"none">
}>

declare module "./@schema" {
  interface TSGQLDocuments {
    HomePage: type;
  }
}

export const document = JSON.parse("{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"HomePage\"},\"variableDefinitions\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"users\"},\"arguments\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"arguments\":[],\"directives\":[]},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"},\"arguments\":[],\"directives\":[]}]}}]}}]}")
