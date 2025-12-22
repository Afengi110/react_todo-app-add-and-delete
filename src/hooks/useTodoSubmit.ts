// hooks/useTodoSubmit.ts
import { useCallback } from 'react';
import { createTempTodo, validateInput } from '../utils/todoHelpers';
import { Todo } from '../types/Todo';

interface UseTodoSubmitParams {
  input: string;
  setInput: (value: string) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onError: (message: string) => void;
  postTodo: (input: string) => Promise<Todo>;
  USER_ID: number;
}

export const useTodoSubmit = ({
  input,
  setInput,
  setTodos,
  setTempTodo,
  setErrorMessage,
  inputRef,
  onError,
  postTodo,
  USER_ID,
}: UseTodoSubmitParams) => {
  return useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') {
        return;
      }

      e.preventDefault();
      const error = validateInput(input);

      if (error) {
        onError(error);
        setTempTodo(null);

        return;
      }

      const tempTodo = createTempTodo(input.trim(), USER_ID);

      setTempTodo(tempTodo);

      try {
        const newTodo = await postTodo(input.trim());

        if (newTodo) {
          setTempTodo(null);
          setTodos((prev: Todo[]) => [...prev, newTodo]);
          setInput('');
          setErrorMessage('');
          inputRef.current?.focus();
        }
      } catch {
        onError('Unable to add a todo');
        setTempTodo(null);
      }
    },
    [
      input,
      setInput,
      setTodos,
      setTempTodo,
      setErrorMessage,
      inputRef,
      onError,
      postTodo,
      USER_ID,
    ],
  );
};
