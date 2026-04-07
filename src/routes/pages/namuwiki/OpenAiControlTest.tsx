import { useEffect, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "@/components/theme-provider";
import { Input } from "@/components";

const OpenAiControlTest = () => {
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const { theme } = useTheme();

  const eventSourceRef = useRef<EventSource | null>(null);

  // cleanup on unmount
  useEffect(() => {
    return () => eventSourceRef.current?.close();
  }, []);

  const handleSubmit = () => {
    eventSourceRef.current?.close(); // 이전 연결 정리
    setText("");

    const es = new EventSource(
      `http://localhost:8080/api/openai/stream?message=${searchText}`
    );
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setText((prev) => prev + data.content);
    };
    es.onerror = () => es.close();
  };

  return (
    <form action={handleSubmit}>
      <Input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <div
        className="markdownDiv"
        data-color-mode={theme == "dark" ? "dark" : "light"}
      >
        <MDEditor.Markdown style={{ padding: 10 }} source={text} />
      </div>
    </form>
  );
};

export default OpenAiControlTest;
