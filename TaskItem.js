import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import NumberFormat from 'react-number-format'
// import AppContext from './AppContext';


export default TaskItem = (props) => {
    // const appContext = useContext(AppContext);
    return (
        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.task}>{props.name}</Text>
            </View>
            <View style={styles.pointsContainer}>
                  <NumberFormat
                    value={props.points}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix=" pts"
                    renderText=
                      {(value) => <Text style={styles.taskPoints}>{value}</Text>}
                  />
                <TouchableOpacity onPress={() => completeTask(props.profile, props.points)}>
                    <EvilIcons style={styles.complete} name="plus" size={35} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
