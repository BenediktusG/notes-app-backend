class NotesHandler {
    constructor(services) {
        this._services = services;
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    postNoteHandler(request, h) {
        try {
            const {title = 'untitled', body, tags} = request.payload;

            const noteId = this._services.addNote({title, body, tags});
    
            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId,
                },
            });
            response.code(201);
            return response; 
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }

    getNotesHandler(request, h) {
        const notes = this._services.getNotes();
        const response = h.response({
            status: 'success',
            data: {
                notes,
            },
        });
        response.code(200);
        return response;
    }

    getNoteByIdHandler(request, h) {
        try {
            const {id} = request.params;
            const note = this._services.getNoteById(id);
            return {
                status: 'success',
                data: {
                    note,
                },
            };
        } catch (err) {
            const response = h.response({
                status: 'fail',
                message: err.message,
            });
            response.code(404);
            return response;
        }
    }

    putNoteByIdHandler(request, h) {
        try {
            const {id} = request.params;
            this._services.editNoteById(id, request.payload);

            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (err) {
            const response = h.response({
                status: 'fail',
                message: err.message,
            });
            response.code(404);
            return response;
        }
    }

    deleteNoteByIdHandler(request, h) {
        try {
            const {id} = request.params;
            this._services.deleteNoteById(id);

            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            }
        } catch (err) {
            const response = h.response({
                status: 'fail',
                message: err.message,
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = NotesHandler;