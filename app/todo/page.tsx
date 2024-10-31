import TodoCreate from "@/components/Todo/TodoCreate";
import TodoList from "@/components/Todo/TodoList";
import { getAllTodo, deleteTodo, editTodo } from "@/data/actions/todoAction";

async function page() {
  const todos = await getAllTodo();
  // console.log(todos, "todos page");

  const dynamic = "force-dynamic";

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-lg md:space-y-5 space-y-3 px-3">
        <TodoCreate />
        <TodoList todos={todos} />
      </div>
    </div>
  );
}

export default page;
