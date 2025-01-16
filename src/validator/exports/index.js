const InvariantError = require("../../exceptions/InvariantError");
const { ExportNotesPayloadSchema } = require("./schema")

const ExportsValidator = {
    validateExportNotesPayload: (payload) => {
        const validationResult = ExportNotesPayloadSchema.validate(payload);
        console.log(validationResult);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator;