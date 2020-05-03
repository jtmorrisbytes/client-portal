module.exports = {
  getAuthState: function () {
    return (
      new URLSearchParams((this.props.location || {}).search || "").get(
        "state"
      ) ||
      (this.props.auth || {}).state ||
      ""
    );
  },
};
