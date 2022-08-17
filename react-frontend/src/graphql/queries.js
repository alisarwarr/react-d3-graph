/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const allGraphs = /* GraphQL */ `
  query AllGraphs {
    allGraphs {
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
export const getGraphByID = /* GraphQL */ `
  query GetGraphByID($id: ID!) {
    getGraphByID(id: $id) {
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
