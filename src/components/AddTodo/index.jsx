import {
  addDatetime,
  addStringNoLocale,
  createThing,
  getSolidDataset,
  getSourceUrl,
  getUrlAll,
  saveSolidDatasetAt,
  setThing,
  getThing,
} from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import React, { useEffect, useState } from "react";
import { getOrCreateTodoList } from "../../utils";
import "./style.css";

const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";
const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#created";

function AddTodo() {
  const { session } = useSession();
  const [todoList, setTodoList] = useState();
  const [todoText, setTodoText] = useState("");

  useEffect(() => {
    if (!session) return;
    (async () => {
      const profileDataset = await getSolidDataset(session.info.webId, {
        fetch: session.fetch,
      });
      const profileThing = getThing(profileDataset, session.info.webId);
      const podsUrls = getUrlAll(profileThing, STORAGE_PREDICATE);
      const pod = podsUrls[0];
      const containerUri = `${pod}todos/`;
      const list = await getOrCreateTodoList(containerUri, session.fetch);
      setTodoList(list);
    })();
  }, [session]);

  const addTodo = async (text) => {
    const indexUrl = getSourceUrl(todoList);
    const todoWithText = addStringNoLocale(createThing(), TEXT_PREDICATE, text);
    const todoWithDate = addDatetime(
      todoWithText,
      CREATED_PREDICATE,
      new Date()
    );
    const updatedTodoList = setThing(todoList, todoWithDate);
    await saveSolidDatasetAt(indexUrl, updatedTodoList, {
      fetch: session.fetch,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    addTodo(todoText);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setTodoText(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="todo-form">
        <label htmlFor="todo-input">
          <input
            id="todo-input"
            type="text"
            value={todoText}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="add-button">
          Add Todo
        </button>
      </form>
    </>
  );
}

export default AddTodo;
