import { useLocalStorage } from 'usehooks-ts';

export function useFavorites() {
    const [favorites, setFavorites] = useLocalStorage<string[]>('halal-favorites', []);

    const toggleFavorite = (id: string) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(favId => favId !== id));
        } else {
            setFavorites([...favorites, id]);
        }
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite };
}
