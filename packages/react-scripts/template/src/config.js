import config from '@ueno/config';

// Set default config
config.setDefaults({
  SECRET_TOKEN: '123',
  PLANETS_API_URL: 'https://swapi.co/api/planets',
});

// What to expose to the browser
config.setBrowser({
  PLANETS_API_URL: true,
  SECRET_TOKEN: value => value.split``.reverse().join``,
});
