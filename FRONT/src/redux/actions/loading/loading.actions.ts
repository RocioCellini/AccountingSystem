import { START_LOADING, STOP_LOADING, STOP_LOADING_WITH_ERROR } from "../../constants/loading.constants";


export const startLoading = () => ({
    type: START_LOADING,
});

export const stopLoading = () => ({
    type: STOP_LOADING,
});

export const stopLoadingWithError = () => ({
    type: STOP_LOADING_WITH_ERROR,
});


