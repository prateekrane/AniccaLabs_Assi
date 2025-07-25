import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';

const SpecificPost = ({ route }) => {
    const { post_id, title, description, image_urls, author } = route.params || {};
    const [bookmarked, setBookmarked] = useState(false);
    let imageUrl = null;
    if (image_urls) {
        if (Array.isArray(image_urls)) {
            imageUrl = image_urls[0];
        } else if (typeof image_urls === 'string') {
            try {
                const arr = JSON.parse(image_urls);
                if (Array.isArray(arr) && arr.length > 0) {
                    imageUrl = arr[0];
                } else {
                    imageUrl = image_urls;
                }
            } catch {
                imageUrl = image_urls;
            }
        }
    }

    useEffect(() => {
        // On mount, check if this post is already bookmarked by this user
        const checkBookmarked = async () => {
            try {
                const user_id = await AsyncStorage.getItem('user_id');
                if (!user_id || !post_id) return;
                const { data, error } = await supabase
                    .from('Post_upvotes')
                    .select('id')
                    .eq('user_id', user_id)
                    .eq('post_id', post_id)
                    .single();
                if (data && !error) setBookmarked(true);
            } catch { }
        };
        checkBookmarked();
    }, [post_id]);

    return (
        <ScrollView contentContainerStyle={styles.outerContainer}>
            <View style={styles.card}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={{ color: '#6ee7b7', textAlign: 'center', marginTop: 70 }}>No Image</Text>
                    </View>
                )}
                <Text style={styles.title}>{title}</Text>
                <View style={styles.authorRow}>
                    <Text style={styles.authorLabel}>Author:</Text>
                    <Text style={styles.author}>{author}</Text>
                    <TouchableOpacity
                        style={styles.bookmarkIconInline}
                        onPress={async () => {
                            try {
                                const user_id = await AsyncStorage.getItem('user_id');
                                if (!user_id || !post_id) {
                                    Alert.alert('Error', 'User or Post ID missing');
                                    return;
                                }
                                if (!bookmarked) {
                                    // Bookmark (insert)
                                    const { error } = await supabase
                                        .from('Post_upvotes')
                                        .insert([{ post_id, user_id }]);
                                    if (error) {
                                        Alert.alert('Error', error.message);
                                    } else {
                                        setBookmarked(true);
                                        Alert.alert('Success', 'Post bookmarked!');
                                    }
                                } else {
                                    // Un-bookmark (delete)
                                    const { error } = await supabase
                                        .from('Post_upvotes')
                                        .delete()
                                        .eq('post_id', post_id)
                                        .eq('user_id', user_id);
                                    if (error) {
                                        Alert.alert('Error', error.message);
                                    } else {
                                        setBookmarked(false);
                                        Alert.alert('Success', 'Bookmark removed!');
                                    }
                                }
                            } catch (e) {
                                Alert.alert('Error', e.message);
                            }
                        }}
                    >
                        <Entypo name="bookmark" size={24} color={bookmarked ? '#00FF84' : '#fff'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.divider} />
                <Text style={styles.description}>{description}</Text>
            </View>
        </ScrollView>
    );
};

export default SpecificPost;

const styles = StyleSheet.create({
    outerContainer: {
        flexGrow: 1,
        backgroundColor: '#181A1B',
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#23272A',
        borderRadius: 18,
        padding: 22,
        alignItems: 'center',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
        marginTop: 32,
        marginBottom: 32,
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 14,
        marginBottom: 18,
        backgroundColor: '#181A1B',
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#00FF84',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 1,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center',
    },
    authorLabel: {
        fontSize: 15,
        color: '#6ee7b7',
        fontWeight: 'bold',
        marginRight: 6,
    },
    author: {
        fontSize: 15,
        color: '#6ee7b7',
        fontStyle: 'italic',
    },
    divider: {
        width: '80%',
        height: 1.5,
        backgroundColor: '#444',
        marginVertical: 16,
        borderRadius: 1,
    },
    description: {
        fontSize: 17,
        color: '#fff',
        textAlign: 'left',
        marginBottom: 8,
        lineHeight: 24,
    },
    bookmarkIconInline: {
        marginLeft: 10,
        padding: 2,
        backgroundColor: 'rgba(24,26,27,0.85)',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});