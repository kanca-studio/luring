import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import {
  Name_2OfflineStatusQuery,
  Name_2OfflineStatusQueryVariables,
} from '../types';

const QUERY = gql`
  query name_2OfflineStatus($gid_2: ID!, $serviceID: ID!) {
    name_2OfflineStatus(gid_2: $gid_2, serviceID: $serviceID) {
      id
      value
      place {
        id
        name_4
        centerToName2
        geom
      }
    }
  }
`;

const useOfflineStatusQuery = (variables: Name_2OfflineStatusQueryVariables) =>
  useQuery<Name_2OfflineStatusQuery, Name_2OfflineStatusQueryVariables>(QUERY, {
    variables,
    fetchPolicy: 'network-only',
  });

export default useOfflineStatusQuery;
