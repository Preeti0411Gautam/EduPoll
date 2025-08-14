import Poll from "../models/pollModel.js"; // Default import for Mongoose model

export const createPoll = async (pollData) => {
  const newPoll = new Poll(pollData); // ✅ new Poll(...) instead of Poll(...)
  await newPoll.save();
  return newPoll;
};

export const voteOnOption = async (pollId, optionText) => {
  try {
    const poll = await Poll.findOneAndUpdate(
      { _id: pollId, "options.text": optionText },
      { $inc: { "options.$.votes": 1 } },
      { new: true }
    );

    console.log("Vote registered successfully:", poll);
  } catch (error) {
    console.error("Error registering vote:", error);
  }
};

export const getPolls = async (req, res) => {
  try {
    const { teacherUsername } = req.params;
    const data = await Poll.find({ teacherUsername });

    res.status(200).json({
      data,
    });
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
