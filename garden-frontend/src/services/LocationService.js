class LocationService {
  static async getUserLocation() {
    try {
      // First try to get precise location from browser geolocation
      const position = await this.getBrowserLocation();
      
      if (position) {
        // Get city/state from coordinates using reverse geocoding
        const locationData = await this.reverseGeocode(position.lat, position.lng);
        return {
          lat: position.lat,
          lng: position.lng,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country || 'USA'
        };
      }
    } catch (error) {
      console.log('Browser geolocation failed, trying IP-based location:', error);
    }

    // Fallback to IP-based location
    try {
      const ipLocation = await this.getIPLocation();
      return ipLocation;
    } catch (error) {
      console.error('All location methods failed:', error);
      throw new Error('Unable to determine location');
    }
  }

  static getBrowserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static async getIPLocation() {
    try {
      // Using ipapi.co for IP-based location (free tier)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'IP location failed');
      }

      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        city: data.city,
        state: data.region,
        country: data.country_name
      };
    } catch (error) {
      // Fallback to another service
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const ipData = await response.json();
        
        // Use a different service for location data
        const locationResponse = await fetch(`https://ip-api.com/json/${ipData.ip}`);
        const locationData = await locationResponse.json();
        
        if (locationData.status === 'fail') {
          throw new Error('IP location service failed');
        }

        return {
          lat: locationData.lat,
          lng: locationData.lon,
          city: locationData.city,
          state: locationData.regionName,
          country: locationData.country
        };
      } catch (fallbackError) {
        throw new Error('All IP location services failed');
      }
    }
  }

  static async reverseGeocode(lat, lng) {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { timeout: 5000 } // 5 second timeout
      );
      const data = await response.json();

      const address = data.address || {};

      return {
        city: address.city || address.town || address.village || address.hamlet || 'Local City',
        state: address.state || address.province || address.region || 'Local State',
        country: address.country || 'Local Country'
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Return location-based defaults for Nigeria
      if (lat > 4 && lat < 14 && lng > 3 && lng < 15) {
        return {
          city: 'Abuja',
          state: 'Federal Capital Territory',
          country: 'Nigeria'
        };
      }
      return {
        city: 'Unknown City',
        state: 'Unknown State',
        country: 'Unknown Country'
      };
    }
  }

  static calculateDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula to calculate distance between two points
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  static async geocodeAddress(address) {
    try {
      // Convert address to coordinates using Nominatim
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Address not found');
      }

      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        address: result.address
      };
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  }

  static formatDistance(distance) {
    if (distance < 0.1) {
      return 'Less than 0.1 miles';
    } else if (distance < 1) {
      return `${distance.toFixed(1)} miles`;
    } else {
      return `${Math.round(distance)} miles`;
    }
  }

  static isLocationPermissionGranted() {
    return new Promise((resolve) => {
      if (!navigator.permissions) {
        resolve(false);
        return;
      }

      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        resolve(result.state === 'granted');
      }).catch(() => {
        resolve(false);
      });
    });
  }
}

export default LocationService;
