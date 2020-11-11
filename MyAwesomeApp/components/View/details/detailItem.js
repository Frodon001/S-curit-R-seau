import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {connect} from 'react-redux';

class DetailItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const oiseaux_nom = this.props.data.oiseau_nom;
    const {navigation} = this.props;
    return (
      <View>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() =>
            navigation.navigate('DetailOiseaux', {
              oiseaux_nom: oiseaux_nom,
              root: this.props.data.root,
            })
          }>
          <Text>
            {' '}
            {oiseaux_nom}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  main_container: {
    flex: 1,
    margin: 5,
    padding: 5,
    borderRadius: 5,
    // shadow
    shadowColor: 'rgba(0,0,0, .7)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  Title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  touchableOpacity: {
    borderRadius: 5,
    marginLeft: 'auto',
    width: '100%',
    padding: 3,
    alignItems: 'center',
  },
});


export default (function (props) {
  const navigation = useNavigation();
  return <DetailItem {...props} navigation={navigation} />;
});
