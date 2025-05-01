import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        padding: 20,
    },
    headerText: {
        fontSize: 20,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginBottom: 20,
        alignSelf: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
        borderColor: '#E2E2E2',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemImage: {
        width: 70,
        height: 70,
    },
    itemDetails: {
        marginLeft: 16,
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginBottom: 4,
    },
    itemPieces: {
        fontSize: 14,
        fontFamily: 'Gilroy-M',
        color: '#7C7C7C',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemPrice: {
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: '#181725',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E2E2',
        marginTop: 'auto',
    },
    nextButton: {
        padding: 8,
    },
    fixedButtonContainer: {
        backgroundColor: '#fff',
        paddingBottom: 20,
    },
    checkoutButton: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 18,
        backgroundColor: '#53B175',
        marginBottom: Platform.OS === 'ios' ? 20 : 40,
    },
    totalText: {
        fontSize: 18,
        fontFamily: 'Gilroy-B',
        color: 'white',
    },
    totalAmountContainer: {
        backgroundColor: '#489E67',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    totalAmount: {
        fontSize: 16,
        fontFamily: 'Gilroy-B',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E2E2',
        marginBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#7C7C7C',
    },
});