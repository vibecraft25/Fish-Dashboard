declare module 'react-leaflet-cluster' {
  import { ReactNode } from 'react';
  import { MarkerClusterGroupOptions } from 'leaflet';

  interface MarkerClusterGroupProps extends MarkerClusterGroupOptions {
    children: ReactNode;
  }

  export default function MarkerClusterGroup(props: MarkerClusterGroupProps): JSX.Element;
}