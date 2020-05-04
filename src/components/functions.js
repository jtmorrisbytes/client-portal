module.exports = {
  getAuthState: function () {
    return (
      (this.props.auth || {}).state ||
      new URLSearchParams((this.props.location || {}).search || "").get(
        "state"
      ) ||
      ""
    );
  },
};
