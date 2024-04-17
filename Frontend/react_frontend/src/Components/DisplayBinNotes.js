import react from 'react'
import axios from 'axios'

const DisplayBinNotes = props => {
    const greyandpurple = { 'background-color': 'lightgrey', color: 'purple' }
    const [display_notes, set_display_notes] = react.useState({ jsx: [] })
    const [use_effect_flag, set_use_effect_flag] = react.useState(0)
    const [perm_delete_note_id, set_perm_delete_note_id] = react.useState('')
    react.useEffect(() => {
        const get_notes = async () => {
            const notes = await axios.get('http://127.0.0.1:5000/get_bin_notes')
            const notes_jsx = notes.data.map(note => {
                return (
                    <div className={`card ${(props.task_view_flag)?'col-sm-8':'col-sm-5'} mx-auto my-3 text-center`}>
                        <div style={greyandpurple} className="card-header">{(note.note_title.trim() === '') ? '{No Title}' : note.note_title}</div>
                        <a id={note._id} onClick={notes_move_click_handler} href='#' className="card-body text-decoration-none text-success">Restore</a>
                        <a style={greyandpurple} id={note._id} onClick={notes_move_click_handler} href='#' className="card-footer text-decoration-none fw-bold text-danger" data-bs-toggle="modal" data-bs-target="#permanent_delete_conformation_modal">Delete permanently</a>
                    </div>
                )
            })
            set_display_notes({ ...display_notes, jsx: notes_jsx })
        }
        get_notes()
    }, [use_effect_flag, props.use_effect_flag, props.task_view_flag])

    const notes_move_click_handler = async e => {
        if (e.target.className === 'card-body text-decoration-none text-success') {
            let parti_note = await axios.get(`http://127.0.0.1:5000/get_bin_note_by_id/${e.target.id}`)
            try { parti_note = { title: parti_note.data.note_title, editor_notes: parti_note.data.notes_jsx, notebook_name: parti_note.data.notebook_name } } catch { parti_note = { title: '', editor_notes: '', notebook_name: '_' } }
            console.log('NAME: ', parti_note.notebook_name)
            if (parti_note.notebook_name === '_') {
                axios.post('http://127.0.0.1:5000/post_notes', parti_note)
                console.log('After the request')
            }
            else if(parti_note.notebook_name !== '_') {
                axios.post(`http://127.0.0.1:5000/post_notes_to_notebook?note_book_name=${parti_note.notebook_name}`, parti_note)
            }
            axios.delete(`http://127.0.0.1:5000/delete_bin_note/${e.target.id}`)
            console.log('After delete')
            set_use_effect_flag((prev_flag) => !prev_flag)
        }
        else {
            set_perm_delete_note_id(e.target.id)
        }
    }

    const delete_permanently_click_handler = () => {
        console.log(perm_delete_note_id)
        axios.delete(`http://127.0.0.1:5000/delete_bin_note/${perm_delete_note_id}`)
        set_use_effect_flag((prev_flag) => !prev_flag)
    }

    return (
        <div className="container-sm">

            <div className=' row '>
                <div className='text-center '><label className='fst-italic col-sm-12 text-light fs-2'>Bin</label></div>
            </div>

            <div className="row">
                {display_notes.jsx}
            </div>
            <div class="modal fade" id="permanent_delete_conformation_modal">
                <div class="modal-dialog modal-dialog-centered modal-sm modal-fullscreen-sm-down">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div>Are you sure you want to delete it permanently ?</div>
                        </div>
                        <div class="modal-footer d-flex justify-content-between">
                            <button class="btn btn-success" data-bs-dismiss="modal">No</button>
                            <button onClick={delete_permanently_click_handler} class="btn btn-danger" data-bs-dismiss="modal">Yes, delete permanently </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DisplayBinNotes