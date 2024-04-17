import mongoose from "mongoose"

const note_books_schema = new mongoose.Schema({
    name: String,
})

const note_books_model = mongoose.model('note_books', note_books_schema)
export { note_books_model }