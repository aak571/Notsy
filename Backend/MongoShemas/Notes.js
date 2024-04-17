import mongoose from "mongoose"

const notes_schema = new mongoose.Schema({
    note_title: String,
    notes_jsx: String
})

const notes_bin_archive_schema = new mongoose.Schema({
    note_title: String,
    notes_jsx: String,
    notebook_name: String
})

const notes_model = mongoose.model('notes', notes_schema)
const notes_bin_model = mongoose.model('notes_bin', notes_bin_archive_schema)
const notes_archive_model = mongoose.model('notes_archive', notes_bin_archive_schema)
export {notes_model, notes_bin_model, notes_archive_model, notes_schema}