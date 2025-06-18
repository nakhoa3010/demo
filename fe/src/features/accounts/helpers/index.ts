export const getRandomAvatar = () => {
  const randomNumber = Math.floor(Math.random() * 15);
  return `/profiles/profile_${randomNumber}.jpg`;
};
