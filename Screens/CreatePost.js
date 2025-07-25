import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [tagMap, setTagMap] = useState({}); // { name: id }

    useEffect(() => {
        const getAuthorId = async () => {
            const id = await AsyncStorage.getItem('user_id');
            if (id) setAuthorId(id);
        };
        const fetchTags = async () => {
            const { data, error } = await supabase.from('Tags').select('id, name');
            if (!error && data) {
                setTags(data.map(tag => tag.name));
                const map = {};
                data.forEach(tag => { map[tag.name] = tag.id; });
                setTagMap(map);
            }
        };
        getAuthorId();
        fetchTags();
    }, []);

    const handleCreatePost = async () => {
        if (!title || !description || !imageUrl || !authorId || !selectedTag) {
            Alert.alert('Missing Fields', 'Please fill all fields and select a tag.');
            return;
        }
        setLoading(true);
        // Log the data being sent to Posts table
        const postPayload = {
            title: title,
            description: description,
            image_urls: [imageUrl],
            author_id: authorId,
        };

        // Insert post into Supabase
        const { data: postData, error: postError } = await supabase
            .from('Posts')
            .insert([postPayload])
            .select();
        if (postError || !postData || !postData[0]) {
            setLoading(false);
            Alert.alert('Error Got', postError ? postError.message : 'Post creation failed.');
            return;
        }
        // Get post_id and tag_id
        const post_id = postData[0].id;
        const tag_id = tagMap[selectedTag];
        // Insert into Post_tags
        const { error: postTagError } = await supabase
            .from('Post_tags')
            .insert([
                {
                    post_id,
                    tag_id,
                },
            ]);
        setLoading(false);
        if (postTagError) {
            Alert.alert('Error', postTagError.message);
        } else {
            Alert.alert('Success', 'Post created successfully!');
            setTitle('');
            setDescription('');
            setImageUrl('');
            setSelectedTag(null);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#181A1B' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.header}>Create a New Post</Text>
                <View style={styles.formCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        placeholderTextColor="#6ee7b7"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        placeholderTextColor="#6ee7b7"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Image URL"
                        placeholderTextColor="#6ee7b7"
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        autoCapitalize="none"
                    />
                    {/* Tags Section */}
                    <View style={styles.tagsSection}>
                        <Text style={styles.tagsLabel}>Tags:</Text>
                        <View style={styles.tagsRow}>
                            {tags.map((tag, idx) => {
                                const isSelected = selectedTag === tag;
                                return (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[styles.tagChip, isSelected ? styles.tagChipSelected : styles.tagChipUnselected]}
                                        activeOpacity={isSelected ? 1 : 0.8}
                                        disabled={!!selectedTag && !isSelected}
                                        onPress={() => {
                                            if (isSelected) {
                                                setSelectedTag(null);
                                            } else {
                                                setSelectedTag(tag);
                                            }
                                        }}
                                    >
                                        <Text style={[styles.tagText, isSelected ? styles.tagTextSelected : styles.tagTextUnselected]}>{tag}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={styles.authorRow}>
                        <Text style={styles.authorLabel}>Author ID:</Text>
                        <Text style={styles.authorValue}>****</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreatePost}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        <Text style={styles.createButtonText}>{loading ? 'Creating...' : 'Create Post'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreatePost;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#181A1B',
        paddingTop: 56,
        paddingBottom: 32,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 26,
        color: '#00FF84',
        fontWeight: 'bold',
        marginBottom: 24,
        letterSpacing: 1,
        textAlign: 'center',
    },
    formCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#23272A',
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    input: {
        width: '100%',
        height: 44,
        borderColor: '#00FF84',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        color: '#fff',
        backgroundColor: '#181A1B',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        alignSelf: 'flex-start',
    },
    authorLabel: {
        color: '#6ee7b7',
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 8,
    },
    authorValue: {
        color: '#00FF84',
        fontSize: 15,
        fontWeight: 'bold',
    },
    tagsSection: {
        width: '100%',
        marginBottom: 18,
        alignSelf: 'flex-start',
    },
    tagsLabel: {
        color: '#6ee7b7',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
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
    createButton: {
        width: '100%',
        backgroundColor: '#00FF84',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    createButtonText: {
        color: '#181A1B',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});