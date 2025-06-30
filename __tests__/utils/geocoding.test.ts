import {
  fetchCityCoordinates,
  fetchCitiesList,
  formatLocation,
  GeoLocation
} from '@/utils/geocoding';


describe('utils/geocoding', () => {
  // Mock the fetch function globally
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
    jest.resetAllMocks();
  });

  describe('formatLocation', () => {
    it('includes admin1 if present', () => {
      expect(formatLocation('Dublin', 'Leinster', 'Ireland'))
        .toBe('Dublin, Leinster, Ireland');
    });
    it('omits admin1 if undefined', () => {
      expect(formatLocation('Berlin', undefined, 'Germany'))
        .toBe('Berlin, Germany');
    });
  });
});

describe('fetchCityCoordinates', () => {
  it('calls the geocoding API with &count=1 and returns the first result', async () => {
    const apiResponse = {
      results: [{
        name: 'TestCity',
        admin1: 'TestRegion',
        country: 'TestLand',
        latitude: 12.34,
        longitude: 56.78
      }]
    };

    // Mock the fetch function to return a resolved promise with the API response
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(apiResponse)
    } as any);

    const coord = await fetchCityCoordinates('TestCity,TestLand');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=TestCity%2CTestLand&count=1'
    );
    expect(coord).toEqual(apiResponse.results[0]);
  });

  it('throws if no results come back', async () => {
    // Mock the fetch function to return an empty results array
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ results: [] })
    } as any);

    await expect(fetchCityCoordinates('Nowhere'))
            .rejects
            .toThrow('City not found.');
  });
});

describe('fetchCitiesList', () => {
  it('returns up to 6 mapped GeoLocation objects', async () => {
    const apiResponse = {
      results: [
        { name: 'A', admin1: 'R1', country: 'C1', latitude: 1, longitude: 1 },
        { name: 'B', admin1: 'R2', country: 'C2', latitude: 2, longitude: 2 },
      ]
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(apiResponse)
    } as any);

    const list = await fetchCitiesList('Te');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=Te&count=6'
    );
    expect(list).toEqual(apiResponse.results as GeoLocation[]);
  });

  it('returns an empty array if results is null/undefined', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({})
    } as any);

    const list = await fetchCitiesList('Te');
    expect(list).toEqual([]);
  });
});
