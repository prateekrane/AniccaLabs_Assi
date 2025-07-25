import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';

const SpecificPost = ({ route }) => {
    const { title, description, image_urls, author } = route.params || {};
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
});