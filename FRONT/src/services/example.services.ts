import API from '../api';

export const getExample = async () => {
    const response = await API.getStatics(); // EXAMPLE
    return response;
}