import Teacher from "../models/teacherModel.js"; 

export const TeacherLogin = async (req, res) => {
  try {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const teacherUsername = `teacher${randomNumber}`;

    const newTeacher = new Teacher({ username: teacherUsername });
    await newTeacher.save(); 
    res.status(201).json({
      status: "success",
      username: newTeacher.username,
    });
  } catch (error) {
    console.error("Error in TeacherLogin:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
