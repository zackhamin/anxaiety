const fetchPreviousChats = async (userId: string) => {
  try {
    const response = await fetch(`/api/get-chats?userId=${userId}`);
    const data = await response.json();
    return data.chats;
  } catch (error) {
    throw new Error(" Unable to get previous chats");
  }
};
