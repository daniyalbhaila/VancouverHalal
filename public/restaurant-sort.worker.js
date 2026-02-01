function toRadians(deg) {
  return deg * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function addDistance(restaurants, location) {
  if (!location) {
    return restaurants.map((restaurant) => ({ ...restaurant, distance: null }));
  }

  return restaurants.map((restaurant) => ({
    ...restaurant,
    distance: calculateDistance(
      location.lat,
      location.lng,
      restaurant.location.lat,
      restaurant.location.lng
    ),
  }));
}

function filterAndSort(restaurants, location, filters) {
  const { selectedCategory, showOpenOnly, radius, sortBy } = filters;
  let result = addDistance(restaurants, location);

  if (selectedCategory) {
    const target = selectedCategory.toLowerCase();
    result = result.filter((restaurant) =>
      restaurant.categories.some((category) =>
        String(category).toLowerCase().includes(target)
      )
    );
  }

  if (showOpenOnly) {
    result = result.filter((restaurant) => restaurant.isOpenNow);
  }

  if (location && radius <= 50) {
    result = result.filter((restaurant) => (restaurant.distance || 0) <= radius);
  }

  result.sort((a, b) => {
    if (sortBy === "distance" && location) {
      return (a.distance || 0) - (b.distance || 0);
    }

    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    if (sortBy === "recommended") {
      const distancePenaltyA = (a.distance || 0) * 0.2;
      const distancePenaltyB = (b.distance || 0) * 0.2;
      const reviewBonusA = Math.log10((a.reviews || 0) + 1) * 0.1;
      const reviewBonusB = Math.log10((b.reviews || 0) + 1) * 0.1;
      const scoreA = a.rating + reviewBonusA - distancePenaltyA;
      const scoreB = b.rating + reviewBonusB - distancePenaltyB;
      return scoreB - scoreA;
    }

    return 0;
  });

  return result;
}

function closestRestaurants(restaurants, location, count) {
  if (!location) {
    return [];
  }

  return restaurants
    .map((restaurant) => ({
      ...restaurant,
      distance: calculateDistance(
        location.lat,
        location.lng,
        restaurant.location.lat,
        restaurant.location.lng
      ),
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, count);
}

self.onmessage = (event) => {
  const { type, payload, requestId } = event.data || {};

  if (type === "filterSort") {
    const { restaurants, location, filters } = payload || {};
    const result = filterAndSort(restaurants || [], location || null, filters || {});
    self.postMessage({ type, requestId, result });
    return;
  }

  if (type === "closest") {
    const { restaurants, location, count } = payload || {};
    const result = closestRestaurants(restaurants || [], location || null, count || 10);
    self.postMessage({ type, requestId, result });
    return;
  }
};
