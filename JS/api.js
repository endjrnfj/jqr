var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  async function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  async function post(path, bodyObj) {
    const headers = {
      "content-type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  } //注册

  async function login(loginInfor) {
    const resp = await post("/api/user/login", loginInfor);
    const result = await resp.json();
    //
    if (result.code === 0) {
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  } //登录

  async function exists(loginId) {
    const resp = await get(`/api/user/exists?loginId=${loginId}`);
    return await resp.json();
  } //验证账号

  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  } // 当前用户信息

  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  } //发送聊天消息

  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  } //获取聊天记录

  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  } // 退出登录
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
