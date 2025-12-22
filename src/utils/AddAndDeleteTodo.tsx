import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../api/todos';

export const newTodo = async (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = async (id: number): Promise<void> => {
  await client.delete(`/todos/${id}`);
};
