import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import NumberFormat from 'react-number-format';


export default ProfileTab = (props) => {

    const images = {
      'bruno': require('./assets/bruno.png'),
      'dante': require('./assets/dante.png')
    }

    return (
      <View style={styles.profileContainer}>
        <View style={{flex: 0.4, width: '100%', alignItems: 'center'}}>
          <Image style={styles.profilePicture} source={images[props.name]}/>
            <NumberFormat
                    value={points[props.name]}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="⭐"
                    renderText=
                      {(value) => <Text style={styles.profilePoints}>{value}</Text>}
            />
        </View>
        <View style={{flex: 0.6, width: '100%', alignItems: 'center'}}>
          <ScrollView style={styles.scrollView}>
              {
              global.tasks.map((task, index) => {
                return (
                  <View key={index} style={styles.taskContainer}>
                    <TaskItem
                        points={task['points']}
                        name={task['name']}
                        profile={props.name}
                    />
                  </View>
                );
              })
            }
            </ScrollView>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  profilePicture: {
      width: 200,
      height: 200,
      borderRadius: 200 / 2
  },
  profilePoints: {
    fontWeight: 'bold',
    fontSize: 30,
    padding: 10
  },
  taskContainer: {
      flexDirection: 'row',
  },
});
