import react from 'react'
import axios from 'axios'
import ReactQuill from 'react-quill'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'react-quill/dist/quill.snow.css'
window.katex = katex

const DisplayArchiveNotes = props => {
    const styles_editor_height = { height: '400px' }
    const greyandpurple = { 'background-color': 'lightgrey', color: 'purple' }
    const [display_notes, set_display_notes] = react.useState({ jsx: [] })
    const [text_editor_display, set_text_editor_display] = react.useState(0)
    const [editor_data, set_editor_data] = react.useState({ title: '', editor_notes: '', note_id: 0, parti_note: '' })
    const [use_effect_flag, set_use_effect_flag] = react.useState(0)
    react.useEffect(() => {
        const get_notes = async () => {
            const notes = await axios.get('http://127.0.0.1:5000/get_archive_notes')
            const notes_jsx = notes.data.map(note => {
                return (
                    <div className={`card ${(props.task_view_flag)?'col-sm-8':'col-sm-5'} mx-auto my-3 text-center`}>
                        <div style={greyandpurple} className="card-header fw-bold text-decoration-underline">{(note.note_title.trim() === '') ? '{No Title}' : note.note_title}</div>
                        <a id={note._id} onClick={archive_note_click_handler} href='#' className="card-body fw-bold text-success text-decoration-none">Edit</a>
                        <a style={greyandpurple} id={note._id} onClick={archive_note_click_handler} href='#' className="card-footer fw-bold text-primary text-decoration-none">Un-archive</a>
                    </div>
                )
            })
            set_display_notes({ ...display_notes, jsx: notes_jsx })
        }
        get_notes()
    }, [use_effect_flag, props.use_effect_flag, props.task_view_flag])  // can u avoid props and manage only with use_effect_flag ??? and also optimise useEffect()

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'size': ['small', 'normal', 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'header': 1 }, { 'header': 2 }],
        ['link', 'image', 'video', 'formula'],
        ['clean'],
    ]

    const archive_note_click_handler = async e => {
        let parti_note = await axios.get(`http://127.0.0.1:5000/get_archive_note_by_id/${e.target.id}`)
        if (e.target.className === 'card-body fw-bold text-success text-decoration-none') {
            set_editor_data({ ...editor_data, title: parti_note.data.note_title, editor_notes: parti_note.data.notes_jsx, note_id: e.target.id, parti_note: parti_note })
            set_text_editor_display((prev_flag) => !prev_flag)
        }
        else {
            try { parti_note = { title: parti_note.data.note_title, editor_notes: parti_note.data.notes_jsx, notebook_name: parti_note.data.notebook_name } } catch { parti_note = { title: '', editor_notes: '' } }
            if (parti_note.notebook_name === '_') {
                axios.post('http://127.0.0.1:5000/post_notes', parti_note)
            }
            else {
                axios.post(`http://127.0.0.1:5000/post_notes_to_notebook?note_book_name=${parti_note.notebook_name}`, parti_note)
            }
            axios.delete(`http://127.0.0.1:5000/delete_archive_note/${e.target.id}`)
        }
        set_use_effect_flag((prev_flag) => !prev_flag)
    }

    const editor_display_click_handler = () => {
        if (editor_data.parti_note.data.notes_jsx !== editor_data.editor_notes || editor_data.parti_note.data.note_title !== editor_data.title) {
            axios.put(`http://127.0.0.1:5000/update_archive_note/${editor_data.note_id}`, editor_data)
            set_use_effect_flag((prev_flag) => !prev_flag)
        }
        set_text_editor_display((prev_flag) => !prev_flag)
    }

    const title_onchange_handler = e => {
        set_editor_data({ ...editor_data, title: e.target.value })
    }

    const editor_onchange_handler = editor_editor_data => {
        set_editor_data({ ...editor_data, editor_notes: editor_editor_data })
    }

    return (
        <div className="container-sm">
            <div className=' row '>
                <div className='text-center '><label className='fst-italic col-sm-12 text-light fs-2'>Archive</label></div>
            </div>
            {text_editor_display && <div>
                <div className='text-center'>

                    <a href='#' onClick={editor_display_click_handler} className='text-decoration-none fs-3 mx-5'>I am done.</a>
                </div>
                <div className='row'>
                    <input className='col-sm-3 mx-3 rounded' value={editor_data.title} onChange={title_onchange_handler} placeholder='Title (upto 75 characters only)' />
                    <ReactQuill id='quill_editor' className='text-light' style={styles_editor_height} theme="snow" value={editor_data.editor_notes} placeholder="Type what's in your mind" onChange={editor_onchange_handler} modules={{ toolbar: toolbarOptions, formula: true }} />
                </div>
            </div>}
            {!text_editor_display && <div className="row">
                {display_notes.jsx}
            </div>}
        </div>
    )
}
export default DisplayArchiveNotes