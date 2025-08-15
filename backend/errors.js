class InvalidQRCodeError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidQRCodeError";
      this.status = 400;
    }
  }
  
  class SlotNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "SlotNotFoundError";
      this.status = 404;
    }
  }
  
  module.exports = { InvalidQRCodeError, SlotNotFoundError };
  