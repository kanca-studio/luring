import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { Name_2PlacesQuery } from '../types';

const QUERY = gql`
  query name_2Places {
    name_2Places {
      id
      name
      point {
        lat
        lon
      }
    }
  }
`;

const usePlacesQuery = () => useQuery<Name_2PlacesQuery>(QUERY);

export default usePlacesQuery;
