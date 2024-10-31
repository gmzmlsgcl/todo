"use client";
import { Input } from "@/components/ui/input";
import { MdDelete } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { complatedTodo, deleteTodo, editTodo } from "@/data/actions/todoAction";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

function TodoList({ todos: initialTodos }: any) {
  const router = useRouter();
  const [todos, setTodos] = useState(initialTodos);
  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    value: string;
  } | null>(null);

  console.log(initialTodos, "initial todos");

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    // setTodos(todos.filter((todo: any) => todo.id !== id));

    router.refresh();
    toast({
      title: "Successful",
      description: "Todo deleted",
      variant: "destructive",
    });
  };

  const handleUpdate = async (id: string) => {
    if (editingTodo && editingTodo.id === id) {
      await editTodo(editingTodo.value, id);
      setTodos(
        todos.map((todo: any) =>
          todo.id === id ? { ...todo, todo: editingTodo.value } : todo
        )
      );
      setEditingTodo(null);
      toast({
        title: "Successful",
        description: "Todo updated",
      });
    }
  };

  const handleCompleted = async (id: string) => {
    await complatedTodo(id);
    setTodos(
      todos.map((todo: any) =>
        todo.id === id ? { ...todo, completed_at: new Date() } : todo
      )
    );
  };

  const startEditing = (id: string, value: string) => {
    setEditingTodo({ id, value });
  };

  return (
    <div className="w-full flex justify-center items-center flex-col">
      {todos.map((todo: any) => (
        <div key={todo.id} className="w-full relative flex items-center">
          <Input
            className="border-none w-full border-b border-light-gray outline-none focus-visible:ring-0 shadow-lg rounded-full pl-9"
            type="text"
            value={
              editingTodo && editingTodo.id === todo.id
                ? editingTodo.value
                : todo.todo
            }
            onChange={(e) =>
              editingTodo && editingTodo.id === todo.id
                ? setEditingTodo({ id: todo.id, value: e.target.value })
                : null
            }
          />
          <div className="flex absolute right-0 pr-3 space-x-3 text-primary text-xl">
            {editingTodo && editingTodo.id === todo.id ? (
              <FaCheck
                className="cursor-pointer"
                onClick={() => handleUpdate(todo.id)}
              />
            ) : (
              <CiEdit
                className="cursor-pointer"
                onClick={() => startEditing(todo.id, todo.todo)}
              />
            )}
            <MdDelete
              className="cursor-pointer"
              onClick={() => handleDelete(todo.id)}
            />
          </div>

          <div className="cursor-pointer absolute left-0 pl-3 text-primary">
            {todo.completed_at ? (
              <CiCircleCheck />
            ) : (
              <FaRegCircle onClick={() => handleCompleted(todo.id)} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
