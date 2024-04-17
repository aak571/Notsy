import react from 'react'
import axios from 'axios'
import ReactQuill from 'react-quill'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'react-quill/dist/quill.snow.css'
window.katex = katex

const DisplayNotes = props => {
    const styles_editor_height = { height: '420px' }
    const greyandpurple = { 'background-color': 'lightgrey', color: 'purple' }
    const [display_notes, set_display_notes] = react.useState({ jsx: [] })
    const [open_editor, set_open_editor] = react.useState({ flag: 0, id: 0, parti_note: '' })
    const [editor_data, set_editor_data] = react.useState({ title: '', editor_notes: '' })
    const [text_editor_display, set_text_editor_display] = react.useState(0)
    react.useEffect(() => {
        const get_notes = async () => {
            const notes = await axios.get('http://127.0.0.1:5000/get_notes')
            const notes_jsx = notes.data.map(note => {
                return (
                    <div className={`card ${(props.task_view_flag) ? 'col-sm-8' : 'col-sm-5'} mx-auto my-3 text-center`}>
                        <div style={greyandpurple} className="card-header text-decoration-underline fw-bold ">{(note.note_title.trim() === '') ? '{No Title}' : note.note_title}</div>
                        <a id={note._id} onClick={open_note_click_handler} href='#' className="text-decoration-none my-2">Open</a>
                        <div style={greyandpurple} className='card-footer'>
                            <a id={note._id} onClick={move_to_archive_click_handler} href='#' className="text-decoration-none mx-5 fw-bold text-success">Archive</a>
                            <a id={note._id} onClick={move_to_trash_click_handler} href='#' className="text-decoration-none fw-bold text-danger">Move to trash</a>
                        </div>
                    </div>
                )
            })
            set_display_notes({ ...display_notes, jsx: notes_jsx })
        }
        get_notes()
    }, [text_editor_display, props.use_effect_flag, props.task_view_flag])

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

    const editor_display_click_handler = async () => {
        if (text_editor_display) {
            if (open_editor.flag) {
                if (open_editor.parti_note.data.notes_jsx !== editor_data.editor_notes || open_editor.parti_note.data.note_title !== editor_data.title) {
                    axios.put(`http://127.0.0.1:5000/update_note/${open_editor.id}`, editor_data)
                }
                set_open_editor({ ...open_editor, flag: 0 })
            }
            else {
                axios.post('http://127.0.0.1:5000/post_notes', editor_data)
            }
        }
        set_editor_data({ ...editor_data, title: '', editor_notes: '' })
        set_text_editor_display((prev_flag) => !prev_flag)
    }

    const editor_onchange_handler = editor_editor_data => {
        set_editor_data({ ...editor_data, editor_notes: editor_editor_data })
    }
    const title_onchange_handler = e => {
        set_editor_data({ ...editor_data, title: e.target.value })
    }

    const open_note_click_handler = async e => {
        const parti_note = await axios.get(`http://127.0.0.1:5000/get_note_by_id/${e.target.id}`)
        set_editor_data({ ...editor_data, title: parti_note.data.note_title, editor_notes: parti_note.data.notes_jsx })
        set_open_editor({ flag: (prev_flag) => !prev_flag, id: e.target.id, parti_note: parti_note })
        set_text_editor_display((prev_flag) => !prev_flag)
    }

    const move_to_trash_click_handler = async e => {
        let parti_note = await axios.get(`http://127.0.0.1:5000/get_note_by_id/${e.target.id}`)
        try {
            parti_note = { title: parti_note.data.note_title, notes: parti_note.data.notes_jsx }
        } catch { parti_note = { title: '', notes: '' } }
        axios.post('http://127.0.0.1:5000/post_to_bin?notebook_name=_', parti_note)
        axios.delete(`http://127.0.0.1:5000/delete_note/${e.target.id}`)
        set_text_editor_display(1)
        set_text_editor_display(0)
    }

    const move_to_archive_click_handler = async e => {
        let parti_note = await axios.get(`http://127.0.0.1:5000/get_note_by_id/${e.target.id}`)
        try {
            parti_note = { title: parti_note.data.note_title, notes: parti_note.data.notes_jsx }
        } catch { parti_note = { title: '', notes: '' } }
        axios.post('http://127.0.0.1:5000/post_to_archive?notebook_name=_', parti_note)
        axios.delete(`http://127.0.0.1:5000/delete_note/${e.target.id}`)
        set_text_editor_display(1)
        set_text_editor_display(0)
    }
    (editor_data.title) ? console.log(editor_data.title) : console.log('Empty')
    return (
        <div className="container-sm">
            <div className=' row mt-2'>
                <div className='text-center '><label className='fst-italic col-sm-12 fs-2 text-light'>Notes</label></div>
                <div className='text-center'><a href='#' onClick={editor_display_click_handler} className='col-sm-5 text-decoration-none fs-3 mx-5'>{(text_editor_display) ? 'I am done.' : 'Start Noting.....'}</a></div>
            </div>
            {text_editor_display && <div className='row'>
                <input className='col-sm-3 mx-3 my-1 rounded' value={editor_data.title} onChange={title_onchange_handler} placeholder='Title (upto 75 characters only)' />
                <ReactQuill id='quill_editor' className='text-light' style={styles_editor_height} theme="snow" value={editor_data.editor_notes} placeholder="Type what's in your mind" onChange={editor_onchange_handler} modules={{ toolbar: toolbarOptions, formula: true }} />
            </div>}
            {!text_editor_display && <div className="row">
                {display_notes.jsx}
            </div>}
        </div>
    )
}
export default DisplayNotes