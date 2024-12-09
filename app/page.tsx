"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";
import { Lambda } from "@aws-sdk/client-lambda";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }


  useEffect(() => {
    listTodos();
  }, []);

  async function createTodo(content: string) {
    // const content = window.prompt("Todo content")!;
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    if (!emojiRegex.test(content)) {
      alert("Only emojis are allowed!"); 1
      return;
    }
    if (content) {
      const interpretation = JSON.stringify(await client.queries.getInterpretation({ content })) || JSON.stringify({ data: 'unknown interpretation' });
      console.log('interpretation', interpretation);
      client.models.Todo.create({
        content: content,
        interpretation: JSON.stringify(JSON.parse(interpretation)!.data)
      });
    }
  }

  return (
    <main>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "10px" }}>
          <h1>Happy Emoji</h1>
          <div className="container">
            <div className="scrollbox" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
              <ul>
                {todos.map((todo) => (
                  <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{`${todo.content} (${todo.interpretation || 'interpretation pending...'})`}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="container">
            <input
              type="text"
              placeholder="Type your emoji here"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement;
                  const content = input.value;
                  createTodo(content);
                  input.value = ""; // Clear the input
                }
              }}
            />
            <div className="emoji-keyboard">
              {["😀", "😂", "😍", "😎", "😭",
                "😡", "👍", "👎", "🙏", "👏"
                , "🤔", "😴", "😜", "😇", "🤗", "🤩", "🤪", "🤯",
                "🥳", "🥺", "🤠", "😷", "🤒",
              ].map((emoji) => (
                <button
                  key={emoji}
                  style={{ fontSize: "24px", padding: "10px", margin: "5px" }}
                  onClick={() => {
                    const input = document.querySelector("input[type='text']") as HTMLInputElement;
                    if (input) {
                      input.value += emoji;
                    }
                  }}
                >
                  {emoji}
                </button>
              ))}
              <button
                style={{ fontSize: "24px", padding: "10px", margin: "5px" }}
                onClick={() => {
                  const input = document.querySelector("input[type='text']") as HTMLInputElement;
                  if (input) {
                    const content = input.value;
                    createTodo(content);
                    input.value = ""; // Clear the input
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
