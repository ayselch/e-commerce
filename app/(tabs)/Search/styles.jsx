import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerText: {
        fontSize: 20,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F3F2',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: '#181725',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginVertical: 15,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    categoryCard: {
        width: (width - 60) / 2,
        aspectRatio: 1,
        marginBottom: 20,
        borderRadius: 18,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryImage: {
        width: '60%',
        height: '60%',
        resizeMode: 'contain',
    },
    categoryName: {
        fontSize: 16,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginTop: 10,
        textAlign: 'center',
    },
    resultsList: {
        paddingBottom: 20,
    },
    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    noResultsText: {
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: '#7C7C7C',
        textAlign: 'center',
    },
    clearButton: {
        backgroundColor: '#53B175',
        padding: 6,
        borderRadius: 50,
        marginLeft: 8,
    },
    searchResultCard: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    resultImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    resultDetails: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    resultName: {
        fontSize: 16,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginBottom: 5,
    },
    resultDescription: {
        fontSize: 14,
        fontFamily: 'Gilroy-M',
        color: '#7C7C7C',
    },
});