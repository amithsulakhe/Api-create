import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todoData: [],
  },
  reducers: {
    getData(state, action) {
      state.todoData = action.payload;
    },
  },
});

export const { getData } = todoSlice.actions;
export default todoSlice.reducer;

export function getTodoData() {
  return async function addTodoThunk(dispatch) {
    try {
      const response = await axios.get("http://localhost:8050/todo");
      if (response.status === 200) {
        const latestData = response.data.users.sort((a, b) => new Date(b.date) - new Date(a.date));
        dispatch(getData(latestData));
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function addTodoData(payload) {
  return async function addTodoThunk(dispatch) {
    try {
      const response = await axios.post("http://localhost:8050/todo/createuser", payload);
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteTodoData(payload) {
  return async function addTodoThunk(dispatch) {
    try {
      const response = await axios.delete(`http://localhost:8050/todo/user/${payload}`);
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function editTodoData(id, payload) {
  return async function addTodoThunk(dispatch) {
    try {
      const response = await axios.patch(`http://localhost:8050/todo/edit/${id}`, payload);
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteAllTodoData(id, payload) {
  return async function addTodoThunk(dispatch) {
    try {
      const response = await axios.delete(`http://localhost:8050/todo/deleteall`, payload);
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
