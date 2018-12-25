import gql from "graphql-tag";

export const req_user = gql`
    {
        req_user{
            id
            username
            name
        }
    }
`;