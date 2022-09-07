const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.get('Authorization');

  if (!header) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  const actualToken = header.split(' ')[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      actualToken,
      'zVzS42wNmzOOmlRgYCNWE1dxTH4n_sL6JuDnNj2srF2B7YxRsAgVmvqO8z14Wd3nzOqXzseBAjJ7PA5RSzjs0GsdrR5nxrVu8NPQJjooJLq2GqEl4h9JxwJ8zg5d_Fl2l3Q3n8yf13Gydum25V3mYRUy--L1EskSMs2PcEXLOJM'
    );
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
