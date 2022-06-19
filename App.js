import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import ProfileTab from './ProfileTab';

global.tasks = [
  {'name': 'Tarea 1', 'points': 100},
  {'name': 'Tarea 2', 'points': 300}
]

global.points = {
  'bruno': 3600,
  'dante': 1200
}

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
        style={{ paddingTop: 40 }}
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
  return <ProfileTab name={route.key} profilePoints={global.points}/>
}
