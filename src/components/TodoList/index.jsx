import {
  addDatetime,
  getDatetime,
  getSourceUrl,
  getThingAll,
  getUrl,
  removeDatetime,
  removeThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import {
  Table,
  TableColumn,
  useThing,
  useSession,
} from "@inrupt/solid-ui-react";
import React from "react";
import "./style.css";

const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#created";
const COMPLETED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#completed";
const TODO_CLASS = "http://www.w3.org/2002/12/cal/ical#Vtodo";
const TYPE_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

function CompletedBody({ checked, handleCheck }) {
  const { thing } = useThing();
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => handleCheck(thing, checked)}
      />
    </label>
  );
}

function DeleteButton({ deleteTodo }) {
  const { thing } = useThing();
  return (
    <button className="delete-button" onClick={() => deleteTodo(thing)}>
      Delete
    </button>
  );
}

function TodoList({ todoList, setTodoList }) {
  const todoThings = todoList ? getThingAll(todoList) : [];
  todoThings.sort((a, b) => {
    return (
      getDatetime(a, CREATED_PREDICATE) - getDatetime(b, CREATED_PREDICATE)
    );
  });

  const { fetch } = useSession();

  const deleteTodo = async (todo) => {
    const todosUrl = getSourceUrl(todoList);
    const updatedTodos = removeThing(todoList, todo);
    const updatedDataset = await saveSolidDatasetAt(todosUrl, updatedTodos, {
      fetch,
    });
    setTodoList(updatedDataset);
  };

  const handleCheck = async (todo, checked) => {
    const todosUrl = getSourceUrl(todoList);
    let updatedTodos;
    if (!checked) {
      const date = new Date();
      const doneTodo = addDatetime(todo, COMPLETED_PREDICATE, date);
      updatedTodos = setThing(todoList, doneTodo, { fetch });
    } else {
      const date = getDatetime(todo, COMPLETED_PREDICATE);
      const undoneTodo = removeDatetime(todo, COMPLETED_PREDICATE, date);
      updatedTodos = setThing(todoList, undoneTodo, { fetch });
    }
    const updatedList = await saveSolidDatasetAt(todosUrl, updatedTodos, {
      fetch,
    });
    setTodoList(updatedList);
  };

  const thingsArray = todoThings
    .filter((t) => getUrl(t, TYPE_PREDICATE) === TODO_CLASS)
    .map((t) => {
      return { dataset: todoList, thing: t };
    });
  if (!thingsArray.length) return null;

  return (
    <div className="table-container">
      <span className="tasks-message">
        Your to-do list has {thingsArray.length} items
      </span>
      <Table className="table" things={thingsArray}>
        <TableColumn property={TEXT_PREDICATE} header="To Do" sortable />
        <TableColumn
          property={CREATED_PREDICATE}
          dataType="datetime"
          header="Created At"
          body={({ value }) => value.toDateString()}
          sortable
        />
        <TableColumn
          property={COMPLETED_PREDICATE}
          dataType="datetime"
          header="Done"
          body={({ value }) => (
            <CompletedBody checked={Boolean(value)} handleCheck={handleCheck} />
          )}
        />
        <TableColumn
          property={TEXT_PREDICATE}
          header=""
          body={() => <DeleteButton deleteTodo={deleteTodo} />}
        />
      </Table>
    </div>
  );
}

export default TodoList;
