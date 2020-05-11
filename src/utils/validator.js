const configs = {
  isMobileNum(val) {
    if (/^1[3456789]\d{9}$/.test(val)) {
      return true;
    }
    return false;
  },
  isNotEmpty(val) {
    // 是string需要trim
    const value = typeof val === 'string' ? val.trim() : val;

    if (value === '' || value === undefined || value === null) {
      return false;
    }
    return true;
  },
  maxLength(val, maxLength) {
    if (val.length <= maxLength) {
      return true;
    }
    return false;
  },
  isChecked(val) {
    if (val === false) {
      return false;
    }
    return true;
  },
  isIDCard(val) {
    if (!/^\d{17}(\d|x)$/i.test(val)) {
      return false;
    }
    return true;
  },
  isValidDate(val) {
    // const datePattern = /^\d{4}-\d{1,2}-\d{1,2}$/;
    const datePattern = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;
    return datePattern.test(val);
  },
};

// [
//  { rule: 'isStringEmpty', errMsg: '不能为空' },
//  { rule: 'isMobileNum', errMsg: '手机号不合法'},
//  { rule: 'maxLength:10', errMsg: '手机号不合法'},
// ]

/**
    validator.check('mobile', mobile, [
      { rule: 'isMobileNum', errMsg: '请输入正确的手机号' }
    ]);
    validator.check('code', code, [{ rule: 'isNotEmpty', errMsg: '请输入验证码' }]);
    const result = validator.runCheck().getErrors();
    or
    const result = validator.runCheck().getErrorsByField();

 */

class FormValidator {
  constructor() {
    this.validateFuncs = [];
    this.errorsByField = {};
    this.errors = [];
  }
  check(filedName, value, rules) {
    rules.forEach((item) => {
      const rule = item.rule.split('=')[0];
      const param = item.rule.split('=')[1] || undefined;
      const checkFn = () => {
        const config = configs[rule];
        if (!config) {
          throw Error(`config file not contain the rule: ${rule}`);
        }
        if (!config(value, param)) {
          Object.assign(this.errorsByField, {
            [filedName]: item.errMsg,
          });
        }
      };
      this.validateFuncs.push(checkFn);
    });
  }
  runCheck() {
    this.validateFuncs.forEach((fn) => {
      fn();
    });
    return this;
  }
  getErrorsArray() {
    return Object.keys(this.errorsByField).map((key) => this.errorsByField[key]);
  }
  getErrorsByField(field) {
    if (field) {
      return this.errorsByField[field];
    }
    return this.errorsByField;
  }
}

export default FormValidator;
