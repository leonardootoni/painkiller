/**
 * Default configuration file for JWT generation
 * @author Leonardo Otoni
 */
export default {
  secret: process.env.SERVER_KEY || '',
  expiresIn: '1d',
};
