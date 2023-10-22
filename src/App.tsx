import { useState, useEffect } from "react";
import {
  promptRequest,
  WORDS,
  Response,
  PROMPT_VOICE,
  voices,
  ResponseWithVoice,
} from "./lib";

import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";

import "./App.css";
import Header from "./components/header";
import Responses from "./components/responses";
import ComposerButtons from "./components/composer-buttons";

function App() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState<ResponseWithVoice[]>([]);
  const [randomWord, setRandomWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [promptVoice, setPromptVoice] = useState<voices>("none");

  useEffect(() => {
    if (loading === false) {
      setProgress(0);
      return;
    }

    const timer = setInterval(() => {
      const rand = Math.floor(Math.random() * (20 - 5 + 1) + 5);
      const newProgress = progress + rand;
      setProgress(newProgress);
    }, 500);

    return () => clearTimeout(timer);
  }, [progress, loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }, 3000);

    return () => clearInterval(interval);
  });

  async function handleGoClick() {
    setLoading(true);
    const userInput: Response = {
      content: PROMPT_VOICE(prompt, promptVoice),
      role: "user",
      userInput: prompt,
    };
    const req = [...responses, userInput];
    const res = await promptRequest({ messages: req });
    const resWithVoice: ResponseWithVoice = {
      ...res,
      voice: promptVoice,
    };

    setPrompt("");
    setResponses([...responses, userInput, resWithVoice]);
    setLoading(false);
  }

  return (
    <div className="container">
      <Header />

      {loading && (
        <div className="loading flex flex-col items-center justify-center">
          <Progress value={progress} className="w-[60%]" />
          <div className="mt-4 text-sm text-slate-700">
            Sit tight, an NVIDIA GPU somwehere is putting in work...
          </div>
        </div>
      )}

      {!responses.length && !loading && (
        <div className="loading flex flex-col items-center justify-center">
          <div className="mt-4 text-sm text-slate-700 w-90">
            You can ask it pretty much anything: perhaps {randomWord}.
          </div>
        </div>
      )}

      {!loading &&
        responses.map((response, i) => (
          <Responses key={i} response={response} />
        ))}

      <div className="prompt-zone">
        <Textarea
          placeholder={
            responses.length ? "Your response here" : "Your prompt here"
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        ></Textarea>
      </div>

      <ComposerButtons
        {...{ loading, responses, setPromptVoice, handleGoClick }}
      />
    </div>
  );
}
export default App;
