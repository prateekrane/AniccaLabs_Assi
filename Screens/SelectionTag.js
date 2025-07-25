import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image } from 'react-native';
import { supabase } from '../supabase';

// Placeholder image for tags without image
const placeholderImg = require('../assets/logo.png');

const SelectionTag = ({ visible, onClose, onSelectTags, initialSelected = [] }) => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(initialSelected);

    useEffect(() => {
        const fetchTags = async () => {
            const { data, error } = await supabase.from('Tags').select('id, name');
            if (!error && data) setTags(data);
        };
        fetchTags();
    }, []);

    const handleTagPress = (tag) => {
        const alreadySelected = selectedTags.some(t => t.id === tag.id);
        if (alreadySelected) {
            setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
        } else if (selectedTags.length < 5) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleDone = () => {
        onSelectTags(selectedTags);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.header}>Select up to 5 Tags</Text>
                    <ScrollView contentContainerStyle={styles.tagsContainer} keyboardShouldPersistTaps="handled">
                        <View style={styles.tagsRowWrap}>
                            {tags.map(item => {
                                const isSelected = selectedTags.some(t => t.id === item.id);
                                // If your Tags table has an image field, use item.image_url, else use placeholder
                                let imgUrl = item.image_url || null;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.tagChip, isSelected ? styles.tagChipSelected : styles.tagChipUnselected]}
                                        onPress={() => handleTagPress(item)}
                                        disabled={!isSelected && selectedTags.length >= 5}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.tagImageWrapper}>
                                            <Image
                                                source={imgUrl ? { uri: imgUrl } : placeholderImg}
                                                style={styles.tagImage}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <Text
                                            style={[styles.tagText, isSelected ? styles.tagTextSelected : styles.tagTextUnselected]}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={handleDone}
                        disabled={selectedTags.length === 0}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SelectionTag;

const styles = StyleSheet.create({
    overlay: {
        flex: 0.5,
        backgroundColor: 'rgba(24,26,27,0.35)', // more transparent
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 250,
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#23272A',
        borderRadius: 18,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        fontSize: 20,
        color: '#00FF84',
        fontWeight: 'bold',
        marginBottom: 18,
        textAlign: 'center',
    },
    tagsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 2,
        flexGrow: 1,
    },
    tagsRowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    tagChip: {
        width: 70,
        height: 80,
        borderRadius: 14,
        margin: 3,
        borderWidth: 1.2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        overflow: 'hidden',
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
    tagImageWrapper: {
        width: 38,
        height: 38,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#23272A',
        marginBottom: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    tagText: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        maxWidth: 60,
    },
    tagTextSelected: {
        color: '#181A1B',
    },
    tagTextUnselected: {
        color: '#6ee7b7',
    },
    doneButton: {
        width: '55%',
        backgroundColor: '#00FF84',
        paddingVertical: 8,
        borderRadius: 7,
        alignItems: 'center',
        marginTop: 26,
        marginBottom: 16,
    },
    doneButtonText: {
        color: '#181A1B',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    closeButton: {
        width: '55%',
        backgroundColor: '#23272A',
        paddingVertical: 7,
        borderRadius: 7,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6ee7b7',
    },
    closeButtonText: {
        color: '#6ee7b7',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
