const parameters = {
  language: {
    name: 'language',
    in: 'header',
    description: 'Language code',
    required: false,
    schema: {
      type: 'string',
    },
  },
  platform: {
    name: 'platform',
    in: 'header',
    description: 'Platform (web, mobile)',
    required: false,
    schema: {
      type: 'string',
    },
  },
  page: {
    name: 'page',
    in: 'query',
    description: 'Cursor position (number) for pagination',
    required: false,
    schema: {
      type: 'number',
    },
  },
  limit: {
    name: 'limit',
    in: 'query',
    description: 'Limit (number) how many rows to fetch (for pagination)',
    required: false,
    schema: {
      type: 'number',
    },
  },
};

export default parameters;
