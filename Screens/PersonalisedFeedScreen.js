import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SelectionTag from './SelectionTag';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';

const PersonalisedFeedScreen = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]); // for multi-select
    const [tagPosts, setTagPosts] = useState([]);
    const [showTagModal, setShowTagModal] = useState(false);
    const [loadingUserPosts, setLoadingUserPosts] = useState(false);
    const [loadingTagPosts, setLoadingTagPosts] = useState(false);
    const [userId, setUserId] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserIdAndTags = async () => {
            const id = await AsyncStorage.getItem('user_id');
            setUserId(id);
            // Fetch tags
            const { data, error } = await supabase.from('Tags').select('id, name');
            if (!error && data) setTags(data);
        };
        fetchUserIdAndTags();
    }, []);

    useEffect(() => {
        if (!userId) return;
        setLoadingUserPosts(true);
        supabase
            .from('Posts')
            .select('*, Users(username)')
            .eq('author_id', userId)
            .then(({ data, error }) => {
                setUserPosts(data || []);
                setLoadingUserPosts(false);
            });
    }, [userId]);

    useEffect(() => {
        if (!selectedTags || selectedTags.length === 0) {
            setTagPosts([]);
            return;
        }
        setLoadingTagPosts(true);
        // Get post_ids from Post_tags for selected tag(s)
        const tagIds = selectedTags.map(t => t.id);
        supabase
            .from('Post_tags')
            .select('post_id, tag_id')
            .in('tag_id', tagIds)
            .then(async ({ data, error }) => {
                if (!data || data.length === 0) {
                    setTagPosts([]);
                    setLoadingTagPosts(false);
                    return;
                }
                // Get unique postIds
                const postIds = [...new Set(data.map(pt => pt.post_id))];
                // Fetch posts with those ids, including Users.username
                const { data: postsData } = await supabase
                    .from('Posts')
                    .select('*, Users(username)')
                    .in('id', postIds);
                setTagPosts(postsData || []);
                setLoadingTagPosts(false);
            });
    }, [selectedTags]);

    const renderUserPost = ({ item }) => (
        <TouchableOpacity
            style={styles.cardModernRedesigned}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('SpecificPost', {
                post_id: item.id,
                title: item.title,
                description: item.description,
                image_urls: item.image_urls,
                author: item.Users?.username || 'Unknown'
            })}
        >
            <View style={styles.cardModernImageWrapperRedesigned}>
                {(() => {
                    let imgUrl = '';
                    if (item.image_urls) {
                        if (Array.isArray(item.image_urls)) {
                            imgUrl = item.image_urls[0];
                        } else if (typeof item.image_urls === 'string') {
                            try {
                                const arr = JSON.parse(item.image_urls);
                                imgUrl = Array.isArray(arr) ? arr[0] : arr;
                            } catch {
                                imgUrl = item.image_urls;
                            }
                        }
                    }
                    return imgUrl ? (
                        <Image
                            source={{ uri: imgUrl }}
                            style={styles.cardModernImageRedesigned}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.cardModernImagePlaceholderRedesigned} />
                    );
                })()}
                <View style={styles.cardModernOverlay} />
                <Text style={styles.cardModernTitleRedesigned} numberOfLines={2}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderTagPost = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
        </View>
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#181A1B' }} contentContainerStyle={{ padding: 16, paddingTop: 34, paddingBottom: 32 }}>
            <Text style={styles.header}>Your Feeds</Text>
            {loadingUserPosts ? (
                <ActivityIndicator color="#00FF84" size="large" />
            ) : (
                <FlatList
                    data={userPosts}
                    renderItem={renderUserPost}
                    keyExtractor={item => item.id?.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 8 }}
                    scrollEnabled={true}
                    contentContainerStyle={{ gap: 12 }}
                />
            )}

            <Text style={styles.header}>Interested Posts</Text>
            {/* Move Select Tags button below Your Feeds */}
            <TouchableOpacity
                style={styles.selectTagsButton}
                onPress={() => setShowTagModal(true)}
            >
                <Text style={styles.selectTagsButtonText}>
                    {selectedTags.length === 0 ? 'Select Tags' : `Selected (${selectedTags.length})`}
                </Text>
            </TouchableOpacity>
            <View style={{ height: 18 }} />
            {loadingTagPosts ? (
                <ActivityIndicator color="#00FF84" size="large" />
            ) : tagPosts.length === 0 ? (
                <Text style={styles.noTagPosts}>No posts found for selected tags.</Text>
            ) : (
                <FlatList
                    data={tagPosts}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.tagPostCardVertical}
                            activeOpacity={0.88}
                            onPress={() => navigation.navigate('SpecificPost', {
                                post_id: item.id,
                                title: item.title,
                                description: item.description,
                                image_urls: item.image_urls,
                                author: item.Users?.username || 'Unknown'
                            })}
                        >
                            <View style={styles.tagPostImageWrapperVertical}>
                                {(() => {
                                    let imgUrl = '';
                                    if (item.image_urls) {
                                        if (Array.isArray(item.image_urls)) {
                                            imgUrl = item.image_urls[0];
                                        } else if (typeof item.image_urls === 'string') {
                                            try {
                                                const arr = JSON.parse(item.image_urls);
                                                imgUrl = Array.isArray(arr) ? arr[0] : arr;
                                            } catch {
                                                imgUrl = item.image_urls;
                                            }
                                        }
                                    }
                                    return imgUrl ? (
                                        <Image
                                            source={{ uri: imgUrl }}
                                            style={styles.tagPostImageVertical}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={styles.tagPostImagePlaceholderVertical} />
                                    );
                                })()}
                            </View>
                            <Text style={styles.tagPostTitleVertical} numberOfLines={2}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id?.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
                    style={{ marginTop: 0, marginBottom: 16 }}
                    scrollEnabled={false}
                />
            )}
            <SelectionTag
                visible={showTagModal}
                onClose={() => setShowTagModal(false)}
                onSelectTags={tags => setSelectedTags(tags)}
                initialSelected={selectedTags}
            />
        </ScrollView>
    );
};

export default PersonalisedFeedScreen;

const styles = StyleSheet.create({
    cardModern: {
        backgroundColor: '#23272A',
        borderRadius: 14,
        marginRight: 10,

        width: "100%",
        height: -40,
        alignItems: 'center',
        padding: 0,
        borderWidth: 1,
        borderColor: '#2dce89',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    cardModernImageWrapper: {
        width: '100%',
        height: 80,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#181A1B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardModernImage: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
    },
    cardModernImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#23272A',
        borderWidth: 1,
        borderColor: '#6ee7b7',
    },
    cardModernTitle: {
        color: '#00FF84',
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: 8,
        marginHorizontal: 8,
        textAlign: 'center',
    },
    selectTagsButton: {
        backgroundColor: '#00FF84',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 2,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 3,
    },
    selectTagsButtonText: {
        color: '#181A1B',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    header: {
        fontSize: 22,
        color: '#00FF84',
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    card: {
        backgroundColor: 'transparent',
        borderRadius: 16,
        marginRight: 14,
        marginBottom: 10,
        minWidth: 160,
        maxWidth: 200,
        alignItems: 'center',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    cardImageWrapper: {
        width: 140,
        height: 100,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#23272A',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 16,
    },
    cardImagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        backgroundColor: '#23272A',
        borderWidth: 1,
        borderColor: '#6ee7b7',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 38,
        backgroundColor: 'rgba(24,26,27,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitleOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 10,
        right: 10,
        color: '#00FF84',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        zIndex: 2,
    },
    cardDesc: {
        color: '#fff',
        fontSize: 15,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 10,
    },
    tagChip: {
        paddingVertical: 7,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 4,
        borderWidth: 1.5,
    },
    tagChipSelected: {
        backgroundColor: '#00FF84',
        borderColor: '#00FF84',
    },
    tagChipUnselected: {
        backgroundColor: '#23272A',
        borderColor: '#6ee7b7',
        opacity: 0.5,
    },
    tagText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    tagTextSelected: {
        color: '#181A1B',
    },
    tagTextUnselected: {
        color: '#6ee7b7',
    },
    cardModernRedesigned: {
        backgroundColor: '#23272A',
        borderRadius: 18,
        marginRight: 18,
        width: 180,
        height: 180,
        alignItems: 'center',
        padding: 0,
        borderWidth: 0,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
    },
    cardModernImageWrapperRedesigned: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#181A1B',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
    },
    cardModernImageRedesigned: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cardModernImagePlaceholderRedesigned: {
        width: '100%',
        height: '100%',
        backgroundColor: '#23272A',
        borderWidth: 1,
        borderColor: '#6ee7b7',
        borderRadius: 18,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cardModernOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(24,26,27,0.82)',
        zIndex: 1,
    },
    cardModernTitleRedesigned: {
        color: '#00FF84',
        fontSize: 15,
        fontWeight: 'bold',
        marginHorizontal: 12,
        marginBottom: 14,
        textAlign: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        zIndex: 2,
        textShadowColor: '#181A1B',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    noTagPosts: {
        color: '#6ee7b7',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 12,
        opacity: 0.7,
    },
    tagPostCardVertical: {
        backgroundColor: '#23272A',
        borderRadius: 16,
        marginHorizontal: 0,
        minWidth: 0,
        maxWidth: '100%',
        alignItems: 'center',
        padding: 0,
        borderWidth: 0,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        marginBottom: 0,
    },
    tagPostImageWrapperVertical: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#181A1B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagPostImageVertical: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    tagPostImagePlaceholderVertical: {
        width: '100%',
        height: '100%',
        backgroundColor: '#23272A',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        borderColor: '#6ee7b7',
    },
    tagPostTitleVertical: {
        color: '#00FF84',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 12,
        marginHorizontal: 12,
        textAlign: 'center',
    },
});