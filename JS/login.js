// 通用代码
/**
 *
 */
class FieldValidator {
  /**
   *
   * @param {String} txtId 文本框ID
   * @param {Function} validatorFunc 验证规则函数，验证时调用
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }
  /**
   * 有错false，无错true
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   *
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const results = await Promise.all(proms);
    return results.every((r) => r);
  }
}
const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
}); //账号验证

const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
}); //密码验证

const form = $(".user-form");

form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return;
  }
  const formData = new FormData(form); // 传入表单dom，得到表单数据对象
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功，点击确定");
    location.href = "./index.html";
  } else {
    alert("登录失败，请检查账号和密码");
    loginPwdValidator.input.value = "";
  }
};
