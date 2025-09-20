export type RootStackParamList = {
  Main: undefined;
  Camera: undefined;
  History: undefined;
  Settings: undefined;
  Playback: {incidentId: string};
};

export type TabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Camera: undefined;
  History: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
