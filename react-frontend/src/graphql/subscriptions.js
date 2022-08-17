/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGraph = /* GraphQL */ `
  subscription OnCreateGraph {
    onCreateGraph {
      id
      name
      data {
        link {
          source
          target
        }
        node {
          id
          fontSize
          size
          symbolType
          color
          name
          svg
          connection
        }
      }
    }
  }
`;
export const onDeleteGraph = /* GraphQL */ `
  subscription OnDeleteGraph {
    onDeleteGraph
  }
`;
export const onEditGraph = /* GraphQL */ `
  subscription OnEditGraph {
    onEditGraph {
      id
      name
      data {
        link {
          source
          target
        }
        node {
          id
          fontSize
          size
          symbolType
          color
          name
          svg
          connection
        }
      }
    }
  }
`;
