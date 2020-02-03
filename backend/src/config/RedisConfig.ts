/**
 * Redis Default Config
 * @author Leonardo Otoni
 */
export default {
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
};
