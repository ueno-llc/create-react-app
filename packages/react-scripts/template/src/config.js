import config from '@ueno/config';

// Set default config
config.setDefaults({
  SECRET_TOKEN: '123',
  PLANETS_API_URL: 'https://swapi.co/api/planets',
});

// What to expose to the browser
config.setBrowser({
  // Use .env -> env -> default -> undefined
  PLANETS_API_URL: true,

  // Overwrite the value (only for browser)
  SECRET_TOKEN(value) {
    return '321';
  },
});
