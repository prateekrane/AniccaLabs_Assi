import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../supabase'
import { useNavigation } from '@react-navigation/native'

// Helper to format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [bookmarkedPosts, setBookmarkedPosts] = useState([])
    const [loadingBookmarks, setLoadingBookmarks] = useState(false)
    const [userId, setUserId] = useState('')
    const navigation = useNavigation()
    const [authorMap, setAuthorMap] = useState({}) // { author_id: username }

    useEffect(() => {
        const fetchUser = async () => {
            const id = await AsyncStorage.getItem('user_id')
            setUserId(id)
            // Fetch user info (assuming table 'Users' with id, username, email)
            const { data, error } = await supabase.from('Users').select('username, created_at').eq('id', id).single()
            if (!error && data) setUserInfo(data)
        }
        fetchUser()
    }, [])

    useEffect(() => {
        if (!userId) return
        setLoadingBookmarks(true)
        // Get bookmarked post_ids from Post_upvotes
        supabase
            .from('Post_upvotes')
            .select('post_id')
            .eq('user_id', userId)
            .then(async ({ data, error }) => {
                if (!data || data.length === 0) {
                    setBookmarkedPosts([])
                    setLoadingBookmarks(false)
                    return
                }
                const postIds = data.map(item => item.post_id)
                // Fetch posts from Posts table
                const { data: postsData } = await supabase
                    .from('Posts')
                    .select('*')
                    .in('id', postIds)
                setBookmarkedPosts(postsData || [])
                setLoadingBookmarks(false)
                // Fetch all unique author_ids
                const authorIds = [...new Set((postsData || []).map(post => post.author_id).filter(Boolean))]
                if (authorIds.length > 0) {
                    const { data: usersData } = await supabase
                        .from('Users')
                        .select('id, username')
                        .in('id', authorIds)
                    if (usersData) {
                        const map = {}
                        usersData.forEach(u => { map[u.id] = u.username })
                        setAuthorMap(map)
                    }
                }
            })
    }, [userId])

    const renderBookmarkedPost = ({ item }) => (
        <TouchableOpacity
            style={styles.bookmarkCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SpecificPost', {
                post_id: item.id,
                title: item.title,
                description: item.description,
                image_urls: item.image_urls,
                author: authorMap[item.author_id] || 'Unknown'
            })}
        >
            {(() => {
                let imgUrl = ''
                if (item.image_urls) {
                    if (Array.isArray(item.image_urls)) {
                        imgUrl = item.image_urls[0]
                    } else if (typeof item.image_urls === 'string') {
                        try {
                            const arr = JSON.parse(item.image_urls)
                            imgUrl = Array.isArray(arr) ? arr[0] : arr
                        } catch {
                            imgUrl = item.image_urls
                        }
                    }
                }
                return imgUrl ? (
                    <Image source={{ uri: imgUrl }} style={styles.bookmarkImage} resizeMode="cover" />
                ) : (
                    <View style={styles.bookmarkImagePlaceholder} />
                )
            })()}
            <Text style={styles.bookmarkTitle} numberOfLines={2}>{item.title}</Text>
        </TouchableOpacity>
    )

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user_id')
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Profile</Text>
            {userInfo ? (
                <View style={styles.profileInfoCard}>
                    <Text style={styles.profileLabel}>Username</Text>
                    <Text style={styles.profileValue}>{userInfo.username}</Text>
                    <Text style={styles.profileLabel}>Created At</Text>
                    <Text style={styles.profileValue}>{formatDate(userInfo.created_at)}</Text>
                </View>
            ) : loadingBookmarks ? (
                <ActivityIndicator color="#00FF84" size="small" />
            ) : (
                <Text style={styles.noUserInfo}>No user info found.</Text>
            )}

            <Text style={styles.sectionHeader}>Bookmarked Posts</Text>
            {loadingBookmarks ? (
                <ActivityIndicator color="#00FF84" size="large" />
            ) : bookmarkedPosts.length === 0 ? (
                <Text style={styles.noBookmarks}>No bookmarks yet.</Text>
            ) : (
                <FlatList
                    data={bookmarkedPosts}
                    renderItem={renderBookmarkedPost}
                    keyExtractor={item => item.id?.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 8 }}
                />
            )}
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181A1B',
        padding: 16,
        paddingTop: 32,
    },
    header: {
        fontSize: 24,
        color: '#00FF84',
        fontWeight: 'bold',
        marginBottom: 18,
        marginTop: 8,
    },
    profileInfo: {
        marginBottom: 24,
        backgroundColor: '#23272A',
        borderRadius: 12,
        padding: 16,
    },
    profileLabel: {
        color: '#6ee7b7',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    profileValue: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    sectionHeader: {
        fontSize: 20,
        color: '#00FF84',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    profileInfoCard: {
        marginBottom: 24,
        backgroundColor: '#23272A',
        borderRadius: 18,
        padding: 22,
        alignItems: 'center',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    noUserInfo: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
        opacity: 0.7,
    },
    noBookmarks: {
        color: '#6ee7b7',
        fontSize: 15,
        marginTop: 12,
        textAlign: 'center',
        opacity: 0.7,
    },
    bookmarkCard: {
        backgroundColor: '#23272A',
        borderRadius: 18,
        marginRight: 18,
        width: 180,
        height: 220,
        alignItems: 'center',
        padding: 0,
        borderWidth: 0,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    bookmarkImage: {
        width: '100%',
        height: 140,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    bookmarkImagePlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: '#23272A',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderWidth: 1,
        borderColor: '#6ee7b7',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    bookmarkOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        backgroundColor: 'rgba(24,26,27,0.32)',
        zIndex: 1,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    bookmarkTitle: {
        color: '#00FF84',
        fontSize: 17,
        fontWeight: 'bold',
        marginHorizontal: 12,
        textAlign: 'center',
        position: 'absolute',
        bottom: 18,
        left: 0,
        right: 0,
        zIndex: 2,
        textShadowColor: '#181A1B',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    bookmarkAuthor: {
        color: '#6ee7b7',
        fontSize: 13,
        marginTop: 4,
        marginBottom: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    logoutBtn: {
        alignSelf: 'flex-end',
        backgroundColor: '#00FF84',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginBottom: 8,
        marginTop: 2,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutBtnText: {
        color: '#181A1B',
        fontWeight: 'bold',
        fontSize: 15,
        letterSpacing: 0.5,
    },
})