import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { notes_model, notes_bin_model, notes_archive_model, notes_schema } from './MongoShemas/Notes.js'
import { note_books_model } from './MongoShemas/Notebooks.js'
import mongoose from 'mongoose'
const serve = express()

serve.use(bodyParser.json())
serve.use(cors())

serve.post('/post_notes', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_model.create({ note_title: req.body.title, notes_jsx: req.body.editor_notes })
    console.log(notes_model)
    res.status(200).send('Notes Posted Successfully !!!')
})

serve.get('/get_notes', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const Notes = await notes_model.find()
    res.status(200).json(Notes)
})

serve.get('/get_note_by_id/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const Note = await notes_model.findById({ _id: req.params.id })
    res.status(200).json(Note)
})

serve.put('/update_note/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_model.updateOne({ _id: req.params.id }, { note_title: req.body.title, notes_jsx: req.body.editor_notes })
    res.status(200).send('Updated Successfully !!!')
})

serve.post('/post_to_bin', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_bin_model.create({ note_title: req.body.title, notes_jsx: req.body.notes, notebook_name: req.query.notebook_name })
    res.send('Moved to bin')
})

serve.delete('/delete_note/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_model.deleteOne({ _id: req.params.id })
    res.send('Note Deleted')
})

serve.get('/get_bin_notes', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const bin_notes = await notes_bin_model.find()
    res.status(200).json(bin_notes)
})

serve.get('/get_archive_notes', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const archive_notes = await notes_archive_model.find()
    res.status(200).json(archive_notes)
})

serve.get('/get_bin_note_by_id/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const bin_note = await notes_bin_model.findById({ _id: req.params.id })
    res.status(200).json(bin_note)
})

serve.delete('/delete_bin_note/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_bin_model.deleteOne({ _id: req.params.id })
    res.status(200).send('Note moved out of Bin')
})

serve.post('/post_to_archive', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_archive_model.create({ note_title: req.body.title, notes_jsx: req.body.notes, notebook_name: req.query.notebook_name })
    res.status(200).send('Note Archived')
})

serve.get('/get_archive_note_by_id/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const archive_note = await notes_archive_model.findById({ _id: req.params.id })
    res.status(200).json(archive_note)
})

serve.put('/update_archive_note/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_archive_model.updateOne({ _id: req.params.id }, { note_title: req.body.title, notes_jsx: req.body.editor_notes })
    res.status(200).send('Updated Successfully !!!')
})

serve.delete('/delete_archive_note/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await notes_archive_model.deleteOne({ _id: req.params.id })
    res.status(200).send('Note unarchived')
})

serve.post('/create_new_notebook', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    await note_books_model.create({ name: req.query.note_book_name })
    mongoose.model(req.query.note_book_name, notes_schema) // try to optimise this by using then() after the previous line.
    res.status(200).send('Notebook Created')
})

serve.get('/get_notebooks', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const note_books = await note_books_model.find()
    res.status(200).json(note_books)
})

serve.get('/get_notes_from_notebook', async (req, res, next) => {
    console.log(req.query.note_book_name)
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const notebook_model = mongoose.model(req.query.note_book_name, notes_schema)
    const notes = await notebook_model.find()
    res.status(200).json(notes)
})

serve.put('/update_note_from_notebook/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const notebook_model = mongoose.model(req.query.note_book_name, notes_schema)
    await notebook_model.updateOne({ _id: req.params.id }, { note_title: req.body.title, notes_jsx: req.body.editor_notes })
    res.status(200).send('Updated Successfully !!!')
})

serve.post('/post_notes_to_notebook', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const notebook_model = mongoose.model(req.query.note_book_name, notes_schema)
    await notebook_model.create({ note_title: req.body.title, notes_jsx: req.body.editor_notes })
    res.status(200).send('Notes Posted')
})

serve.get('/get_note_from_notebook_by_id/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const notebook_model = mongoose.model(req.query.note_book_name, notes_schema)
    const note = await notebook_model.findById({ _id: req.params.id })
    res.status(200).json(note)
})

serve.delete('/delete_note_from_notebook/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const notebook_model = mongoose.model(req.query.note_book_name, notes_schema)
    await notebook_model.deleteOne({ _id: req.params.id })
    res.status(200).send('Note Deleted')
})

serve.delete('/delete_notebook/:id', async (req, res, next) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Notes_Database')
    const db = mongoose.connection
    db.collection(req.query.note_book_name).drop().then(async () => {
        await note_books_model.deleteOne({ _id: req.params.id })
    })
    res.status(200).send('Notebook deleted')
})

serve.all('*', (req, res, next) => {
    res.send('Nothing to show')
})

serve.listen(5000, () => {
    console.log('Server listening on port 5000.....')
})