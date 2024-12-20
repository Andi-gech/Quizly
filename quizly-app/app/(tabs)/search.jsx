import { View, FlatList } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import SearchComponent from '../../components/SearchComponent';
import CatagorySelector from '../../components/CatagorySelector';
import LiveQuizCard from '../../components/LiveQuizCard';
import CatagoryCard from '../../components/CatagoryCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Feather, Ionicons } from '@expo/vector-icons';
export default function search() {
  const selections = ["Top", "Recents", "Categories"];
  const [selected, setSelected] = useState("Categories");

  const handleSelection = (name) => {
    setSelected(name);
  };

  const CaseSelector = () => {
    switch (selected) {
      case "Top":
        return (
          <FlatList
            data={[{ key: 'a' }, { key: 'b' }]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <LiveQuizCard />}
          />
        );
      case "Recents":
        return (
          <FlatList
            data={[{ key: 'a' }, { key: 'b' }, { key: '4' }]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <LiveQuizCard />}
          />
        );
      case "Categories":
        return (
          
          <View className="flex flex-row  flex-wrap justify-between">
            <CatagoryCard icon={<Ionicons name='code' size={23} color={"black"}/>} />
            <CatagoryCard icon={<Ionicons name='headset' size={24} color={"black"}/>}/>
            <CatagoryCard icon={<MaterialCommunityIcons name="finance" size={24} color="black" />} />
            <CatagoryCard icon={<Feather name="file-plus" size={24} color="black" />}/>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex relative flex-1 flex-col bg-indigo-500 items-center justify-end pt-[20px]">
      <View className="h-[20%] w-full px-[10px] flex items-center justify-start">
        <Header name={"Discover Quiz"} />
        <SearchComponent />
      </View>

      <View className="flex items-center justify-start flex-col bg-white h-[80%] w-[98%] rounded-[30px]">
        <View className="flex items-center justify-center flex-row w-full mb-3 h-[10%]">
          <CatagorySelector
            name="Top"
            selected={selected === "Top"}
            onPress={() => handleSelection("Top")}
          />
          <CatagorySelector
            name="Recents"
            selected={selected === "Recents"}
            onPress={() => handleSelection("Recents")}
          />
          <CatagorySelector
            name="Categories"
            selected={selected === "Categories"}
            onPress={() => handleSelection("Categories")}
          />
        </View>

        <View className="w-full px-[10px] h-[90%]">
          {CaseSelector()}
        </View>
      </View>
    </View>
  );
}
