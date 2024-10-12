import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addEmail: (state, action) => {
      const user = action.payload;

      state.users = user;
    },
  },
});

export const { addEmail } = userSlice.actions;
export default userSlice.reducer;
