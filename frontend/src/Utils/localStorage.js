

// export const getFavoritesFromLocalStorage = () => {
//     const favoriteJSON = localStorage.getItem('favorites');
//     return  favoriteJSON ? JSON.parse(favoriteJSON) : [];
// }

// export const addFavoriteToLoacalStorage = (product) => {
//     const favorites = getFavoritesFromLocalStorage();
//     const exist = favorites.find((x) => x._id === product._id);
//     if (exist) {
//         return;
//     }
//     favorites.push(product);
//     localStorage.setItem('favorites', JSON.stringify(favorites));
// }

// export const removeFavoriteFromLocalStorage = (productId) => {
//     const favorites = getFavoritesFromLocalStorage();
//     const newFavorites = favorites.filter((x) => x._id !== productId);
//     localStorage.setItem('favorites', JSON.stringify(newFavorites));
// }
