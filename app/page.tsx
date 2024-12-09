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

const fetchInterpretation = async (content: string) => {
  return fetchAuthSession().then(({ credentials }) => {
    const lambda = new Lambda({ credentials, region: outputs.auth.aws_region });
    return lambda.invoke({
      FunctionName: 'amplify-d38dkfiz7cgc0q-ma-interpretationlambdalamb-IjWnb06xAItZ',
      Payload: JSON.stringify({ content })
    });
});
}

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

  function createTodo() {
    const content = window.prompt("Todo content")!;
    if (content) {
      client.models.Todo.create({
        content: content,
        interpretation: JSON.stringify(client.queries.getInterpretation({
          content
        }))
      });
      // fetchInterpretation(content).then((interpretation) => {
      //   client.models.Todo.create({
      //     content: content,
      //     interpretation: JSON.stringify(JSON.parse(new TextDecoder().decode(interpretation.Payload))),
      //   });
      // });
    }
  }

  return (
    <main>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "10px" }}>
          <h1>Happy Emoji</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{`${todo.content} (${todo.interpretation || 'interpretation pending...'})`}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
