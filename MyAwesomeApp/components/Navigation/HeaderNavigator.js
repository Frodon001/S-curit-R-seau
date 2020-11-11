import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, CommonActions} from '@react-navigation/native';
import ViewNavigator from './ViewNavigator';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import ProfilNavigator from './ProfilNavigator';
import {connect} from 'react-redux';
import LoadingScreen from '../View/LoadingScreen';

const Stack = createStackNavigator();

class HeaderNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  render() {
    let theme = this.props.currentStyle;
    return (
      <Stack.Navigator
        initialRouteName="LoadingScreen"
        screenOptions={{
          headerTintColor: theme.highlight,
          headerStyle: {
            backgroundColor: theme.primary,
              // shadow
              shadowColor: 'rgba(0,0,0, .7)',
              shadowOffset: { height:0, width: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 3,
          },
        }}>
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{
            title: '',
          }}
        />
        <Stack.Screen
          name="Views"
          component={ViewNavigator}
          options={{
            title: this.state.title,
            headerRight: () => <HeaderRight />,
            headerLeft: () => {
              return null;
            },
          }}
        />
        <Stack.Screen
          name="Profil"
          component={ProfilNavigator}
          options={{
            title: 'Profil',
          }}
        />
      </Stack.Navigator>
    );
  }
}

const HeaderRight = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerIcon}>
      <TouchableOpacity
        style={{marginRight: 5}}
        onPress={() => {
          navigation.dispatch(CommonActions.navigate('Profil'));
        }}>
        <Image
          source={require('../../assets/images/profileIcon.png')}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

let styles = StyleSheet.create({
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
});

const mapStateToProps = (state) => {
  return {
    currentStyle: state.currentStyle,
  };
};

export default connect(mapStateToProps)(HeaderNavigator);
