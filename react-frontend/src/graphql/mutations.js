/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGraph = /* GraphQL */ `
  mutation CreateGraph($name: String!, $data: graphPropsInput!) {
    createGraph(name: $name, data: $data) {
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
export const deleteGraph = /* GraphQL */ `
  mutation DeleteGraph($id: ID!) {
    deleteGraph(id: $id)
  }
`;
export const editGraph = /* GraphQL */ `
  mutation EditGraph($id: ID!, $name: String!, $data: graphPropsInput!) {
    editGraph(id: $id, name: $name, data: $data) {
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
