import { fieldNames } from "./const.js";

var uploadFields = {};

class UploadFields {
  static getFields(config) {
    if (!uploadFields[config.fieldName]) {
      let fieldsInstance;
      switch (config.fieldName) {
        case fieldNames.GYM_CLASS:
          fieldsInstance = new GymClassUploadFields(config);
          break;

        case fieldNames.REGISTER:
          fieldsInstance = new RegisterUploadFields();
          break;

        default:
          break;
      }
      uploadFields[config.fieldName] = fieldsInstance?.fields ?? [];
    }

    return uploadFields[config.fieldName];
  }
}
class GymClassUploadFields extends UploadFields {
  constructor(config) {
    super();
    this.fields = Array.from({ length: 1000 }, (_, index) => ({
      name: `${config.fieldName}[${index}][file]`,
      maxCount: 1,
    }));
  }
}
class RegisterUploadFields extends UploadFields {
  constructor() {
    super();
    this.fields = [
      { name: "profile", maxCount: 1 },
      { name: "nid_picture", maxCount: 2 },
      { name: "company_reg_certicate", maxCount: 1 },
    ];
  }
}

export default UploadFields;
