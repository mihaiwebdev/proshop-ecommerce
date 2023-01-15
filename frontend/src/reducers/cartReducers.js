export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch(action.type) {

        case 'CART_ADD_ITEM':
            const item = action.payload
            const existItem = state.cartItems.find(x => x.product === item.product)

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => x.product === existItem.product
                        ? item : x)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        
        case 'CART_REMOVE_ITEM':
            const removedItem = action.payload
            return {
                ...state,
                cartItems: state.cartItems.filter((item) => item.product !== removedItem)
            }
        
        case 'CART_CLEAR_ITEM':
            return {
                ...state,
                cartItems: [],
            }
        
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                shippingAddress: action.payload,
            }

        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                paymentMethod: action.payload,
            }

        default:
            return state
    }
}

