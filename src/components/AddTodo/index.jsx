import {
  addDatetime,
  addStringNoLocale,
  createThing,
  getSourceUrl,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import React, { useState } from "react";
import "./style.css";

const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#created";

function AddTodo({ todoList, setTodoList }) {
  const { session } = useSession();
  const [todoText, setTodoText] = useState("");

  const addTodo = async (text) => {
    const indexUrl = getSourceUrl(todoList);
    const todoWithText = addStringNoLocale(createThing(), TEXT_PREDICATE, text);
    const todoWithDate = addDatetime(
      todoWithText,
      CREATED_PREDICATE,
      new Date()
    );
    const updatedTodoList = setThing(todoList, todoWithDate);
    const updatedDataset = await saveSolidDatasetAt(indexUrl, updatedTodoList, {
      fetch: session.fetch,
    });
    setTodoList(updatedDataset);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    addTodo(todoText);
    setTodoText("");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setTodoText(e.target.value);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label htmlFor="todo-input">
        <input
          id="todo-input"
          type="text"
          value={todoText}
          onChange={handleChange}
        />
      </label>
      <button className="add-button" type="submit">
        Add Todo
      </button>
    </form>
  );
}

export default AddTodo;
