import React from "react";
import { getThingAll, getUrl } from "@inrupt/solid-client";
import { Table, TableColumn } from "@inrupt/solid-ui-react";
import "./style.css";

function TodoList({ todoList }) {
  const todoThings = todoList ? getThingAll(todoList) : [];

  const TEXT_PREDICATE = "http://schema.org/text";
  const CREATED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#created";

  const thingsArray = todoThings
    .filter(
      (t) =>
        getUrl(t, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") !==
        "http://www.w3.org/ns/ldp#RDFSource"
    )
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
        <TableColumn property={TEXT_PREDICATE} header="" />
        <TableColumn
          property={CREATED_PREDICATE}
          dataType="datetime"
          header="Created At"
          body={({ value }) => value.toDateString()}
        />
      </Table>
    </div>
  );
}

export default TodoList;
