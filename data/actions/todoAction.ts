"use server";

import supabase from "@/lib/supabase";

export const getAllTodo = async () => {
  // todo: edit
  const uid = "";
  try {
    let { data: todo, error } = await supabase
      .from("todos")
      .select("*")
      .is("deleted_at", null);
    // .eq("uid", uid);

    console.log(todo, error, "action");
    if (error) throw error;

    return todo;
  } catch (error) {
    console.error("getTodo error: ", error);
    throw error;
  }
};

export const postTodo = async (todo: string) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ todo: todo }])
      .select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("postTodo", error);
  }
};
export const editTodo = async (todo: string, id: string) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({ todo: todo })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("editTodo", error);
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({ deleted_at: new Date() })
      .eq("id", id)
      .select();

    console.log("data", data, "error", error);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("deleteTodo", error);
  }
};

export const complatedTodo = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({ completed_at: new Date() })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("complatedTodo", error);
  }
};
