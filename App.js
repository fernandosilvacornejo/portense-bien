import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
// import AppContext from './AppContext';

import TaskItem from './TaskItem';
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
  const [tasksList, updateTasksList] = useState([
    {'name': 'Tarea 1', 'points': 100},
    {'name': 'Tarea 2', 'points': 300}
  ])
  const [profilePoints, updateProfilePoints] = useState({
    'bruno': 3600,
    'dante': 1200
  })

  const completeTask = (profile, points) => {
    console.log(profilePoints)
    const newPoints = global.points
    newPoints[profile] += points
    global.points = newPoints
    updateProfilePoints(newPoints)
    console.log(profilePoints)
  }

  // const globalSettings = {
  //   tasksList: tasksList,
  //   profilePoints: points,
  //   completeTask, updateProfilePoints
  // };

  return (
    // <AppContext.Provider value={globalSettings}>
      <TabView
        navigationState={{ index, routes, profilePoints: profilePoints }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ paddingTop: 40 }}
        renderTabBar={renderTabBar}
      />
    // </AppContext.Provider>
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
const renderScene = ({ route, profilePoints }) => {
  console.log(profilePoints)
  return <ProfileTab name={route.key} points={profilePoints}/>
}
