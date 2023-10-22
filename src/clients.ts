import { voices } from "./lib";

const ENDPOINT = "https://llama.shahzeb001.workers.dev/";

export interface Response {
  role: "system" | "user";
  /** content is the prompt we send to the server */
  content: string;
  /** user input is the string the user typed in */
  userInput?: string;
}

export interface ResponseWithVoice extends Response {
  voice?: voices;
}

interface PromptRequest {
  messages: ResponseWithVoice[];
}

export async function promptRequest(
  messages: PromptRequest
): Promise<Response> {
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  const { response } = await r.json();

  return { content: response, role: "system" };
}
