import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  username: String,
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;
