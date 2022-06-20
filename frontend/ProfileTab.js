import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import NumberFormat from 'react-number-format';
import AnimatedLoader from 'react-native-animated-loader';

export default class ProfileTab extends React.Component {

  endpoint = ''
  api_key = ''

  state = {
      loading: true,
  }

  componentDidMount() {
    fetch(this.endpoint + "data", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-api-key': this.api_key,
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          points: responseJson['points'][this.props.name],
          tasks: responseJson['tasks'].filter((t) => t[this.props.name] == "True")
        })
      })
      .catch(error => console.log(error))
  }


  updatePoints = (addedPoints, taskName) => {
    this.setState({
      updating: true
    })
    fetch(this.endpoint + 'event', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'x-api-key': this.api_key,
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          points: addedPoints.toString(),
          task: taskName,
          profile: this.props.name
        })
      })
      .then(response => response.text())
      .then((responseText) => {
          console.log(responseText)
          setTimeout(() => {
            this.setState({
              updating: false,
              points: responseText,
              tasks: this.state.tasks.filter((list) => list['name'] != taskName)
            })
          }, 1000)
      })
      .catch(error => console.log(error))
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
          {(() => {
            if (this.state.loading) {
              return (
                <AnimatedLoader
                  visible={true}
                  overlayColor="rgba(255,255,255,1)"
                  source={require("./loaders/loading.json")}
                  animationStyle={styles.loader}
                  speed={1}
                >
                  <Text>Cargando tareas...</Text>
                </AnimatedLoader>
              )
            }
              if (this.state.updating) {
                return (
                  <AnimatedLoader
                    visible={true}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("./loaders/updating.json")}
                    animationStyle={styles.loader}
                    speed={1}
                  >
                    <Text>¡Actualizando tus puntos!</Text>
                  </AnimatedLoader>

                )
              }
              if (this.state.tasks.length) {
                return (
                  <ScrollView style={styles.scrollView}>
                  {
                    this.state.tasks.map((task, index) => {
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
                                  <TouchableOpacity onPress={() => this.updatePoints(points, name)}>
                                      <EvilIcons style={styles.complete} name="plus" size={35} />
                                  </TouchableOpacity>
                              </View>
                          </View>
                        </View>
                      );
                    })
                  }
                  </ScrollView>
                )
              }
              return (
                <Text style={styles.emptyList}>¡Ya cumpliste tus objetivos del día!</Text>
              )
            })()}
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
    emptyList: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'goldenrod',
        borderRadius: 6,
        color: 'lightgoldenrodyellow',
        fontSize: 20,
        padding: 20,
        width: '60%',
        textAlign: 'center',
        marginTop: 20
    },
    loader: {
      width: 100,
      height: 100
    }
  });
