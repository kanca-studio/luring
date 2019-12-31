import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { ServicesQuery } from '../types';

const QUERY = gql`
  query services {
    services {
      id
      name
      icon
    }
  }
`;

const useServicesQuery = () => useQuery<ServicesQuery>(QUERY);

export default useServicesQuery;
