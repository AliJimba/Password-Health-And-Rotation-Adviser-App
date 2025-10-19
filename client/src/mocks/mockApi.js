// src/mocks/mockApi.js
export const getUser = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        username: "user1",
        email: "user1@example.com",
        name: "User One"
      });
    }, 500);
  });
};
