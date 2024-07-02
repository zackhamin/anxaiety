async function saveMessageToDB(user: any, content: any, isUser: boolean) {
  try {
    const response = await fetch("/api/save-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.sub,
        content,
        isUser,
        email: user.email,
        name: user.name,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Message saved:", result);
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

export default saveMessageToDB;
