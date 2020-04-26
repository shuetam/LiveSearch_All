export const updateStore = (state, updatedProperties) => {
    return {
        ...state,
        ...updatedProperties
    };
};