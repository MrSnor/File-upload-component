import FileUpload from "@/components/FileUploadAndPrev/FileUpload";
import { useEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";

function App() {
  // a useEffect snippet
  useEffect(() => {
    return () => {};
  }, []);

  return (
    // code inside this div as root entry of your app
    <div className="App min-h-screen space-y-4 p-8 text-center">
      <FileUpload />
    </div>
  );
}

export default App;
