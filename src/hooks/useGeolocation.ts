import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface GeolocationAddress {
    street: string;
    area: string;
    city: string;
    state: string;
    landmark: string;
}

export const useGeolocation = () => {
    const [isLoading, setIsLoading] = useState(false);

    const detectLocation = useCallback(async (): Promise<GeolocationAddress | null> => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return null;
        }

        setIsLoading(true);

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        // Use OpenStreetMap Nominatim for reverse geocoding
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                        );
                        const data = await response.json();

                        if (data.address) {
                            const addr = data.address;

                            // Improved mapping with fallbacks
                            const normalizedAddress: GeolocationAddress = {
                                street: addr.road || addr.construction || addr.pedestrian || data.display_name.split(',')[0],
                                area: addr.neighbourhood || addr.suburb || addr.quarter || addr.city_district || addr.county || '',
                                city: addr.city || addr.town || addr.village || addr.hamlet || addr.municipality || '',
                                state: addr.state || addr.state_district || '',
                                landmark: addr.amenity || addr.shop || addr.office || addr.tourism || addr.historic || addr.leisure || '',
                            };

                            toast.success('Location detected!');
                            resolve(normalizedAddress);
                        } else {
                            toast.error('Could not determine address');
                            resolve(null);
                        }
                    } catch (error) {
                        console.error('Reverse geocoding failed', error);
                        toast.error('Failed to get address from location');
                        resolve(null);
                    } finally {
                        setIsLoading(false);
                    }
                },
                (error) => {
                    setIsLoading(false);
                    console.error('Location error:', error);
                    const message = error.code === 1 ? 'Location access denied' : 'Could not get location';
                    toast.error(message);
                    resolve(null);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    }, []);

    return { detectLocation, isLoading };
};
