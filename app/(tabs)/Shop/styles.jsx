import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    header: {
        marginTop: 20,
        alignItems: 'center',
    },
    locationContainer: {
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 18,
        fontFamily: 'Gilroy-M',
        color: '#181725',
    },
    icon: {
        width: 24,
        height: 24,
    },
    mainContainer: {
        marginTop: 20,
        marginBottom: 5,
        paddingHorizontal: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F3F2',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        width: '100%',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: '#181725',
    },
    carouselContainer: {
        marginTop: 20,
        marginBottom: 5,
        alignItems: 'center',
    },
    carouselItem: {
        flex: 1,
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 20,
        height: '100%',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        resizeMode: 'cover',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        transition: 'width 0.3s ease',
    },
    closeButton: {
        backgroundColor: '#53B175',
        padding: 6,
        borderRadius: 50,
        marginLeft: 8,
    },
    firstContainer: {
        marginTop: 20,
        paddingHorizontal: 0,
    },
    firstContainerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllButton: {
        padding: 4,
    },
    seeAllText: {
        fontSize: 14,
        color: '#53B175',
    },
    flatListContentContainer: {
        paddingHorizontal: 10,
    },
    productCard: {
        width: (width - 40) / 2,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        minHeight: 230,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    productImage: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 5
    },
    productName: {
        fontSize: 16,
        color: '#181725',
        fontFamily: 'Gilroy-B',
        marginTop: 8,
        paddingHorizontal: 2
    },
    productPieces: {
        fontSize: 14,
        fontFamily: 'Gilroy-M',
        color: '#7C7C7C',
        marginTop: 4,
        paddingHorizontal: 2
    },
    productPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginTop: 10,
    },
    productPrice: {
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: '#181725',
    },
    addButton: {
        backgroundColor: "#53B175",
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
    },
    categoryCard: {
        width: 230,
        height: 100,
        marginHorizontal: 8,
        padding: 15,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    categoryName: {
        fontSize: 16,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginLeft: 15,
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    searchCategoriesContainer: {
        height: 120,
        marginVertical: 10,
    },
    searchCategoriesContent: {
        paddingHorizontal: 10,
    },
    searchCategoryItem: {
        marginRight: 8,
    },
});