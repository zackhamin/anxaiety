export const formatText = (text: string) => {
  // Split into paragraphs
  const paragraphs = text.split("\n\n");

  return paragraphs.map((paragraph, index) => {
    // Check if the paragraph is a list
    if (paragraph.match(/^\d+\./)) {
      // Numbered list
      const items = paragraph.split("\n");
      return (
        <ol key={index} className="list-decimal list-inside my-4">
          {items.map((item, i) => (
            <li key={i} className="my-2">
              {item.replace(/^\d+\.\s/, "")}
            </li>
          ))}
        </ol>
      );
    } else if (paragraph.match(/^•/)) {
      // Bullet list
      const items = paragraph.split("\n");
      return (
        <ul key={index} className="list-disc list-inside my-4">
          {items.map((item, i) => (
            <li key={i} className="my-2">
              {item.replace(/^•\s/, "")}
            </li>
          ))}
        </ul>
      );
    } else {
      // Regular paragraph
      return (
        <p key={index} className="my-4">
          {paragraph}
        </p>
      );
    }
  });
};
