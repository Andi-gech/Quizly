import { View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import SearchComponent from '../../components/SearchComponent';
import CatagorySelector from '../../components/CatagorySelector';
import LiveQuizCard from '../../components/LiveQuizCard';
import CatagoryCard from '../../components/CatagoryCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import UseFetchLiveQuizes from '../../hooks/UseFetchLiveQuizes';
import UseFetchCatagories from '../../hooks/UseFetchCatagories';
import RotatingBallsLoader from '../../components/LoadingIndicater';
export default function search() {
  const selections = ["Top", "Recents", "Categories"];

  const [selected, setSelected] = useState("Categories");
  const {data,isLoading}=UseFetchCatagories()
  const [params, setParams] = useState({
   
  });
  const { data:quiz,refetch,isFetching:isfeching } = UseFetchLiveQuizes(params)
  useEffect(() => {
    refetch()
  }, [params])

  const handleSelection = (name) => {
   
    if (selected === "Top") {
      setParams({
        sortByHistory: true,
      })
    }
  

    setSelected(name);
  };

  const CaseSelector = () => {
    switch (selected) {
      case "Top":
        return (
          <FlatList
          data={quiz?.data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <LiveQuizCard key={item._id} data={item} />}
       
          />
        );
      case "Recents":
        return (
          <View className="flex items-center justify-center flex-col">
          <FlatList
            data={quiz?.data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <LiveQuizCard key={item._id} data={item} />}
          />
          </View>
        );
      case "Categories":
        return (
          
          <View className="flex flex-row  flex-wrap justify-center">
            {data?.data?.map((item)=><CatagoryCard key={item._id} onpress={
              ()=>{
                setParams({
                  catagory:item._id
                })
                setSelected("Search")
              }
            } icon={<MaterialCommunityIcons name={item.FontAwesomeIconName} size={24} color="black" />} name={item.title}/>)}

          </View>
        );

      case "Search":
        return (
          <FlatList
            data={quiz?.data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <LiveQuizCard key={item._id} data={item} />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex relative flex-1 flex-col bg-indigo-500 items-center justify-end pt-[20px]">
      <View className="h-[20%] w-full px-[10px] flex items-center justify-start">
        <Header name={"Discover Quiz"} />
        <SearchComponent onChangeText={
          (text) => {setParams({  searchTitle: text})
          setSelected("recents")}
        } />
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
        {(isfeching||isLoading) && <RotatingBallsLoader color={"rgba(0,0,0,0.3)"}  />}

        <View className="w-full px-[10px] h-[90%] pb-[100px]">
          {CaseSelector()}
        </View>
     
      </View>
    </View>
  );
}
