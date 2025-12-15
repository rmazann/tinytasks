"use client";

import { useState, useEffect } from "react";

export default function DateTimeLocation() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data.city) {
              // Shorten city name (take first 3-4 letters or common abbreviation)
              const cityName = data.city;
              const shortened = shortenCityName(cityName);
              setLocation(shortened);
            } else {
              setLocationError("Location unavailable");
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocationError("Location unavailable");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Location unavailable");
        }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  }, []);

  // Format date and time
  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  // Shorten city name
  const shortenCityName = (cityName: string): string => {
    // Common city abbreviations
    const abbreviations: { [key: string]: string } = {
      "New York": "NYC",
      "Los Angeles": "LA",
      "San Francisco": "SF",
      "San Diego": "SD",
      "Washington": "DC",
      "Chicago": "CHI",
      "Boston": "BOS",
      "Miami": "MIA",
      "Seattle": "SEA",
      "Portland": "PDX",
      "Philadelphia": "PHL",
      "Houston": "HOU",
      "Dallas": "DAL",
      "Atlanta": "ATL",
      "Denver": "DEN",
      "Phoenix": "PHX",
      "Las Vegas": "LV",
      "Detroit": "DET",
      "Minneapolis": "MSP",
      "Istanbul": "IST",
      "Ankara": "ANK",
      "Izmir": "IZM",
      "London": "LON",
      "Paris": "PAR",
      "Berlin": "BER",
      "Rome": "ROM",
      "Madrid": "MAD",
      "Barcelona": "BCN",
      "Amsterdam": "AMS",
      "Vienna": "VIE",
      "Prague": "PRG",
      "Warsaw": "WAW",
      "Moscow": "MOW",
      "Tokyo": "TYO",
      "Seoul": "SEL",
      "Beijing": "BJS",
      "Shanghai": "SHA",
      "Hong Kong": "HKG",
      "Singapore": "SIN",
      "Sydney": "SYD",
      "Melbourne": "MEL",
      "Dubai": "DXB",
      "Cairo": "CAI",
      "Mumbai": "BOM",
      "Delhi": "DEL",
      "Bangkok": "BKK",
      "Jakarta": "JKT",
      "Manila": "MNL",
      "São Paulo": "SP",
      "Rio de Janeiro": "RIO",
      "Buenos Aires": "BA",
      "Mexico City": "MEX",
      "Toronto": "TOR",
      "Vancouver": "VAN",
    };

    // Check if there's a known abbreviation
    if (abbreviations[cityName]) {
      return abbreviations[cityName];
    }

    // If city name is short (3-4 chars), return as is
    if (cityName.length <= 4) {
      return cityName.toUpperCase();
    }

    // Otherwise, take first 3-4 letters and make uppercase
    return cityName.substring(0, 3).toUpperCase();
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-['SF_Pro_Display:Regular',sans-serif] text-[color:var(--color-grey-60,#999)]">
      <span className="text-xs" style={{ fontSize: '12px' }}>{formatDateTime(currentTime)}</span>
      {location && (
        <>
          <span className="h-3.5 w-px bg-[color:var(--color-grey-60,#999)]" style={{ height: '12px' }}></span>
          <span className="text-xs" style={{ fontSize: '12px' }}>{location}</span>
        </>
      )}
      {locationError && !location && (
        <>
          <span className="h-3.5 w-px bg-[color:var(--color-grey-60,#999)]" style={{ height: '12px' }}></span>
          <span className="text-xs" style={{ fontSize: '12px' }}>N/A</span>
        </>
      )}
    </div>
  );
}
