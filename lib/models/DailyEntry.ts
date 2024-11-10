import mongoose, { Schema } from "mongoose";

const DailyEntrySchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    entries: {
        react_time: { type: String, required: true },
        react_native_time: { type: String, required: true },
        documentation_time: { type: String, required: true },
        components_built: { type: String, required: true },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const DailyEntry = mongoose.models.DailyEntry || mongoose.model("DailyEntry", DailyEntrySchema);
