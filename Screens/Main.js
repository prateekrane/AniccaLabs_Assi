import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import AllScreen from './AllScreen';
import PersonalisedFeedScreen from './PersonalisedFeedScreen';
import CreatePost from './CreatePost';

function ProfileScreen({ navigation }) {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('user_id');
        navigation.replace('Login');
    };
    return (
        <View style={styles.tabContainer}>
            <Text style={styles.tabTitle}>Profile</Text>
            <View style={{ marginTop: 24 }}>
                <Text style={styles.profileText}>User Profile Info Here</Text>
                <View style={{ marginTop: 24 }}>
                    <Text style={styles.logoutLabel}>Logout</Text>
                    <View style={{ marginTop: 8 }}>
                        <Text style={styles.logoutButton} onPress={handleLogout}>Logout</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const Tab = createBottomTabNavigator();

const Main = () => {
    return (
        <Tab.Navigator
            initialRouteName="All"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#00FF84',
                tabBarInactiveTintColor: '#6ee7b7',
                tabBarStyle: { backgroundColor: '#181A1B', borderTopColor: '#23272A' },
            }}
        >
            <Tab.Screen
                name="All"
                component={AllScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Personalised Feed"
                component={PersonalisedFeedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dynamic-feed" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Create Post"
                component={CreatePost}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="plus" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default Main

const styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#181A1B',
    },
    tabTitle: {
        fontSize: 24,
        color: '#00FF84',
        fontWeight: 'bold',
    },
    profileText: {
        color: '#6ee7b7',
        fontSize: 16,
    },
    logoutLabel: {
        color: '#6ee7b7',
        fontSize: 15,
        marginBottom: 4,
    },
    logoutButton: {
        backgroundColor: '#00FF84',
        color: '#181A1B',
        fontWeight: 'bold',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 8,
        textAlign: 'center',
        overflow: 'hidden',
    },
});