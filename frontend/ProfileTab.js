import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import NumberFormat from 'react-number-format';
import AnimatedLoader from 'react-native-animated-loader';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

export default class ProfileTab extends React.Component {

  endpoint = process.env.API_ENDPOINT
  api_key = process.env.API_KEY

  state = {
      loading: true,
  }

  componentDidMount() {
    fetch(this.endpoint + "/data", {
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
          points: responseJson['profiles'][this.props.name]['points'],
          prize_name: responseJson['profiles'][this.props.name]['prize']['name'],
          prize_points: responseJson['profiles'][this.props.name]['prize']['points'],
          tasks: responseJson['tasks'][this.props.name]
        })
        progress = this.state.points / this.state.prize_points
        this.setState({prize_progress: progress})
      })
      .catch(error => console.log(error))
  }


  updatePoints = (addedPoints, taskName) => {
    this.setState({
      updating: true
    })
    fetch(this.endpoint + '/event', {
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
      'bruno_prize': require('./assets/bruno-prize.png'),
      'dante': require('./assets/dante.png'),
      'dante_prize': require('./assets/dante-prize.png')
    }

    return (
      <View style={styles.profileContainer}>

        <View style={styles.firstRowContainer}>

          <LinearGradient style={styles.pictureContainer}
            colors={['goldenrod', 'yellow', 'gold', 'navajowhite', 'yellow', 'goldenrod']}
            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}>
              <Image style={styles.profilePicture} source={images[this.props.name]}/>
          </LinearGradient>

          <View style={styles.prizeContainer}>

            <LinearGradient
              style={styles.prizePictureContainer}
              colors={['#ED0024', '#BB061C', '#f08080', '#890D15']}
              start={{ x: 0.0, y: 1.0 }}
              end={{ x: 1.0, y: 1.0 }}>
                <Image style={styles.prizePicture} source={images[this.props.name + '_prize']}/>
            </LinearGradient>

            <View style={styles.prizeDescription}>
              <Text style={styles.prizeName}>{this.state.prize_name}</Text>
              <NumberFormat
                value={this.state.prize_points}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                prefix="⭐"
                renderText=
                  {(value) => <Text style={styles.prizeName}>{value}</Text>}
              />
            </View>

            <Progress.Bar
              style={styles.progressBar}
              progress={this.state.prize_progress}
              animated= 'False'
              color='lightcoral'
              borderColor='crimson'
              width='70'
            />

          </View>

        </View>

        <View style={styles.secondRowContainer}>
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

        <View style={styles.thirdRowContainer}>
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
                  <ScrollView>
                  {
                    this.state.tasks.map((task, index) => {
                      const points = task['points']
                      const name = task['name']
                      return (
                        <View key={index} style={styles.mainTaskContainer}>
                          <View style={styles.taskContainer}>
                              <View style={styles.taskNameContainer}>
                                  <Text style={styles.task}>{name}</Text>
                              </View>
                              <View style={styles.taskPointsContainer}>
                                <TouchableOpacity style={styles.taskPointsContainer} onPress={() => this.updatePoints(points, name)}>
                                    <NumberFormat
                                      value={points}
                                      displayType="text"
                                      thousandSeparator="."
                                      decimalSeparator=","
                                      suffix=" pts"
                                      renderText=
                                        {(value) => <Text style={styles.taskPoints}>{value}</Text>}
                                    />

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
    // Main container
    profileContainer: {
      flex: 1,
      backgroundColor: 'whitesmoke',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    // Row containers
    firstRowContainer: {
      flex: 3,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    secondRowContainer: {
      flex:1,
    },
    thirdRowContainer: {
      flex: 6,
      width: '100%',
      alignItems: 'center'
    },
    // Profile picture
    pictureContainer: {
      flex: 5,
      marginLeft: 10,
      marginRight: 5,
      marginTop: 10,
      height: 190,
      borderRadius: 30,
      alignItems: 'center'
    },
    profilePicture: {
        width: 190,
        height: 180,
        margin: 5,
        borderRadius: 30
    },
    // Prize
    prizeContainer: {
      flex: 4,
      flexDirection: 'column',
      alignItems: 'center',
      height: 170,
      marginRight: 10,
      marginTop: 20
    },
    prizePictureContainer: {
      flex: 3,
      borderRadius: 12,
      alignItems: 'center'
    },
    prizePicture: {
        width: 100,
        height: 110,
        margin: 5,
        borderRadius: 10
    },
    prizeDescription: {
      flex:1,
    },
    prizeName: {
      paddingTop: 3,
      fontWeight: 'bold',
      fontSize: 12,
      color: 'crimson',
      textAlign: 'center',
    },
    progressBar: {
      width: 70,
      marginLeft: 5
    },
    // Profile points
    profilePoints: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    // Tasks
    mainTaskContainer: {
        flexDirection: 'row',
    },
    taskContainer: {
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
    taskNameContainer: {
      margin: 10,
      marginLeft: 20,
      flex: 5,
      justifyContent: 'center'
    },
      task: {
        color: 'darkgoldenrod',
        fontSize: 16,
      },
        taskPointsContainer: {
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
