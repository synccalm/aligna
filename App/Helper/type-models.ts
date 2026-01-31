import { RouteProp } from '@react-navigation/native';
import { Edge } from 'react-native-safe-area-context';

type routeProps = RouteProp<any, any>; // Adjust according to your navigation setup
export type navProps = {
  route: routeProps;
};

export type RadioGroupData = {
  id: number;
  title: string;
};

export type FileType = {
  uri: string;
  type: string;
  name: string;
};

// insets variables
export const myEdges: Edge[] = [];
