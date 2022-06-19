import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import NumberFormat from 'react-number-format';

export default class ProfileTab extends React.Component {

  state = {
      points: this.props.profilePoints[this.props.name],
  }

  writeData = (addedPoints) => {
      this.setState({
          points: this.state.points + addedPoints
     })
  }

  render() {
    images = {
      'bruno': require('./assets/bruno.png'),
      'dante': require('./assets/dante.png')
    }
    return (
      <View style={styles.profileContainer}>
        <View style={{flex: 0.4, width: '100%', alignItems: 'center'}}>
          <Image style={styles.profilePicture} source={images[this.props.name]}/>
            <NumberFormat
                    value={this.state.points}
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
                const points = task['points']
                const name = task['name']
                return (
                  <View key={index} style={styles.mainTaskContainer}>
                    <View style={styles.container}>
                        <View style={styles.taskContainer}>
                            <Text style={styles.task}>{name}</Text>
                        </View>
                        <View style={styles.pointsContainer}>
                              <NumberFormat
                                value={points}
                                displayType="text"
                                thousandSeparator="."
                                decimalSeparator=","
                                suffix=" pts"
                                renderText=
                                  {(value) => <Text style={styles.taskPoints}>{value}</Text>}
                              />
                            <TouchableOpacity onPress={() => this.writeData(points)}>
                                <EvilIcons style={styles.complete} name="plus" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                  </View>
                );
              })
            }
            </ScrollView>
        </View>
      </View>
    );
  }
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
    mainTaskContainer: {
        flexDirection: 'row',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: "goldenrod",
        width: '90%',
        marginBottom: 20,
        minHeight: 50

    },
    taskContainer: {
      margin: 10,
      marginLeft: 20,
      flex: 5,
      justifyContent: 'center'
    },
    task: {
      color: 'darkgoldenrod',
      fontSize: 16,
    },
    pointsContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'goldenrod'
    },
    taskPoints: {
        color: 'lightgoldenrodyellow',
        fontSize: 15,
        padding: 5
    },
    complete: {
      color: "lightgoldenrodyellow",
      paddingBottom: 10,

    },
  });
