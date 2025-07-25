import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AllScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('Posts')
                .select('id, title, description, image_urls, author_id, Users (username)')
                .order('created_at', { ascending: false });
            if (error) {
                console.log('Error fetching posts:', error.message);
            } else {
                setPosts(data || []);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const renderItem = ({ item }) => {
        let imageUrl = null;
        if (item.image_urls) {
            if (Array.isArray(item.image_urls)) {
                imageUrl = item.image_urls[0];
            } else if (typeof item.image_urls === 'string') {
                // If image_urls is a stringified array or a single URL
                try {
                    const arr = JSON.parse(item.image_urls);
                    if (Array.isArray(arr) && arr.length > 0) {
                        imageUrl = arr[0];
                    } else {
                        imageUrl = item.image_urls;
                    }
                } catch {
                    imageUrl = item.image_urls;
                }
            }
        }
        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('SpecificPost', {
                    post_id: item.id,
                    title: item.title,
                    description: item.description,
                    image_urls: item.image_urls,
                    author: item.Users?.username || 'Unknown',
                })}
            >
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={{ color: '#6ee7b7', textAlign: 'center', marginTop: 70 }}>No Image</Text>
                    </View>
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.author}>By: {item.Users?.username || 'Unknown'}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#00FF84" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingTop: 64, paddingBottom: 32 }}
                />
            )}
        </View>
    );
};

export default AllScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181A1B',
        paddingHorizontal: 12,
    },
    card: {
        backgroundColor: '#23272A',
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: '#181A1B',
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00FF84',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: '#fff',
        marginBottom: 8,
    },
    author: {
        fontSize: 13,
        color: '#6ee7b7',
        marginTop: 4,
        fontStyle: 'italic',
    },
});