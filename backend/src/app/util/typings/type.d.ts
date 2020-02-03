/**
 * Declaration of additional Express properties
 * @author Leonardo Otoni
 */
declare namespace Express {
  export interface Request {
    // pagination parameters
    limit: number;
    offset: number;

    // user identification
    userId: number;
  }
}
