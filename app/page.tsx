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

  function copyToClipboard(text: string) {
    console.log('copying to clipboard', text);
    navigator.clipboard.writeText(text);
  }


  useEffect(() => {
    listTodos();
  }, []);

  async function createTodo(content: string) {
    // const content = window.prompt("Todo content")!;
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    let query: string = content;
    let isConvertText = false;
    if (!emojiRegex.test(content)) {
      query = "turn this text into emojis: " + content;
      isConvertText = true;
    }
    if (query) {
      const interpretation = JSON.stringify(await client.queries.getInterpretation({ content: query })) || JSON.stringify({ data: 'unknown interpretation' });
      console.log('interpretation', interpretation);
      let interpStr = JSON.parse(interpretation)!.data;
      if (isConvertText) interpStr = interpStr.match(emojiRegex).join('')
      client.models.Todo.create({
        content: isConvertText ? '' : content,
        interpretation: interpStr
      });
    }
  }

  return (
    <main>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "10px" }}>
          <h1 style={{textAlign:'center'}}>Happy Em😊ji</h1>
          <div className="container">
            <div style={{ width: "100vw", height: "55vh" }} className="scrollbox" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
              <ul>
                {todos.map((todo) => (
                  <li key={todo.id} onClick={() => copyToClipboard(todo.interpretation!)}>
                    <div style={{display: 'flex'}} >
                      <div>{`${todo.content} ${todo.interpretation || 'interpretation pending...'}`}</div>
                      <div className="deleteTodo">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTodo(todo.id);
                          }}>X</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="container">
            <input
              type="text"
              placeholder="Type here to translate your text to emoji"
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
            <button
              style={{ fontSize: "15px", width: "100%" }}
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

      <button style={{ fontSize: "15px" }} onClick={signOut}>Sign out</button>
    </main>
  );
}
