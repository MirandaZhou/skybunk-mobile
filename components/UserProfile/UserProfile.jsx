import React from 'react';
import { Modal, View, Image, TouchableOpacity } from 'react-native';
import { Text, Icon, Card, CardItem } from 'native-base';
import { AppLoading } from "expo";
import * as Font from 'expo-font';
import AutoLink from 'react-native-autolink'
import _ from 'lodash';

import styles from './UserProfileStyle';
import {getProfilePicture} from '../../helpers/imageCache'

export default class UserProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null
    }
  }

  async componentDidUpdate(prevProps) {
    var { user } = this.props;
    if (!user) return;

    if (prevProps.user && _.isEqual(prevProps.user, user)) return;

    getProfilePicture(user._id).then(pic => {
      this.setState({ profilePicture: pic });
    }).catch(error => {
      console.error(error);
    });
  }

  onClose = () => {
    const { onClose } = this.props;
    this.setState({
      profilePicture: null
    })

    onClose();
  }

  getCloseJSX() {
    return (
      <View style={styles.cancelRow}>
        <TouchableOpacity onPress={this.onClose}>
          <Icon
            type="EvilIcons"
            name='close'
            style={styles.cancelIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  getProfilePicJSX() {
    const { profilePicture } = this.state;

    return (
      <Image
        style={styles.profilePicture}
        source={{ uri: `data:image/png;base64,${profilePicture}` }}
      />
    )
  }

  getInfoJSX() {
    let {
      program,
      address,
      phone,
      affiliation,
    } = this.props.user.info;

    return (
      <View style={styles.infoBlock}>
        {program && <Text style={styles.infoText}>{'Program: ' + program}</Text>}
        {address && <Text style={styles.infoText}>{'Address: ' + address}</Text>}
        {phone && <Text style={styles.infoText}>{'Phone: ' + phone}</Text>}
        {this.props.user.username && <Text style={styles.infoText}>{'Username: ' + this.props.user.username}</Text>}
        {affiliation && <Text style={styles.infoText}>{affiliation}</Text>}
      </View>
    )

  }

  getBioJSX() {
    let {
      bio
    } = this.props.user.info;

    return (
      <View style={styles.bioBlock}>
        <AutoLink style={styles.infoText} text={bio}/>
      </View>
    )
  }

  render() {
    const {
      user: userData,
      isModalOpen,
    } = this.props;

    if (!userData) return null;

    let {
      firstName,
      lastName,
      info
    } = userData;

    if (!info) info = {}

    let {
      program,
      address,
      affiliation,
      bio
    } = info;

    var enableInfoBlock = program || address || affiliation;

    var cardHeightPreset = bio || enableInfoBlock ? styles.cardFull : styles.cardShort;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={this.onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modal}
        >
          <View style={[styles.card, cardHeightPreset]}>

            {this.getCloseJSX()}

            {this.getProfilePicJSX()}

            <Text style={styles.name}>
              {`${firstName} ${lastName}`}
            </Text>

            {enableInfoBlock && this.getInfoJSX()}

            {bio && this.getBioJSX()}

          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}