import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';
import {Divider} from 'react-native-paper';

class TipsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const saison = this.props.data.infos_saison.saison;
    const tips = this.props.data.infos_saison.tips;
    return (
      <View>
        <View>
          <Text>
            {saison}
          </Text>
        </View>
        <Divider />
        <Text>
          {tips}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'column',
    margin: 10,
    borderRadius: 5,
    // shadow
    shadowColor: 'rgba(0,0,0, .7)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  saison: {
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  saison_text: {
    fontSize: 28,
    textAlign: 'center',
    padding: 5,
  },
  item: {
    flex: 3,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 14,
  },
});

export default TipsItem;
