import {
  MESSAGE_BAD_REQUEST,
  MESSAGE_NOT_AUTHORIZED,
  REASON_TIMESTAMP_MISMATCH,
  MAX_ELAPSED_REQUEST_TIME,
  REASON_TIMESTAMP_EXPIRED,
  REASON_TIMESTAMP_MISSING,
} from "../constants";

export function enforceTimeStampExists(req, res, next) {
  // require the client to provide the last timestamp the server recorded the interaction
  // with the api.
  // if the timestamp is missing in the request, respond with 401,
  const { clientid, timestamp } = req.query;

  if (req.session.firstTimestamp && !timestamp) {
    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: REASON_TIMESTAMP_MISSING,
      location: "query",
    });
  } else {
    next();
  }
}
export function enforceTimestampFormat(req, res, next) {
  // if the timestamp is not a number, respond with 400 for a malformed request.
  next();
}

export function enforceTimeStampMatch(req, res, next) {
  let clientTimestamp = req.query.timestamp;
  let serverTimestamp = req.session.timestamp;
  if (clientTimestamp != serverTimestamp) {
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON_TIMESTAMP_MISMATCH,
    });
  } else next();
}
export function enforceTimeStampExpiry(req, res, next) {
  if (!res.headersSent) {
    let currentTimestamp = Date.now();
    let serverTimestamp = req.session.firstTimestamp;
    if (currentTimestamp > serverTimestamp + MAX_ELAPSED_REQUEST_TIME) {
      res.status(401).json({
        message: MESSAGE_NOT_AUTHORIZED,
        reason: REASON_TIMESTAMP_EXPIRED,
      });
    } else if (next) {
      next();
    }
  } else if (next) {
    next();
  }
}

// if the timestamp does not match what the server has on record, respond with 401 for a timestamp mismatch
// if the timestamp is older than a certain number of milliseconds, respond with 401 for an expired session
// and require the user to be logged out explicitly by the front end
// routes.use((req, res, next) => {});

export default {
  enforceTimeStampExists,
  enforceTimeStampExpiry,
  enforceTimeStampMatch,
  enforceTimestampFormat,
};
