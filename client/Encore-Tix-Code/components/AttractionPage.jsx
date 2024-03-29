import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import moment from "moment"
import { COLORS } from "../assets/theme"

const AttractionPage = () => {

  const route = useRoute();
  const { attractionId } = route.params;
  const [attraction, setAttraction] = useState({})
  const [events, setEvents] = useState({})
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://192.168.1.144:4000/api/attractions/one/${attractionId}`);
        const json = await res.json();
        setAttraction(json.singleData);
        setEvents(json.eventData)
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLinkPress = (url) => {
    if (!url) {
      return
    }
    Linking.openURL(url);
  };

  const formatDate = (date) => {
    const formattedDate = moment(date).format('dddd, MMMM DD, YYYY');
    return formattedDate.toUpperCase();
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleLinkPress(item.url)}>
      <View style={styles.individualEvent}>
        <Image
          source={item.images ? { uri: item.images[0].url } : require('../assets/images/placeholder.jpg')}
          style={styles.eventImage}
        />
        <View style={{  justifyContent: "center"}}>
          <Text>{formatDate(item.dates?.start?.localDate)}</Text>
          <Text style={{fontWeight: "bold", marginTop: 5, marginBottom: 5}}>{item.name}</Text>
          <Text>{item._embedded?.venues[0]?.name}, {item._embedded?.venues[0]?.city?.name}, {item._embedded?.venues[0]?.state?.stateCode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: attraction.images?.length > 0 ? attraction.images[0]?.url : null
        }}
        style={styles.mainImage}
      />
      <View style={styles.attraction}>
        <Text style={styles.bandName}>{attraction.name}</Text>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity onPress={() => handleLinkPress(attraction.externalLinks?.twitter[0]?.url)}>
            <Image source={require("../assets/images/twitter.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLinkPress(attraction.externalLinks?.youtube[0]?.url)}>
            <Image source={require("../assets/images/youtube.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLinkPress(attraction.externalLinks?.spotify[0]?.url)}>
            <Image source={require("../assets/images/spotify.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLinkPress(attraction.url)}>
            <Image source={require("../assets/images/website_icon.png")} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={events._embedded?.events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.eventsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ET_XLIGHT_BLUE
  },
  mainImage: {
    width: "100%",
    height: "100%",
    maxHeight: 300
  },
  attraction: {
    width: "100%",
    flexDirection: "row",
    alignContent: "space-around",
    marginTop: 20,
    marginBottom: 20
  },
  bandName: {
    flex: 1,
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 20
  },
  eventsContainer: {
    marginBottom: 15,
    padding: 15
  },
  eventImage: {
    height: 120,
    width: "100%",
    maxWidth: 150,
    marginRight: 10
  },
  individualEvent: {
    height: 120,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 15
  }
});

export default AttractionPage;
