// Popular cities for autocomplete suggestions
export const popularCities = [
  // Major world cities
  'New York', 'London', 'Paris', 'Tokyo', 'Berlin', 'Madrid', 'Rome', 'Amsterdam',
  'Sydney', 'Melbourne', 'Toronto', 'Vancouver', 'Los Angeles', 'San Francisco',
  'Chicago', 'Miami', 'Boston', 'Seattle', 'Las Vegas', 'Denver', 'Phoenix',
  'Atlanta', 'Houston', 'Dallas', 'Philadelphia', 'Detroit', 'Minneapolis',
  
  // European cities
  'Barcelona', 'Vienna', 'Prague', 'Budapest', 'Warsaw', 'Stockholm', 'Oslo',
  'Copenhagen', 'Helsinki', 'Dublin', 'Edinburgh', 'Manchester', 'Liverpool',
  'Birmingham', 'Glasgow', 'Brussels', 'Zurich', 'Geneva', 'Milan', 'Naples',
  'Florence', 'Venice', 'Athens', 'Lisbon', 'Porto', 'Seville', 'Valencia',
  
  // Asian cities
  'Beijing', 'Shanghai', 'Hong Kong', 'Singapore', 'Seoul', 'Osaka', 'Kyoto',
  'Bangkok', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Jakarta', 'Manila', 'Ho Chi Minh City', 'Kuala Lumpur', 'Taipei',
  
  // American cities
  'Mexico City', 'Cancun', 'Guadalajara', 'Monterrey', 'Buenos Aires', 'Rio de Janeiro',
  'São Paulo', 'Lima', 'Bogotá', 'Santiago', 'Caracas', 'Quito', 'La Paz',
  
  // African and Middle Eastern cities
  'Cairo', 'Cape Town', 'Johannesburg', 'Lagos', 'Nairobi', 'Casablanca',
  'Dubai', 'Abu Dhabi', 'Doha', 'Kuwait City', 'Riyadh', 'Jeddah', 'Tel Aviv',
  'Jerusalem', 'Istanbul', 'Ankara', 'Tehran', 'Baghdad', 'Amman',
  
  // Oceania
  'Auckland', 'Wellington', 'Brisbane', 'Perth', 'Adelaide', 'Canberra',
  'Gold Coast', 'Darwin', 'Hobart',
  
  // Additional popular destinations
  'Reykjavik', 'Tirana', 'Podgorica', 'Sarajevo', 'Zagreb', 'Ljubljana',
  'Bratislava', 'Tallinn', 'Riga', 'Vilnius', 'Minsk', 'Kiev', 'Chisinau',
  'Bucharest', 'Sofia', 'Skopje', 'Belgrade', 'Monaco', 'Andorra la Vella',
  'San Marino', 'Vatican City', 'Valletta', 'Nicosia', 'Tbilisi', 'Yerevan',
  'Baku', 'Nur-Sultan', 'Almaty', 'Tashkent', 'Bishkek', 'Dushanbe', 'Ashgabat'
];

// Function to filter cities based on user input
export const getCitySuggestions = (input) => {
  if (!input || input.length < 2) return [];
  
  const filtered = popularCities.filter(city =>
    city.toLowerCase().includes(input.toLowerCase())
  );
  
  // Sort by relevance (starts with input first, then contains)
  return filtered.sort((a, b) => {
    const aStarts = a.toLowerCase().startsWith(input.toLowerCase());
    const bStarts = b.toLowerCase().startsWith(input.toLowerCase());
    
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.localeCompare(b);
  }).slice(0, 8); // Limit to 8 suggestions
};
