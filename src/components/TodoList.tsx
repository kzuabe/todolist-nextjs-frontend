import { useTask } from '../hooks/task';
import Task from '../models/task';
import {
  DeleteOutlineRounded as DeleteOutlineRoundedIcon,
  Edit as EditIcon,
  AddCircleOutlineRounded as AddCircleOutlineRoundedIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  Button,
  List,
  ListItem,
  IconButton,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  ListItemIcon,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

type TaskAddFormInputs = {
  title: string;
};

const TodoList = () => {
  const { tasks, addTask, toggleTaskStatus, changeTask, removeTask } =
    useTask();
  const [open, setOpen] = useState(false); // タスク更新モーダルのstate
  const [selected, setSelected] = useState<Task>(); // 更新対象のタスクのstate
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors: addFormError },
  } = useForm<TaskAddFormInputs>();

  const handleAddTask: SubmitHandler<TaskAddFormInputs> = async (data) => {
    try {
      addTask(data.title);
      reset();
    } catch {
      // TODO: エラーハンドリング
    }
  };

  const handleUpdateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const title = data.get('title');
    const description = data.get('description');
    if (typeof title != 'string' || typeof description != 'string') {
      return;
    }

    if (!selected) {
      return;
    }
    const update: Task = { ...selected, title, description };
    changeTask(update);
    setOpen(false);
    setSelected(undefined);
  };

  const handleToggleStatus = (task: Task) => {
    toggleTaskStatus(task);
  };

  const handleDeleteTask = (task: Task) => {
    removeTask(task.id);
  };

  const handleOpenUpdateDialog = (task: Task) => {
    setOpen(true);
    setSelected(task);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelected(undefined);
  };

  return (
    <Box>
      <Container sx={{ pt: 4 }} maxWidth="sm">
        <form onSubmit={handleSubmit(handleAddTask)} noValidate>
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={addFormError.title && true}
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="タスクを入力"
                helperText={addFormError.title && 'タスク名を入力してください'}
                autoFocus
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddCircleOutlineRoundedIcon />}
          >
            Add Todo
          </Button>
        </form>
      </Container>
      <Container sx={{ py: 8 }} maxWidth="md">
        <List dense={true}>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.status === 'DONE'}
                  tabIndex={-1}
                  onChange={() => handleToggleStatus(task)}
                />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{
                  textDecoration:
                    task.status === 'DONE' ? 'line-through' : 'none',
                }}
              />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Edit"
                  onClick={() => handleOpenUpdateDialog(task)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTask(task)}
                >
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Dialog open={open} onClose={handleCloseDialog}>
          <form noValidate onSubmit={handleUpdateTask}>
            <DialogContent>
              <TextField
                autoFocus
                margin="normal"
                label="タスク名"
                type="text"
                fullWidth
                name="title"
                defaultValue={selected?.title}
              />
              <TextField
                autoFocus
                margin="normal"
                label="詳細"
                type="text"
                fullWidth
                name="description"
                defaultValue={selected?.description}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default TodoList;
