import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import LoadingPage from '../../components/LoadingPage';
import UseFetchLeaderBoard from '../../hooks/UseFetchLeaderBoard';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

export default function Leaderboard() {
  const theme = useTheme();
  const { data, isLoading, refetch } = UseFetchLeaderBoard();
  const sortedData = data?.data?.sort((a, b) => b.totalScore - a.totalScore) || [];

  const getRank = (rank) => sortedData[rank - 1] || null;

  const renderPodium = (position) => {
    const rank = getRank(position);
    const podiumColors = {
      1: theme.colors.highlight,
      2: theme.colors.info,
      3: theme.colors.warning
    };

    return (
      <View key={position} style={{
        alignItems: 'center',
        marginHorizontal: theme.metrics.spacing.dense,
        marginBottom: position === 1 
          ? theme.metrics.spacing.comfortable 
          : theme.metrics.spacing.dense
      }}>
        <LinearGradient
          colors={podiumColors[position]}
          style={{
            width: 96,
            height: position === 1 ? 128 : 96,
            borderTopLeftRadius: theme.metrics.borderRadius.medium,
            borderTopRightRadius: theme.metrics.borderRadius.medium,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.effects.shadow
          }}
          start={theme.isDarkMode ? { x: 0, y: 0 } : { x: 1, y: 0 }}
          end={theme.isDarkMode ? { x: 1, y: 1 } : { x: 0, y: 1 }}
        >
          <Ionicons 
            name={position === 1 ? 'trophy' : position === 2 ? 'medal' : 'ribbon'}
            size={theme.metrics.iconSize.large}
            color={"#FFD700"}
          />
        </LinearGradient>
        <View style={{
          backgroundColor: theme.colors.card[0],
          padding: theme.metrics.spacing.dense,
          borderRadius: theme.metrics.borderRadius.medium,
          width: '100%',
          alignItems: 'center',
          ...theme.effects.shadow
        }}>
          <Image
            style={{
              width: 48,
              height: 48,
              borderRadius: theme.metrics.borderRadius.pill,
              borderWidth: 2,
              borderColor: theme.colors.contrastText,
              marginTop: -theme.metrics.spacing.comfortable
            }}
            source={{ uri: rank?.avatar || 'https://avatar.iran.liara.run/public/44' }}
          />
          <Text style={{
            color: theme.colors.primaryText,
            fontWeight: theme.typography.fontWeights.bold,
            marginTop: theme.metrics.spacing.dense,
            letterSpacing: theme.typography.letterSpacing.tight
          }} numberOfLines={1}>
            {rank?.user || 'Anonymous'}
          </Text>
          <Text style={{
            color: theme.colors.secondaryText,
            fontSize: 14,
            fontWeight: theme.typography.fontWeights.medium
          }}>
            {rank?.totalScore || 0} pts
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={theme.colors.background}
      style={{ flex: 1, paddingTop: theme.metrics.spacing.comfortable }}
    >
      <Header name="Leaderboard" showback={false} />
      <StatusBar style={theme.isDarkMode ? "light" : "dark"} />
      {isLoading && <LoadingPage accentColor={theme.colors.accent} />}

      {/* Podium Section */}
      <View style={{ height: '40%', justifyContent: 'flex-end' }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}>
          {renderPodium(2)}
          {renderPodium(1)}
          {renderPodium(3)}
        </View>
      </View>

      {/* Leaderboard List */}
      <View style={{
        flex: 1,
        borderTopLeftRadius: theme.metrics.borderRadius.large,
        borderTopRightRadius: theme.metrics.borderRadius.large,
        padding: theme.metrics.spacing.comfortable,
        backgroundColor: theme.colors.card[0],
        ...theme.effects.shadow
      }}>
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={theme.colors.accent}
              progressBackgroundColor={theme.colors.card[0]}
            />
          }
          renderItem={({ item, index }) => (
            <View key={
              item?._id || index
            } style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: theme.metrics.spacing.dense,
              borderRadius: theme.metrics.borderRadius.soft,
              marginBottom: theme.metrics.spacing.dense,
              backgroundColor: theme.colors.background[1],
              ...theme.effects.shadow
            }}>
              <Text style={{
                color: theme.colors.primaryText,
                fontWeight: theme.typography.fontWeights.bold,
                minWidth: 40
              }}>
                #{index + 1}
              </Text>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.metrics.borderRadius.pill,
                  borderWidth: 1,
                  borderColor: theme.colors.accent,
                  marginRight: theme.metrics.spacing.dense
                }}
                source={{ uri: item.avatar || 'https://avatar.iran.liara.run/public/44' }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: theme.colors.primaryText,
                  fontWeight: theme.typography.fontWeights.semiBold,
                  letterSpacing: theme.typography.letterSpacing.tight
                }} numberOfLines={1}>
                  {item.user}
                </Text>
                <Text style={{
                  color: theme.colors.secondaryText,
                  fontSize: 14
                }}>
                  {item.totalScore} points
                </Text>
              </View>
              {index < 3 && (
                <Ionicons
                  name={index === 0 ? 'trophy' : index === 1 ? 'medal' : 'ribbon'}
                  size={theme.metrics.iconSize.medium}
                  color={"#FFD700"}
                />
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: theme.metrics.spacing.expansive
            }}>
              <Ionicons 
                name="sad-outline" 
                size={theme.metrics.iconSize.large} 
                color={theme.colors.secondaryText} 
              />
              <Text style={{
                color: theme.colors.secondaryText,
                marginTop: theme.metrics.spacing.dense,
                fontWeight: theme.typography.fontWeights.medium
              }}>
                No leaderboard data available
              </Text>
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
}