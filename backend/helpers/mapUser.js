module.exports = function (user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roleId: user.role,
  };
};
