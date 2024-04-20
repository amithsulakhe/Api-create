import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { Button, Checkbox, IconButton, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useDispatch, useSelector } from "react-redux";
import { addTodoData, deleteAllTodoData, deleteTodoData, editTodoData, getTodoData } from "../redux/todoSlice";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Todo = () => {
  const [editTodo, setEditTodo] = useState(false);
  const [editId, setId] = useState("");
  const { todoData } = useSelector((store) => store.todo);
  const [todo, setTodo] = useState([]);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    todoName: "",
    todoQuantity: "",
  });
  const [open, setOpen] = React.useState(false);
  const [deleteOnSelect, setDeleteOnSelect] = useState(0);
  const [select, setSelect] = useState(false);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    const tempUsersTodo = todo?.map((todo) => (todo._id === name ? { ...todo, isChecked: checked } : todo));
    const selectedTodo = tempUsersTodo?.filter((todo) => todo.isChecked).map((todo) => todo._id);
    console.log(selectedTodo);
    setTodo(tempUsersTodo);
    setDeleteOnSelect(selectedTodo);
  };
  const handleChangeTodo = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    if (!editTodo) {
      await dispatch(
        addTodoData({
          name: input.todoName,
          quantity: input.todoQuantity,
        })
      );
      await dispatch(getTodoData());
      setInput({
        todoName: "",
        todoQuantity: "",
      });
      toast.success("Added Successfully");
    } else {
      await dispatch(
        editTodoData(editId, {
          name: input.todoName,
          quantity: input.todoQuantity,
        })
      );
      dispatch(getTodoData());
      setInput({
        todoName: "",
        todoQuantity: "",
      });
      setEditTodo(false);
      toast.success("Edited Successfully");
    }
  };

  useEffect(() => {
    dispatch(getTodoData());
  }, []);

  useEffect(() => {
    setTodo(todoData);
  }, [todoData]);

  function getDate(date) {
    const dates = new Date(date);
    return format(dates, "d MMM yyyy, h:ma");
    // return String(new Date(date));
  }

  // deleting
  const handleDeleteTodo = async (id) => {
    await dispatch(deleteTodoData(id));
    toast.success("Deleted Successfully");

    dispatch(getTodoData());
  };
  const handleEditTodo = async (id, data) => {
    setOpen(true);
    setEditTodo(true);
    setInput({
      todoName: data.name,
      todoQuantity: data.quantity,
    });
    setId(id);
  };
  // const deleteAllTodo = async () => {
  //   await dispatch(deleteAllTodoData());
  //   toast.success("Deleted All Data Successfully");
  //   dispatch(getTodoData());
  // };

  const deleteOnSelectTodo = async () => {
    for (let id of deleteOnSelect) {
      await dispatch(deleteTodoData(id));
    }
    await dispatch(getTodoData());
    if (select) {
      setSelect(false);
      console.log(todoData);
    }
    setDeleteOnSelect(0);
    toast.success("Selected Deleted Successfully");
    console.log(todo);
  };

  const handleSelectAll = () => {
    if (select) {
      const selectedAll = todo?.map((todo) => ({ ...todo, isChecked: false }));
      setTodo(selectedAll);
      setDeleteOnSelect(0);
      setSelect(false);
    } else {
      const selectedAll = todo?.map((todo) => ({ ...todo, isChecked: true }));
      const selectedTodo = selectedAll?.filter((todo) => todo.isChecked).map((todo) => todo._id);
      setTodo(selectedAll);
      setDeleteOnSelect(selectedTodo);
      setSelect(true);
    }
  };
  return (
    <Box>
      {/* <Typography textAlign="center" variant="h4" color="error">
        Welcome to Todo list App
      </Typography>

      <Box>
        <Stack width="50%" margin="0 auto" border="1px solid black">
          <Box>
            <TextField id="outlined-basic" label="Enter Name" variant="outlined" />
          </Box>
          <Box></Box>
        </Stack>
      </Box> */}
      <Box p={5} width="50%" margin="0 auto" border="1px solid black" bgcolor="#f8f9ff">
        <Typography fontWeight="800" textAlign="center" variant="h4" color="#62657d">
          TODO LIST
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          <Button variant="contained" sx={{ px: 3, py: 1 }} onClick={() => setOpen(true)}>
            Add Task
          </Button>
          <Button variant="outlined" onClick={handleSelectAll}>
            {!select ? " Select All" : "Un Select All"}
          </Button>
          <IconButton aria-label="delete" size="large" onClick={deleteOnSelectTodo}>
            <Typography variant="h6">{deleteOnSelect.length}</Typography>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Stack>
        <Box bgcolor="#ecedf6" display="flex" flexDirection="column" gap={2} p={3} my={2} borderRadius="10px">
          {todo?.length ? (
            todo?.map((ele) => {
              return (
                <Stack key={ele._id} direction="row" justifyContent="space-between" p={1} bgcolor="#ffffff" borderRadius="5px">
                  <Box display="flex" width="80%" alignItems="center">
                    <Box>
                      {/* <input type="checkbox" name={ele?.name} checked={ele?.isChecked ? true : false} onChange={handleChange} /> */}
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        name={ele?._id}
                        checked={ele?.isChecked || false}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontSize="18px">
                        {ele.name}
                      </Typography>
                      <Typography variant="h6" fontSize="15px">
                        {getDate(ele.date)}
                      </Typography>
                    </Box>
                    <Box marginLeft="50px">
                      <Typography variant="h5" fontSize="18px" color="error">
                        {ele.quantity}kg
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex">
                    <IconButton onClick={() => handleDeleteTodo(ele._id)}>
                      <DeleteIcon fontSize="20px" />
                    </IconButton>
                    <IconButton onClick={() => handleEditTodo(ele._id, ele)}>
                      <ModeEditIcon fontSize="20px" />
                    </IconButton>
                  </Box>
                </Stack>
              );
            })
          ) : (
            <Box>No Data Found</Box>
          )}
        </Box>
      </Box>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: "500px",
            // maxWidth: 500,
            borderRadius: "md",
            p: 5,
            boxShadow: "lg",
          }}
        >
          {/* <ModalClose variant="plain" sx={{ m: 1 }} /> */}
          <Box>
            <form action="" onSubmit={handleSubmit}>
              <Stack gap={2}>
                <TextField
                  value={input.todoName}
                  name="todoName"
                  onChange={handleChangeTodo}
                  id="outlined-basic"
                  label="Enter Todo"
                  variant="outlined"
                />
                <TextField
                  type="number"
                  value={input.todoQuantity}
                  name="todoQuantity"
                  onChange={handleChangeTodo}
                  id="outlined-basic"
                  label="Enter quantity"
                  variant="outlined"
                />
                <Button variant="contained" color="success" type="submit">
                  {!editTodo ? "Add Todo" : "Edit Todo"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Sheet>
      </Modal>
    </Box>
  );
};

export default Todo;
