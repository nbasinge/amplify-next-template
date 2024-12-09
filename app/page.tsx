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

  async function createTodo() {
    const content = window.prompt("Todo content")!;
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    if (!emojiRegex.test(content)) {
      alert("Only emojis are allowed!");1
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
          <button onClick={createTodo}>+ new</button>
          <div className="container">
          <div className="scrollbox">
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{`${todo.content} (${todo.interpretation || 'interpretation pending...'})`}</li>
            ))}
          </ul>
          </div>
          </div>
        </div>
      </div>
      
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
