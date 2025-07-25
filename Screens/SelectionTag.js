import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { supabase } from '../supabase';

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
                    <FlatList
                        data={tags}
                        keyExtractor={item => item.id?.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.tagsContainer}
                        renderItem={({ item }) => {
                            const isSelected = selectedTags.some(t => t.id === item.id);
                            return (
                                <TouchableOpacity
                                    style={[styles.tagChip, isSelected ? styles.tagChipSelected : styles.tagChipUnselected]}
                                    onPress={() => handleTagPress(item)}
                                    disabled={!isSelected && selectedTags.length >= 5}
                                >
                                    <Text style={[styles.tagText, isSelected ? styles.tagTextSelected : styles.tagTextUnselected]}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
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
        flex: 1,
        backgroundColor: 'rgba(24,26,27,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
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
        marginBottom: 18,
    },
    tagChip: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 16,
        margin: 8,
        borderWidth: 1.5,
        minWidth: 90,
        alignItems: 'center',
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
    doneButton: {
        width: '80%',
        backgroundColor: '#00FF84',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    doneButtonText: {
        color: '#181A1B',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    closeButton: {
        width: '80%',
        backgroundColor: '#23272A',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 4,
        borderWidth: 1,
        borderColor: '#6ee7b7',
    },
    closeButtonText: {
        color: '#6ee7b7',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
