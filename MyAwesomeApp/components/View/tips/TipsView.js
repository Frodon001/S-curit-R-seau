import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import TipsItem from './TipsItem';
import {connect} from 'react-redux';

class TipsView extends React.Component {
  constructor(props) {
    super(props);
    this.text_context = 'Vous pouvez aider les oiseaux de la nature et favoriser leur survie\n' +
        '            en les aidant à trouver facilement une alimentation adaptée et à\n' +
        '            garder un habitat approprié.'
    this.Saisons = [
      {
        id: '01',
        saison: 'Automne',
        tips:
          'Dès l’arrivée des premiers froids, la nourriture commence à se raréfier pour les oiseaux.\n' +
          '\n' +
          'Apportez de la nourriture régulièrement pour compenser la raréfaction des ressources alimentaires.',
      },
      {
        id: '02',
        saison: 'Hiver',
        tips:
          'Le gel et la neige limitent l’accès des oiseaux à l’eau et à la nourriture.\n' +
          '\n' +
          'Proposez de la nourriture telle que les graines ou/et des boules de graisse pour aider les oiseaux à résister à la période hivernale.\n' +
          '\n' +
          'Installez une baignoire à oiseaux et veillez à ce que l’eau ne soit pas gelée et toujours propre, changez l’eau régulièrement.',
      },
      {
        id: '03',
        saison: 'Printemps',
        tips:
          'Il y a 4 fois plus d’oiseaux qu’en hiver, donc les besoins en alimentation augmentent. C’est aussi le début de la période de nidification.\n' +
          '\n' +
          'Remplissez régulièrement les mangeoires de nourriture.\n' +
          '\n' +
          'Préparez des nichoirs pour offrir aux oiseaux un lieu adapté pour couver et élever leurs petits.',
      },
      {
        id: '04',
        saison: 'Été',
        tips:
          'La période de nidification se poursuit pour aboutir à la naissance des petits, qui vont avoir besoin d’une alimentation spécifique pour leur croissance.\n' +
          '\n' +
          'De plus, avec la chaleur estivale, l’accès à l’eau pure, vitale pour l’oiseau, est de plus en plus difficile.\n' +
          '\n' +
          'Apportez une alimentation complémentaire aux oiseaux qui n’ont pas assez de temps pour collecter la nourriture pour leurs petits et pour eux.\n' +
          '\n' +
          'Installez une baignoire pour permettre aux oiseaux de se désaltérer et de se rafraîchir. Vous pouvez également mettre de l’eau dans une brique ou dans des couvercles de confitures…\n' +
          '\n',
      },
    ];
  }


  render() {
    let text = this.text_context;
    return (
      <View>
        <View style={{flex: 1}} testID={'wrapper'}>
          <Text
              style={{color: 'red'}} testID={'text'}>
            {text}
          </Text>
        </View>
        <FlatList
          style={[styles.tips_list]}
          data={this.Saisons}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <TipsItem data={{infos_saison: item}} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  context: {
    margin: 10,
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
  },
  context_text: {
    fontSize: 18,
  },
  tips_list: {
    marginLeft: 5,
    marginRight: 5,
  },
});


export default TipsView;
