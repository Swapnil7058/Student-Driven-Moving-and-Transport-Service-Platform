async function readJsonResponse(response, fallbackMessage) {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || fallbackMessage);
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    throw new Error(text || fallbackMessage);
  }
}

export const getLocationFromZip = async (zip) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&country=India&format=json`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "StudentsMovingService/1.0",
      },
    },
  );

  const data = await readJsonResponse(
    response,
    "Unable to fetch location from ZIP code",
  );

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid ZIP code");
  }

  const location = data[0];

  return {
    name: location.display_name,
    lat: parseFloat(location.lat),
    lng: parseFloat(location.lon),
  };
};

export const getDistanceKm = async (fromCoords, toCoords) => {
  const { lat: lat1, lng: lng1 } = fromCoords;
  const { lat: lat2, lng: lng2 } = toCoords;

  const response = await fetch(
    `http://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "StudentsMovingService/1.0",
      },
    },
  );

  const data = await readJsonResponse(
    response,
    "Unable to calculate route distance",
  );

  if (!data?.routes?.length) {
    throw new Error("Unable to calculate route distance");
  }

  const meters = data.routes[0].distance;

  return Math.round(meters / 1000);
};
