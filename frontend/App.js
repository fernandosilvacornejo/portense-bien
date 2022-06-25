import "./ignoreWarnings";
import React, { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import ProfileTab from './ProfileTab';
import Constants from 'expo-constants';


export default function App() {

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'bruno', title: 'Bruno' },
    { key: 'dante', title: 'Dante' },
  ]);

  return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ paddingTop: Constants.statusBarHeight }}
        renderTabBar={renderTabBar}
      />
  );
}

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'goldenrod' }}
    style={{ backgroundColor: 'aliceblue' }}
    inactiveColor='darkgray'
    activeColor='darkgoldenrod'
  />
);
const renderScene = ({ route }) => {
  return <ProfileTab name={route.key}/>
}
