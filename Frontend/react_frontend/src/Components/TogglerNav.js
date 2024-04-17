import react from 'react'
import axios from 'axios'
import DisplayNotes from "./DisplayNotes"
import DisplayBinNotes from "./DisplayBinNotes"
import DisplayArchiveNotes from "./DisplayArchiveNotes"
import DisplayNotebook from './DisplayNotebook'

const Nav_Toggler = () => {
    const gray_backgroud_styles = { 'background-color': 'grey' }
    const lightpink = { 'background-color': 'lightpink' }
    const gold = { 'background-color': 'gold' } // lightsalmon
    const gold1 = { 'color': 'gold' } //
    const chartreuse = { 'color': 'chartreuse' } // lightsalmon

    const [render_control, set_render_control] = react.useState({ notes_render: 1, bin_notes_render: 0, archive_notes_render: 0, notebook_render: 0, notes_use_effect: 0, bin_use_effect: 0, archive_use_effect: 0, notebook_name: '', notebook_id: '' })
    const [new_notebook_name, set_new_notebook_name] = react.useState('')
    const [note_books, set_note_books] = react.useState({ jsx: <></>, notebooks_array: [] })
    const [task_view_flag, set_task_view_flag] = react.useState(0)
    react.useEffect(() => {
        let notebooks_array
        const get_notebooks = async () => {
            const notebook_names = await axios.get('http://127.0.0.1:5000/get_notebooks')
            notebooks_array = notebook_names.data.map(notebook_name => notebook_name.name)
            set_note_books({ ...note_books, notebooks_array: notebooks_array })
        }
        get_notebooks()
    }, [])

    const nav_menus_click_handler = e => {
        switch (e.target.id) {
            case 'notes':
                set_render_control({ ...render_control, notes_render: 1, bin_notes_render: 0, archive_notes_render: 0, notebook_render: 0, notes_use_effect: render_control.notes_use_effect + 1 })
                break
            case 'archive_notes':
                set_render_control({ ...render_control, notes_render: 0, bin_notes_render: 0, archive_notes_render: 1, notebook_render: 0, archive_use_effect: render_control.archive_use_effect + 1 })
                break
            case 'bin_notes':
                set_render_control({ ...render_control, notes_render: 0, bin_notes_render: 1, archive_notes_render: 0, notebook_render: 0, bin_use_effect: render_control.bin_use_effect + 1 })
                break
            default:
        }
        set_new_notebook_name('')
    }

    const new_notebook_name_onchange_handler = e => {
        set_new_notebook_name(e.target.value)
    }

    const create_new_notebook_click_handler = () => {
        if (!note_books.notebooks_array.find((notebook_name) => notebook_name === new_notebook_name) && new_notebook_name.trim() !== '')
            axios.post(`http://127.0.0.1:5000/create_new_notebook?note_book_name=${new_notebook_name}`)
        set_new_notebook_name('')
    }

    const noteboooks_dropdown_click_handler = async () => {
        const notebook_names = await axios.get('http://127.0.0.1:5000/get_notebooks')
        const notebooks_array = []
        let notebooks_jsx = notebook_names.data.map(notebook_name => {
            notebooks_array.push(notebook_name.name)
            return (
                <div>
                    <div className='d-flex justify-centent-between'>
                        <a id={notebook_name.name} onClick={notebook_click_handler} className="dropdown-item " href="#">{notebook_name.name}</a>
                        <a id={notebook_name.name} onClick={delete_notebook_click_handler} className={`${notebook_name._id} me-3 text-decoration-none text-danger`} href='#' data-bs-toggle="modal" data-bs-target="#notebook_delete_conformation_modal">delete</a>
                    </div>
                </div>
            )
        })
        set_note_books({ ...note_books, jsx: notebooks_jsx, notebooks_array: notebooks_array })
    }

    const delete_notebook_click_handler = e => {
        set_render_control({ ...render_control, notebook_name: e.target.id, notebook_id: e.target.className.split(' ')[0] })
    }

    const delete_notebook_permanently_click_handler = () => {
        axios.delete(`http://127.0.0.1:5000/delete_notebook/${render_control.notebook_id}?note_book_name=${render_control.notebook_name}`)
        set_render_control({ ...render_control, notes_render: 1, bin_notes_render: 0, archive_notes_render: 0, notebook_render: 0 })
    }

    const notebook_click_handler = e => {
        set_render_control({ ...render_control, notes_render: 0, bin_notes_render: 0, archive_notes_render: 0, notebook_render: 1, notebook_name: e.target.id })
    }

    const task_view_click_handler = () => {
        set_task_view_flag((prev_flag) => !prev_flag)
    }

    return (
        <div>
            <div style={gray_backgroud_styles} class="collapse" id="inside_content">
                <div class="p-4 text-center">
                    <div className="my-3"><a style={chartreuse}  id='notes' className="text-decoration-none fw-bold " onClick={nav_menus_click_handler} href="#">Notes<br /></a></div>
                    <div className="my-3">
                        <a style={chartreuse}   className="text-decoration-none fw-bold" onClick={nav_menus_click_handler} href="#" data-bs-toggle="collapse" data-bs-target="#new_notebook_creation_form">Create Notebook<br /></a>
                        <div className="my-3 ">
                            <div id="new_notebook_creation_form" class="collapse">
                                <div class='d-flex justify-content-center'>
                                    <input style={lightpink} onChange={new_notebook_name_onchange_handler} value={new_notebook_name} placeholder='Enter notebook name' className='rounded '></input>
                                    <button onClick={create_new_notebook_click_handler} class='btn ms-3 border border-3 bg-success text-light' data-bs-toggle="collapse" data-bs-target="#new_notebook_creation_form">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-3"><a style={chartreuse}   id='archive_notes' className="text-decoration-none fw-bold" onClick={nav_menus_click_handler} href="#">Archive<br /></a></div>
                    <div className="my-3"><a style={chartreuse}   id='bin_notes' className="text-decoration-none fw-bold" onClick={nav_menus_click_handler} href="#">Bin<br /></a></div>
                </div>
            </div>
            <div class="navbar">
                <div class="container-fluid">
                    <button class="navbar-toggler mx-auto bg-light" data-bs-toggle="collapse" data-bs-target="#inside_content"></button>
                </div>
            </div>

            <div className='container-sm'>
                <div className="d-flex justify-content-between">
                    <div className="dropdown">
                        <button style={gold} onClick={noteboooks_dropdown_click_handler} className="btn border dropdown-toggle" data-bs-toggle="dropdown">Notebooks</button>
                        <ul class="dropdown-menu">
                            {note_books.jsx}
                        </ul>
                    </div>
                    <h1 className='font-monospace text-info fw-bold '>Notsy</h1>
                    <a style={gold1} onClick={task_view_click_handler} className="col-sm-1 navbar text-decoration-none " href='#'>Switch View</a>
                </div>
            </div>

            <div class="modal fade" id="notebook_delete_conformation_modal">
                <div class="modal-dialog modal-dialog-centered modal-md modal-fullscreen-sm-down">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div>This will permanently delete <span className='fw-bold'>'{render_control.notebook_name}'</span> along with all the notes in it.<br /> <div className='text-center'><span className='fw-bold'>Are you sure ?</span></div></div>
                        </div>
                        <div class="modal-footer d-flex justify-content-between">
                            <button class="btn btn-success" data-bs-dismiss="modal">No</button>
                            <button onClick={delete_notebook_permanently_click_handler} class="btn btn-danger" data-bs-dismiss="modal">Yes, Go ahead </button>
                        </div>
                    </div>
                </div>
            </div>

            {render_control.notes_render && <DisplayNotes use_effect_flag={render_control.notes_use_effect} task_view_flag={task_view_flag} />}
            {render_control.bin_notes_render && <DisplayBinNotes use_effect_flag={render_control.bin_use_effect} task_view_flag={task_view_flag} />}
            {render_control.archive_notes_render && <DisplayArchiveNotes use_effect_flag={render_control.archive_use_effect} task_view_flag={task_view_flag} />}
            {render_control.notebook_render && <DisplayNotebook notebook_name={render_control.notebook_name} task_view_flag={task_view_flag} />}
        </div >
    )
}
export default Nav_Toggler