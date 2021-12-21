import React from "react";

export default function useMarkdown(md) {
  const [markdown, setMarkdown] = React.useState("");

  React.useEffect(() => {
    fetch(md)
      .then((res) => res.text())
      .then((md) => {
        setMarkdown(md);
      });
  });

  return markdown;
}
